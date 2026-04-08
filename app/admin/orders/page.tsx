'use client'
import { useState } from 'react'
import { mockOrders, mockCustomers } from '@/lib/mock-data'
import { Search, Eye, ChevronDown } from 'lucide-react'

const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente', confirmed: 'Confirmé', preparing: 'En préparation',
  shipped: 'Expédié', delivered: 'Livré', cancelled: 'Annulé',
}
const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  preparing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}
const PAYMENT_LABELS: Record<string, string> = {
  unpaid: 'Non payé', partial: 'Partiel', paid: 'Payé',
}
const PAYMENT_COLORS: Record<string, string> = {
  unpaid: 'bg-red-100 text-red-700',
  partial: 'bg-orange-100 text-orange-700',
  paid: 'bg-green-100 text-green-700',
}

export default function AdminOrdersPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = mockOrders.filter(o => {
    const customer = o.customer_id
      ? mockCustomers.find(c => c.id === o.customer_id)
      : null
    const name = customer
      ? `${customer.first_name} ${customer.last_name}`
      : `${o.guest_first_name} ${o.guest_last_name}`
    const matchSearch = o.order_number.includes(search) ||
      name.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || o.order_status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold text-gray-900">Commandes</h1>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text" placeholder="Rechercher commande ou client..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-400"
          />
        </div>
        <select
          value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-400"
        >
          <option value="all">Tous les statuts</option>
          {Object.entries(STATUS_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">N° Commande</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Client</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Total</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Statut</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Paiement</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(order => {
              const customer = order.customer_id
                ? mockCustomers.find(c => c.id === order.customer_id)
                : null
              const name = customer
                ? `${customer.first_name} ${customer.last_name}`
                : `${order.guest_first_name} ${order.guest_last_name}`
              return (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono font-medium text-emerald-700">{order.order_number}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{name}</div>
                    {!customer && <div className="text-xs text-gray-400">Client invité</div>}
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{order.total_amount.toLocaleString()} DZD</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[order.order_status]}`}>
                      {STATUS_LABELS[order.order_status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${PAYMENT_COLORS[order.payment_status]}`}>
                      {PAYMENT_LABELS[order.payment_status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('fr-DZ')}
                  </td>
                  <td className="px-4 py-3">
                    <button className="flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-900 font-medium">
                      <Eye size={14} /> Détails
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
