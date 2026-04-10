import { fetchAllOrders } from '@/lib/api/orders';
import InvoicesClient from './InvoicesClient';

export default async function AdminInvoicesPage() {
  const orders = await fetchAllOrders({ status: 'admin' });

  return <InvoicesClient initialOrders={orders} />;
}
