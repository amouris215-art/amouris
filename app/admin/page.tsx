'use client'
import { useAdminAuth } from '@/store/admin-auth.store'
import { mockProducts, mockOrders, mockCustomers } from '@/lib/mock-data'
import { ShoppingBag, Users, TrendingUp, Package, Clock, CheckCircle } from 'lucide-react'

export default function AdminDashboard() {
  const { adminEmail } = useAdminAuth()

  const totalRevenue = mockOrders.reduce((s, o) => s + o.total_amount, 0)
  const pendingOrders = mockOrders.filter(o => o.order_status === 'pending').length
  const totalProducts = mockProducts.length

  const stats = [
    { label: 'Produits actifs', value: totalProducts, icon: Package, color: 'bg-emerald-50 text-emerald-700' },
    { label: 'Commandes totales', value: mockOrders.length, icon: ShoppingBag, color: 'bg-blue-50 text-blue-700' },
    { label: 'Clients inscrits', value: mockCustomers.length, icon: Users, color: 'bg-purple-50 text-purple-700' },
    { label: 'Revenu total (DZD)', value: totalRevenue.toLocaleString(), icon: TrendingUp, color: 'bg-amber-50 text-amber-700' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Vue d'ensemble</h1>
        <p className="text-gray-500 text-sm mt-1">Connecté : {adminEmail}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 p-5">
            <div className={`inline-flex p-2 rounded-lg ${color} mb-3`}>
              <Icon size={20} />
            </div>
            <div className="text-2xl font-semibold text-gray-900">{value}</div>
            <div className="text-sm text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Commandes récentes */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Commandes récentes</h2>
        <div className="space-y-3">
          {mockOrders.slice(0, 5).map(order => (
            <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div>
                <span className="font-mono text-sm font-medium text-gray-900">{order.order_number}</span>
                <span className="text-gray-400 text-sm ml-3">
                  {order.customer_id
                    ? mockCustomers.find(c => c.id === order.customer_id)?.first_name + ' ' + mockCustomers.find(c => c.id === order.customer_id)?.last_name
                    : order.guest_first_name + ' ' + order.guest_last_name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">{order.total_amount.toLocaleString()} DZD</span>
                <StatusBadge status={order.order_status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    preparing: 'bg-purple-100 text-purple-700',
    shipped: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  }
  const labels: Record<string, string> = {
    pending: 'En attente', confirmed: 'Confirmé', preparing: 'En préparation',
    shipped: 'Expédié', delivered: 'Livré', cancelled: 'Annulé',
  }
  return (
    <span className={`text-xs px-2 py-1 rounded-full font-medium ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {labels[status] || status}
    </span>
  )
}
