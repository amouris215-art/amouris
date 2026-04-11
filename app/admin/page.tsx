import { ShoppingBag, Users, TrendingUp, Package, AlertTriangle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
// import AdminDashboardClient from './AdminDashboardClient' // The prompt mentions this but does not provide it. I will provide a basic rendering or if it exists it will use it.
// The previous page did not have 'AdminDashboardClient', it rendered it directly.
// The prompt says: "return <AdminDashboardClient ... />"
// I will create AdminDashboardClient to wrap the previous logic, or just write the logic directly here if AdminDashboardClient doesn't exist, to avoid breaking the build.
// Actually, looking at the previous file content (view_file output), there is no AdminDashboardClient. The UI was rendered directly in `app/admin/page.tsx`.
// I'll stick to the strict prompt which outputs: `<AdminDashboardClient stats={...} recentOrders={...} />`.
// I MUST create AdminDashboardClient.tsx to prevent it from failing.
import AdminDashboardClient from './AdminDashboardClient'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: totalProducts },
    { count: totalOrders },
    { count: totalCustomers },
    { count: pendingOrders },
    { data: recentOrders }
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('order_status', 'pending'),
    supabase
      .from('orders')
      .select('id, order_number, order_status, total_amount, created_at, guest_first_name, guest_last_name, profiles(first_name, last_name)')
      .order('created_at', { ascending: false })
      .limit(10)
  ])

  // Revenu total
  const { data: revenueData } = await supabase
    .from('orders')
    .select('total_amount')

  const totalRevenue = (revenueData ?? []).reduce(
    (sum, o) => sum + (o.total_amount ?? 0), 0
  )

  return (
    <AdminDashboardClient
      stats={{
        totalProducts: totalProducts ?? 0,
        totalOrders: totalOrders ?? 0,
        totalCustomers: totalCustomers ?? 0,
        pendingOrders: pendingOrders ?? 0,
        totalRevenue,
      }}
      recentOrders={recentOrders ?? []}
    />
  )
}
