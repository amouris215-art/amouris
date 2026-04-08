'use server';

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { revalidatePath } from 'next/cache';
import { numberToArabicWords } from '@/lib/number-to-arabic-words';

export async function generateInvoice(orderId: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // 1. Fetch order details with profile join
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*, order_items(*), profiles(*)')
    .eq('id', orderId)
    .single();

  if (orderError || !order) {
    throw new Error('Order not found: ' + orderError?.message);
  }

  // 2. Get next invoice number
  const { data: invNum, error: invError } = await supabase.rpc('next_invoice_number');
  if (invError) throw new Error('Failed to generate invoice number');

  const invoice_number = `FAC-${String(invNum).padStart(6, '0')}`;

  // 3. Generate PDF (Premium Design)
  const doc = new jsPDF() as any;
  
  // Colors
  const EMERALD = [10, 107, 75]; // #0A6B4B
  const GOLD = [201, 168, 76];  // #C9A84C

  // Header Background
  doc.setFillColor(EMERALD[0], EMERALD[1], EMERALD[2]);
  doc.rect(0, 0, 210, 40, 'F');

  // Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text('AMOURIS PARFUMS', 20, 25);
  
  doc.setFontSize(10);
  doc.text('Luxe & Authenticité', 20, 33);

  // Invoice & Order Info (Gold Box)
  doc.setTextColor(0, 0, 0);
  doc.setDrawColor(GOLD[0], GOLD[1], GOLD[2]);
  doc.setLineWidth(0.5);
  doc.line(20, 45, 190, 45);

  doc.setFontSize(12);
  doc.text(`FACTURE: ${invoice_number}`, 20, 55);
  doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 150, 55);
  doc.text(`Commande: ${order.order_number}`, 20, 62);

  // Customer Details
  const customerName = order.profiles 
    ? `${order.profiles.first_name} ${order.profiles.last_name}` 
    : `${order.guest_first_name} ${order.guest_last_name}`;
  
  const shopName = order.profiles?.shop_name || 'Client de détail';
  const phone = order.profiles?.phone || order.guest_phone;
  const wilaya = order.profiles?.wilaya || order.guest_wilaya;

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text('FACTURÉ À:', 20, 75);
  doc.setTextColor(0);
  doc.setFontSize(11);
  doc.text(customerName, 20, 82);
  doc.text(shopName, 20, 88);
  doc.text(`Wilaya: ${wilaya}`, 20, 94);
  doc.text(`Tel: ${phone}`, 20, 100);

  // Shop Details (Right side)
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text('EXPÉDIÉ DE:', 120, 75);
  doc.setTextColor(0);
  doc.text('Amouris Parfums DZ', 120, 82);
  doc.text('Alger, Algérie', 120, 88);
  doc.text('contact@amouris.dz', 120, 94);

  // Items Table
  const items = (order.order_items || []).map((item: any) => [
    item.product_name_fr,
    item.quantity_grams ? `${item.quantity_grams}g` : `${item.quantity_units}u`,
    `${item.unit_price.toLocaleString()} DZD`,
    `${item.total_price.toLocaleString()} DZD`,
  ]);

  doc.autoTable({
    startY: 110,
    head: [['Désignation', 'Quantité', 'Prix Unitaire', 'Total']],
    body: items,
    headStyles: { fillColor: EMERALD, textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [245, 248, 246] },
    margin: { left: 20, right: 20 },
  });

  // Totals Area
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text('TOTAL:', 140, finalY + 5);
  doc.setFontSize(16);
  doc.setTextColor(EMERALD[0], EMERALD[1], EMERALD[2]);
  doc.text(`${order.total_amount.toLocaleString()} DZD`, 160, finalY + 5);

  // Arabic Total
  const totalInWords = numberToArabicWords(order.total_amount);
  doc.setFontSize(10);
  doc.setTextColor(80);
  doc.text(`Arrêté la présente facture à la somme de:`, 20, finalY + 20);
  doc.setTextColor(0);
  // Note: For true RTL Arabic in jsPDF, a custom font must be registered. 
  // Here we output the text which will be visible if the client environment supports standard fonts with glyphs.
  doc.text(totalInWords, 20, finalY + 28);

  // Payment Status Badge
  const statusColors: any = {
    paid: [40, 167, 69],
    partial: [255, 193, 7],
    unpaid: [220, 53, 69],
  };
  const statusLabels: any = {
    paid: 'PAYÉ',
    partial: 'PARTIEL',
    unpaid: 'NON PAYÉ',
  };

  const statusColor = statusColors[order.payment_status] || [100, 100, 100];
  doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.rect(140, finalY + 15, 50, 10, 'F');
  doc.setTextColor(255);
  doc.setFontSize(10);
  doc.text(statusLabels[order.payment_status], 165, finalY + 22, { align: 'center' });

  const pdfOutput = doc.output('arraybuffer');

  // 4. Upload to Storage
  const fileName = `${invoice_number}.pdf`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('invoices')
    .upload(fileName, pdfOutput, {
      contentType: 'application/pdf',
      upsert: true,
    });

  if (uploadError) throw new Error('PDF Upload failed: ' + uploadError.message);

  const { data: { publicUrl } } = supabase.storage.from('invoices').getPublicUrl(fileName);

  // 5. Create Invoice Record
  const { data: invoice, error: recordError } = await supabase
    .from('invoices')
    .insert([{
      invoice_number,
      order_id: orderId,
      pdf_url: publicUrl,
    }])
    .select()
    .single();

  if (recordError) throw new Error('Invoice record creation failed: ' + recordError.message);

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath('/account/orders');
  return invoice;
}

export async function getInvoiceByOrder(orderId: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('order_id', orderId)
    .single();

  if (error) return null;
  return data;
}

export async function getAllInvoices() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('invoices')
    .select('*, orders(order_number, total_amount, profiles(first_name, last_name, shop_name), guest_first_name, guest_last_name)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching invoices:', error);
    return [];
  }
  return data;
}
