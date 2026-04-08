import { getAllCustomers } from '@/lib/actions/customers';
import { getAllOrders } from '@/lib/actions/orders';
import AdminCustomersClient from './AdminCustomersClient';

export const dynamic = 'force-dynamic';

export default async function AdminCustomersPage() {
  const [customers, orders] = await Promise.all([
    getAllCustomers(),
    getAllOrders(),
  ]);

  return <AdminCustomersClient initialCustomers={customers} orders={orders} />;
}
