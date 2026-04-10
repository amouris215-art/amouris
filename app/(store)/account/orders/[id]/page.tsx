import { fetchOrderById } from '@/lib/api/orders';
import { getCurrentUser } from '@/lib/api/auth';
import { redirect, notFound } from 'next/navigation';
import OrderDetailClient from './OrderDetailClient';

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await getCurrentUser();
  if (!session || !session.profile) {
    redirect('/login');
  }

  try {
    const order = await fetchOrderById(id);

    // Security: verify the order belongs to this customer
    if (order.customer_id && order.customer_id !== session.profile.id) {
      notFound();
    }

    return <OrderDetailClient order={order} />;
  } catch {
    notFound();
  }
}
