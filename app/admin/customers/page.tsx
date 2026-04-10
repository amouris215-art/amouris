import { fetchAllCustomers } from '@/lib/api/customers';
import AdminCustomersClient from './AdminCustomersClient';

export default async function AdminCustomersPage() {
  const customers = await fetchAllCustomers();

  return <AdminCustomersClient initialCustomers={customers} />;
}
