import { fetchCustomerOrders } from '@/lib/api/orders';
import { getCurrentUser } from '@/lib/api/auth';
import AccountOverviewClient from './AccountOverviewClient';
import { redirect } from 'next/navigation';

export default async function AccountPage() {
  const session = await getCurrentUser();

  if (!session || !session.profile) {
    redirect('/login');
  }

  const orders = await fetchCustomerOrders(session.profile.id);

  return (
    <AccountOverviewClient 
      customer={session.profile} 
      orders={orders} 
    />
  );
}
