'use client'
import { useState } from 'react'
import { useCustomersStore } from '@/store/customers.store'
import { useOrdersStore } from '@/store/orders.store'
import { Search, User, Phone, MapPin, ShoppingBag, Eye, ShieldAlert, ShieldCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

export default function AdminCustomersPage() {
  const { customers, freeze, unfreeze, remove } = useCustomersStore()
  const orders = useOrdersStore(s => s.orders)
  
  const [search, setSearch] = useState('')

  const filtered = customers.filter(c => 
    c.first_name.toLowerCase().includes(search.toLowerCase()) ||
    c.last_name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  )

  const handleToggleFreeze = (id: string, isFrozen: boolean) => {
    if (isFrozen) unfreeze(id)
    else freeze(id)
    toast.success(isFrozen ? 'Compte réactivé' : 'Compte suspendu')
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-serif text-emerald-950">Portefeuille Clients</h1>
        <p className="text-emerald-950/40 text-sm mt-1">Gérez vos clients professionnels et leur accès à la plateforme</p>
      </div>

      <div className="relative group max-w-2xl">
        <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-950/20 group-focus-within:text-emerald-900 transition-colors" />
        <input
          type="text" 
          placeholder="Rechercher par nom, prénom ou téléphone..."
          value={search} 
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-14 pr-6 py-4 bg-white border border-emerald-50 rounded-2xl text-base focus:outline-none focus:ring-4 focus:ring-emerald-900/5 transition-all shadow-sm"
        />
      </div>

      <div className="bg-white rounded-[2.5rem] border border-emerald-50 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
            <thead>
                <tr className="bg-emerald-50/30">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/40">Client</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/40">Contact / Magasin</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/40">Localisation</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/40 text-center">Activité</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/40">Statut</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/40 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50">
                <AnimatePresence mode="popLayout">
                {filtered.map(customer => {
                const customerOrders = orders.filter(o => o.customer_id === customer.id)
                const totalSpent = customerOrders.reduce((s, o) => s + o.total_amount, 0)
                
                return (
                    <motion.tr 
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-emerald-50/20 transition-all group"
                        key={customer.id}
                    >
                    <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-serif shadow-sm ${customer.is_frozen ? 'bg-rose-50 text-rose-300' : 'bg-amber-100 text-amber-700'}`}>
                            {customer.first_name.charAt(0)}
                        </div>
                        <div>
                            <div className="font-bold text-emerald-950 text-base">{customer.first_name} {customer.last_name}</div>
                            <div className="text-[10px] text-emerald-950/20 font-black uppercase tracking-widest mt-0.5">ID: {customer.id.split('_')[1]}</div>
                        </div>
                        </div>
                    </td>
                    <td className="px-8 py-6">
                        <div className="flex items-center gap-2 font-mono text-emerald-900 font-bold mb-1">
                            <Phone size={14} className="text-emerald-900/30" />
                            {customer.phone}
                        </div>
                        <div className="text-xs text-emerald-900/40 flex items-center gap-2">
                             <span className="w-1.5 h-1.5 rounded-full bg-emerald-200" />
                             {customer.shop_name || 'Sans magasin'}
                        </div>
                    </td>
                    <td className="px-8 py-6">
                        <div className="text-sm font-bold text-emerald-950">{customer.wilaya}</div>
                        <div className="text-xs text-emerald-900/40">{customer.commune || '—'}</div>
                    </td>
                    <td className="px-8 py-6">
                        <div className="text-center">
                            <div className="font-black text-emerald-950 text-base">{customerOrders.length} <span className="text-[10px] font-normal opacity-30">Cmd</span></div>
                            <div className="text-[10px] text-emerald-700 font-bold uppercase tracking-tighter">{totalSpent.toLocaleString()} DZD</div>
                        </div>
                    </td>
                    <td className="px-8 py-6">
                        <span className={`text-[9px] px-3 py-1.5 rounded-full font-black uppercase tracking-widest ${customer.is_frozen ? 'bg-rose-50 text-rose-600 ring-rose-500/10' : 'bg-emerald-50 text-emerald-700 ring-emerald-500/10'} ring-4`}>
                            {customer.is_frozen ? 'Suspendu' : 'Actif'}
                        </span>
                    </td>
                    <td className="px-8 py-6">
                        <div className="flex justify-end gap-3">
                        <button className="w-10 h-10 flex items-center justify-center text-emerald-900/20 hover:text-emerald-900 hover:bg-emerald-50 rounded-xl transition-all">
                            <Eye size={16} />
                        </button>
                        <button 
                            onClick={() => handleToggleFreeze(customer.id, customer.is_frozen)}
                            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${customer.is_frozen ? 'text-emerald-600 hover:bg-emerald-50' : 'text-rose-300 hover:text-rose-600 hover:bg-rose-50'}`}
                        >
                            {customer.is_frozen ? <ShieldCheck size={16} /> : <ShieldAlert size={16} />}
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
                <User className="w-10 h-10 text-emerald-950/10" />
            </div>
            <p className="text-emerald-950/20 font-serif text-2xl">Aucun client trouvé</p>
          </div>
        )}
      </div>
    </div>
  )
}
