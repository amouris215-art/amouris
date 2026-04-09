'use server'

import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const fetchAllOrders = async () => {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('orders')
    .select(`
      *,
      items:order_items(*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const createOrder = async (data: any) => {
  const admin = createAdminClient();
  const { items, ...orderData } = data;

  // 1. Create Order
  const { data: order, error: orderError } = await admin
    .from('orders')
    .insert([orderData])
    .select()
    .single();

  if (orderError) throw orderError;

  // 2. Create Order Items
  const orderItems = items.map((item: any) => ({
    ...item,
    order_id: order.id
  }));

  const { error: itemsError } = await admin.from('order_items').insert(orderItems);
  if (itemsError) throw itemsError;

  // 3. Initial history
  await admin.from('order_history').insert({
    order_id: order.id,
    status: orderData.order_status,
    note: 'Commande créée'
  });

  return { ...order, items: orderItems };
};

export const updateOrderStatus = async (id: string, status: string, note?: string) => {
  const admin = createAdminClient();
  
  // Update order
  const { error: updateError } = await admin
    .from('orders')
    .update({ order_status: status })
    .eq('id', id);

  if (updateError) throw updateError;

  // Add history
  await admin.from('order_history').insert({
    order_id: id,
    status,
    note
  });

  return true;
};

export const updateOrderPayment = async (id: string, amountPaid: number) => {
  const admin = createAdminClient();
  const { data: order } = await admin.from('orders').select('total_amount').eq('id', id).single();
  
  if (!order) throw new Error('Order not found');

  const ps = amountPaid <= 0 ? 'unpaid' : amountPaid >= order.total_amount ? 'paid' : 'partial';

  const { error } = await admin
    .from('orders')
    .update({ amount_paid: amountPaid, payment_status: ps })
    .eq('id', id);

  if (error) throw error;
  return true;
};

export const updateOrderNotes = async (id: string, notes: string) => {
  const admin = createAdminClient();
  const { error } = await admin
    .from('orders')
    .update({ admin_notes: notes })
    .eq('id', id);

  if (error) throw error;
  return true;
};

export const generateInvoice = async (orderId: string, invoiceData: any) => {
  const admin = createAdminClient();
  
  // Generate invoice number if not present
  const invoiceNumber = `FAC-${Math.floor(Math.random() * 900000) + 100000}`;
  const finalData = { ...invoiceData, invoice_number: invoiceNumber };

  const { error } = await admin
    .from('orders')
    .update({ 
      invoice_generated: true, 
      invoice_data: finalData 
    })
    .eq('id', orderId);

  if (error) throw error;
  return invoiceNumber;
};
