import { getAllOrders } from '@/lib/actions/orders'
import AdminOrdersClient from './AdminOrdersClient'

export const dynamic = 'force-dynamic'

export default async function AdminOrdersPage() {
  const orders = await getAllOrders()
  return <AdminOrdersClient initialOrders={orders} />
}
