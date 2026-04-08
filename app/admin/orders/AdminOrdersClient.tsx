'use client'
import { useState } from 'react'
import { Search, Eye, Filter, CheckCircle2, Clock, Truck, XCircle, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { Order, OrderStatus } from '@/lib/types'
import { updateOrderStatus } from '@/lib/actions/orders'

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'En attente', 
  confirmed: 'Confirmé', 
  preparing: 'En préparation',
  shipped: 'Expédié', 
  delivered: 'Livré', 
  cancelled: 'Annulé',
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-amber-100 text-amber-700 ring-amber-500/20',
  confirmed: 'bg-emerald-100 text-emerald-700 ring-emerald-500/20',
  preparing: 'bg-purple-100 text-purple-700 ring-purple-500/20',
  shipped: 'bg-blue-100 text-blue-700 ring-blue-500/20',
  delivered: 'bg-emerald-900 text-white ring-emerald-500/20',
  cancelled: 'bg-rose-100 text-rose-700 ring-rose-500/20',
}

const STATUS_ICONS: Record<OrderStatus, any> = {
  pending: Clock,
  confirmed: CheckCircle2,
  preparing: AlertCircle,
  shipped: Truck,
  delivered: CheckCircle2,
  cancelled: XCircle,
}

interface AdminOrdersClientProps {
  initialOrders: Order[]
}

export default function AdminOrdersClient({ initialOrders }: AdminOrdersClientProps) {
  const [orders, setOrders] = useState(initialOrders)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = orders.filter(o => {
    const name = o.guestInfo ? `${o.guestInfo.firstName} ${o.guestInfo.lastName}` : 'Client Inconnu'
    const matchSearch = o.orderNumber.toLowerCase().includes(search.toLowerCase()) || name.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || o.status === statusFilter
    return matchSearch && matchStatus
  })

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus)
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
      toast.success(`Statut mis à jour : ${STATUS_LABELS[newStatus]}`)
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du statut')
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-serif text-emerald-950">Gestion des Commandes</h1>
        <p className="text-emerald-950/40 text-sm mt-1">Gérez le statut et le suivi des ventes en temps réel</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
          <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-950/20 transition-colors group-focus-within:text-emerald-900" />
          <input
            type="text" 
            placeholder="Rechercher par numéro de commande ou nom client..."
            value={search} 
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white border border-emerald-50 rounded-2xl text-base focus:outline-none focus:ring-4 focus:ring-emerald-900/5 transition-all shadow-sm"
          />
        </div>
        
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-emerald-50 shadow-sm w-full md:w-auto">
            <Filter size={18} className="text-emerald-950/20 ml-2" />
            <select
                value={statusFilter} 
                onChange={e => setStatusFilter(e.target.value)}
                className="bg-transparent text-emerald-950 font-bold text-sm focus:outline-none py-2 px-2 min-w-[150px] appearance-none cursor-pointer"
            >
                <option value="all">Tous les Statuts</option>
                {Object.entries(STATUS_LABELS).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                ))}
            </select>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-emerald-50 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
            <thead>
                <tr className="bg-emerald-50/30">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/40">Commande</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/40">Client</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/40">Total</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/40">Statut actuel</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/40">Paiement</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/40 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50 text-sm">
                <AnimatePresence mode="popLayout">
                {filtered.map(order => {
                const name = order.guestInfo ? `${order.guestInfo.firstName} ${order.guestInfo.lastName}` : 'Client Inconu'
                return (
                    <motion.tr 
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-emerald-50/20 transition-all group"
                        key={order.id}
                    >
                    <td className="px-8 py-6">
                        <div className="font-mono font-black text-emerald-900 text-base">{order.orderNumber}</div>
                        <div className="text-[10px] text-emerald-950/30 font-bold mt-1 uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-8 py-6">
                        <div className="font-bold text-emerald-950">{name}</div>
                        {order.customerId === 'guest' && <div className="text-[10px] text-amber-600 font-black uppercase tracking-tighter">Client invité</div>}
                    </td>
                    <td className="px-8 py-6">
                        <div className="font-sans font-black text-emerald-950 text-lg">{order.total.toLocaleString()} <span className="text-[10px] font-normal">DZD</span></div>
                    </td>
                    <td className="px-8 py-6">
                        <StatusBadge status={order.status} />
                    </td>
                    <td className="px-8 py-6">
                        <span className={`text-[10px] px-3 py-1.5 rounded-full font-black uppercase tracking-widest ${
                            order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 
                            order.paymentStatus === 'partial' ? 'bg-orange-100 text-orange-700' : 
                            'bg-red-50 text-red-700'
                        }`}>
                            {order.paymentStatus === 'paid' ? 'Payé' : order.paymentStatus === 'partial' ? 'Partiel' : 'À régler'}
                        </span>
                    </td>
                    <td className="px-8 py-6">
                        <div className="flex justify-end items-center gap-3">
                            <select 
                                value={order.status}
                                onChange={(e) => handleStatusUpdate(order.id, e.target.value as OrderStatus)}
                                className="bg-emerald-50 text-emerald-950 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-900 border-none appearance-none cursor-pointer"
                            >
                                {Object.entries(STATUS_LABELS).map(([v, l]) => (
                                    <option key={v} value={v}>{l}</option>
                                ))}
                            </select>
                            <button className="w-10 h-10 flex items-center justify-center text-emerald-900/20 hover:text-emerald-900 hover:bg-emerald-50 rounded-xl transition-all">
                                <Eye size={16} />
                            </button>
                        </div>
                    </td>
                    </motion.tr>
                )
                })}
                </AnimatePresence>
            </tbody>
            </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-32 text-center">
              <div className="w-24 h-24 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8">
                <Clock className="w-10 h-10 text-emerald-950/10" />
              </div>
              <p className="text-emerald-950/20 font-serif text-2xl">Aucune commande trouvée</p>
          </div>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const Icon = STATUS_ICONS[status]
  return (
    <span className={`inline-flex items-center gap-2 text-[9px] px-4 py-2 rounded-full font-black uppercase tracking-[0.15em] ring-4 ring-black/[0.02] shadow-sm ${STATUS_COLORS[status]}`}>
      <Icon size={12} strokeWidth={3} />
      {STATUS_LABELS[status]}
    </span>
  )
}
