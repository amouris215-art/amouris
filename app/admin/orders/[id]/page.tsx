import { getOrderById } from '@/lib/actions/orders';
import { getInvoiceByOrder } from '@/lib/actions/invoices';
import { notFound } from 'next/navigation';
import AdminOrderDetailClient from './AdminOrderDetailClient';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const order = await getOrderById(params.id);
  
  if (!order) {
    notFound();
  }

  const invoice = await getInvoiceByOrder(params.id);

  return <AdminOrderDetailClient order={order} invoice={invoice} />;
}
