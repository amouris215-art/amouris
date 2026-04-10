import { fetchAllOrders } from '@/lib/api/orders';
import { fetchSettings } from '@/lib/api/settings';
import AdminOrdersClient from './AdminOrdersClient';

export default async function AdminOrdersPage() {
  const [orders, settings] = await Promise.all([
    fetchAllOrders(),
    fetchSettings()
  ]);

  return <AdminOrdersClient initialOrders={orders} settings={settings} />;
}
