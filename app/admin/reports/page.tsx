import { fetchAllOrders } from '@/lib/api/orders';
import { fetchAllCustomers } from '@/lib/api/customers';
import { fetchAllProducts } from '@/lib/api/products';
import ReportsClient from './ReportsClient';

export default async function AdminReportsPage() {
  const [orders, customers, products] = await Promise.all([
    fetchAllOrders({ status: 'admin' }),
    fetchAllCustomers(),
    fetchAllProducts({ status: 'admin' })
  ]);

  return (
    <ReportsClient 
      orders={orders} 
      customers={customers} 
      products={products} 
    />
  );
}
