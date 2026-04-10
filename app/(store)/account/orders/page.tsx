import { fetchCustomerOrders } from '@/lib/api/orders';
import { getCurrentUser } from '@/lib/api/auth';
import { redirect } from 'next/navigation';
import AccountOrdersListClient from './AccountOrdersListClient';

export default async function AccountOrdersPage() {
  const session = await getCurrentUser();

  if (!session || !session.profile) {
    redirect('/login');
  }

  const orders = await fetchCustomerOrders(session.profile.id);

  return <AccountOrdersListClient initialOrders={orders} />;
}
