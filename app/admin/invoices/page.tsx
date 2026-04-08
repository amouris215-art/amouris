'use client'

import { useState, useEffect } from 'react'
import { getAllInvoices } from '@/lib/actions/invoices'
import { FileText, Search, Download, ExternalLink } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const inv = await getAllInvoices()
        setInvoices(inv)
      } catch (error) {
        console.error('Failed to load admin invoices:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const filtered = invoices.filter(i => {
    const orderNum = i.orders?.order_number?.toLowerCase() || ''
    const invNum = i.invoice_number?.toLowerCase() || ''
    const s = search.toLowerCase()
    return orderNum.includes(s) || invNum.includes(s)
  })

  return (
    <div className="space-y-8 p-4 md:p-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
            <h1 className="text-3xl font-bold font-serif text-emerald-950 flex items-center gap-3">
              <FileText size={32} />
              Factures
            </h1>
            <p className="text-emerald-950/40 text-sm mt-1">Historique des factures générées pour vos commandes</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-900/20" />
          <input
            type="text"
            placeholder="Rechercher par Numéro de Facture ou Commande..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white border border-emerald-50 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-emerald-900/5 transition-all shadow-sm"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-900 mx-auto"></div>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-emerald-50 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
              <table className="w-full text-left">
              <thead>
                  <tr className="bg-emerald-50/30">
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/40">Facture</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/40">Commande liée</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/40">Client</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/40">Montant</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/40 text-right">Actions</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50">
                  <AnimatePresence mode="popLayout">
                  {filtered.map(invoice => {
                    const order = invoice.orders
                    const clientName = order?.profiles 
                        ? `${order.profiles.first_name} ${order.profiles.last_name}` 
                        : (order?.guest_first_name ? `${order.guest_first_name} ${order.guest_last_name}` : 'Inconnu')
                    
                    return (
                      <motion.tr 
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          key={invoice.id} 
                          className="hover:bg-emerald-50/20 transition-all group"
                      >
                      <td className="px-8 py-6 font-bold text-emerald-950 font-mono tracking-tight">
                         {invoice.invoice_number}
                         <div className="text-[10px] text-emerald-900/40 font-sans mt-0.5">{new Date(invoice.created_at).toLocaleDateString('fr-FR')}</div>
                      </td>
                      <td className="px-8 py-6">
                        <Link href={`/admin/orders/${invoice.order_id}`} className="inline-flex items-center gap-1 font-black text-amber-600 hover:text-amber-700 hover:underline text-sm uppercase tracking-widest transition-all">
                            {order?.order_number || 'AM-XXXXX'} <ExternalLink size={14} />
                        </Link>
                      </td>
                      <td className="px-8 py-6 font-medium text-emerald-900/80">
                         {clientName}
                      </td>
                      <td className="px-8 py-6 font-black text-emerald-950">
                         {order?.total_amount ? order.total_amount.toLocaleString() : '0'} <span className="text-[10px] text-emerald-900/40">DZD</span>
                      </td>
                      <td className="px-8 py-6">
                          <div className="flex justify-end gap-3">
                          <a href={invoice.pdf_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center text-emerald-900/40 hover:text-white hover:bg-emerald-900 rounded-xl transition-all shadow-sm">
                              <Download size={16} />
                          </a>
                          </div>
                      </td>
                      </motion.tr>
                  )})}
                  </AnimatePresence>
              </tbody>
              </table>
          </div>
          {filtered.length === 0 && (
            <div className="p-24 text-center">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText size={32} className="text-emerald-950/10" />
                </div>
                <p className="text-emerald-950/20 font-serif text-xl">Aucune facture trouvée</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
