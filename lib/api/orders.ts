import { createClient } from '@/lib/supabase/client';

import { createAdminClient } from '@/lib/supabase/admin';

export const fetchAllOrders = async () => {
  
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items(*),
      customer:profiles(*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const fetchCustomerOrders = async (customerId: string) => {
  
  // Customers read own orders (via RLS if client, admin if server component with admin client)
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items(*)
    `)
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const fetchOrderById = async (id: string) => {
  
  const supabase = createClient();

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items(*),
      status_history:order_status_history(*),
      customer:profiles(*)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const createOrder = async (data: any) => {
  // Always use browser client if called from client
  const supabase = createClient();
  const { items, ...orderData } = data;

  // 1. Create Order
  const { data: order, error: orderError } = await supabase
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

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
  if (itemsError) throw itemsError;

  // 3. Initial history
  await supabase.from('order_status_history').insert({
    order_id: order.id,
    status: orderData.order_status || 'pending',
    note: 'Commande créée'
  });

  return { ...order, items: orderItems };
};

export const updateOrderStatus = async (id: string, status: string, note?: string) => {
  
  const supabase = createClient();
  
  // Update order
  const { error: updateError } = await supabase
    .from('orders')
    .update({ order_status: status })
    .eq('id', id);

  if (updateError) throw updateError;

  // Add history
  await supabase.from('order_status_history').insert({
    order_id: id,
    status,
    note
  });

  return true;
};

export const updateOrderPayment = async (id: string, amountPaid: number) => {
  
  const supabase = createClient();

  const { data: order } = await supabase.from('orders').select('total_amount').eq('id', id).single();
  
  if (!order) throw new Error('Order not found');

  const ps = amountPaid <= 0 ? 'unpaid' : amountPaid >= order.total_amount ? 'paid' : 'partial';

  const { error } = await supabase
    .from('orders')
    .update({ amount_paid: amountPaid, payment_status: ps })
    .eq('id', id);

  if (error) throw error;
  return true;
};

export const updateOrderNotes = async (id: string, notes: string) => {
  
  const supabase = createClient();

  const { error } = await supabase
    .from('orders')
    .update({ admin_notes: notes })
    .eq('id', id);

  if (error) throw error;
  return true;
};

export const generateInvoice = async (orderId: string, invoiceData: any) => {
  
  const supabase = createClient();
  
  // Create deterministic fake ID
  const invoiceNumber = `FAC-${Math.floor(Math.random() * 900000) + 100000}`;
  const finalData = { ...invoiceData, invoice_number: invoiceNumber };

  const { error } = await supabase
    .from('orders')
    .update({ 
      invoice_generated: true, 
      invoice_data: finalData 
    })
    .eq('id', orderId);

  if (error) throw error;
  return invoiceNumber;
};
