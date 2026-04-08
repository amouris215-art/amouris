'use client'
import { useState } from 'react'
import { Search, FileText, Download, Filter } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface InvoicesClientProps {
  initialInvoices: any[]
}

export default function InvoicesClient({ initialInvoices }: InvoicesClientProps) {
  const [invoices, setInvoices] = useState(initialInvoices)
  const [search, setSearch] = useState('')

  const filtered = invoices.filter(inv => {
    const order = inv.orders
    const name = order?.profiles 
        ? `${order.profiles.first_name} ${order.profiles.last_name}`
        : `${order?.guest_first_name} ${order?.guest_last_name}`;

    const matchSearch = String(inv.invoice_number).toLowerCase().includes(search.toLowerCase()) || 
                        String(order?.order_number).toLowerCase().includes(search.toLowerCase()) || 
                        name.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-serif text-emerald-950">Factures</h1>
        <p className="text-emerald-950/40 text-sm mt-1">Consultez et gérez toutes les factures générées</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
          <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-950/20 transition-colors group-focus-within:text-emerald-900" />
          <input
            type="text" 
            placeholder="Rechercher par n° de facture, commande ou client..."
            value={search} 
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white border border-emerald-50 rounded-2xl text-base focus:outline-none focus:ring-4 focus:ring-emerald-900/5 transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-emerald-50 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
            <thead>
                <tr className="bg-emerald-50/30">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/40">Facture</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/40">Commande</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/40">Client</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/40">Montant</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/40 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50 text-sm">
                <AnimatePresence mode="popLayout">
                {filtered.map(invoice => {
                const order = invoice.orders;
                const name = order?.profiles 
                    ? `${order.profiles.first_name} ${order.profiles.last_name}`
                    : order?.guest_first_name ? `${order.guest_first_name} ${order.guest_last_name}` : 'Inconnu';
                
                return (
                    <motion.tr 
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-emerald-50/20 transition-all group"
                        key={invoice.id}
                    >
                    <td className="px-8 py-6">
                        <div className="font-mono font-black text-emerald-900 text-base">{invoice.invoice_number}</div>
                        <div className="text-[10px] text-emerald-950/30 font-bold mt-1 uppercase tracking-widest">{new Date(invoice.created_at).toLocaleDateString()}</div>
                    </td>
                    <td className="px-8 py-6">
                        <div className="font-mono text-emerald-950 font-medium">{order?.order_number || 'N/A'}</div>
                    </td>
                    <td className="px-8 py-6">
                        <div className="font-bold text-emerald-950">{name}</div>
                        {order?.profiles?.shop_name && <div className="text-xs text-emerald-900/40">{order.profiles.shop_name}</div>}
                    </td>
                    <td className="px-8 py-6">
                        <div className="font-sans font-black text-emerald-950 text-lg">
                           {order?.total_amount ? Number(order.total_amount).toLocaleString() : '0'} <span className="text-[10px] font-normal">DZD</span>
                        </div>
                    </td>
                    <td className="px-8 py-6">
                        <div className="flex justify-end items-center gap-3">
                            <Link href={invoice.pdf_url} target="_blank">
                              <button className="flex items-center gap-2 bg-emerald-50 text-emerald-950 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-900 transition-all">
                                  <FileText size={14} /> Consulter
                              </button>
                            </Link>
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
                <FileText className="w-10 h-10 text-emerald-950/10" />
              </div>
              <p className="text-emerald-950/20 font-serif text-2xl">Aucune facture trouvée</p>
          </div>
        )}
      </div>
    </div>
  )
}
