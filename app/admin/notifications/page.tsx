import { createClient } from '@/lib/supabase/server';
import NotificationsClient from './NotificationsClient';

export const dynamic = 'force-dynamic';

export default async function NotificationsPage() {
  const supabase = await createClient();

  // Fetch initial data
  const { data: orders } = await supabase
    .from('orders')
    .select('id, order_number, created_at, guest_first_name, guest_last_name, total_amount, order_status')
    .order('created_at', { ascending: false })
    .limit(20);

  const { data: lowStockPerfumes } = await supabase
    .from('products')
    .select('id, name_fr, stock_grams')
    .eq('product_type', 'perfume')
    .lt('stock_grams', 500);

  const { data: lowStockVariants } = await supabase
    .from('flacon_variants')
    .select('id, size_ml, color_name, stock_units, products(name_fr)')
    .lt('stock_units', 10);

  return (
    <NotificationsClient 
      initialOrders={orders || []} 
      lowStockPerfumes={lowStockPerfumes || []}
      lowStockVariants={lowStockVariants || []}
    />
  );
}
