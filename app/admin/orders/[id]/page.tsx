import { use } from 'react';
import { fetchOrderById } from '@/lib/api/orders';
import { fetchSettings } from '@/lib/api/settings';
import AdminOrderDetailClient from './AdminOrderDetailClient';
import { notFound } from 'next/navigation';

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const [order, settings] = await Promise.all([
      fetchOrderById(id),
      fetchSettings()
    ]);

    if (!order) {
      notFound();
    }

    return <AdminOrderDetailClient initialOrder={order} settings={settings} />;
  } catch (error) {
    console.error('Error fetching order:', error);
    notFound();
  }
}
