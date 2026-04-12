import { createClient } from '@/lib/supabase/server';
import AdminCustomersClient from './AdminCustomersClient';

export default async function AdminCustomersPage() {
  const supabase = await createClient();

  const { data: profiles } = await supabase
    .from('profiles')
    .select('*, orders(id, total_amount)')
    .order('created_at', { ascending: false });

  const customers = (profiles || []).map(p => ({
    ...p,
    order_count: p.orders?.length || 0,
    total_spent: p.orders?.reduce((acc: number, o: any) => acc + (Number(o.total_amount) || 0), 0) || 0
  }));

  return <AdminCustomersClient initialCustomers={customers} />;
}
