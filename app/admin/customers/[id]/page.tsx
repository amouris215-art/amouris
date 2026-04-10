import { fetchCustomerById } from '@/lib/api/customers';
import AdminCustomerDetailClient from './AdminCustomerDetailClient';
import { notFound } from 'next/navigation';

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const customer = await fetchCustomerById(id);

    if (!customer) {
      notFound();
    }

    return <AdminCustomerDetailClient initialCustomer={customer} />;
  } catch (error) {
    console.error('Error fetching customer:', error);
    notFound();
  }
}
