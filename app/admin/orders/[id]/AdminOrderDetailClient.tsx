'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, FileText, ArrowLeft, Loader2, Save } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { updateOrderStatus, updatePayment } from '@/lib/actions/orders'
import { generateInvoice } from '@/lib/actions/invoices'
import { Order, OrderStatus, PaymentStatus } from '@/lib/types'

const STATUSES: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'shipped', 'delivered']
const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  confirmed: 'Confirmé',
  preparing: 'En préparation',
  shipped: 'Expédié',
  delivered: 'Livré',
  cancelled: 'Annulé',
}

interface AdminOrderDetailClientProps {
  order: Order
  invoice: any
}

export default function AdminOrderDetailClient({ order: initialOrder, invoice: initialInvoice }: AdminOrderDetailClientProps) {
  const [order, setOrder] = useState(initialOrder)
  const [invoice, setInvoice] = useState(initialInvoice)
  const [isGenerating, setIsGenerating] = useState(false)

  const currentStatusIndex = STATUSES.indexOf(order.status)

  const handleStatusChange = async (newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(order.id, newStatus)
      setOrder({ ...order, status: newStatus })
      toast.success(`Statut mis à jour : ${STATUS_LABELS[newStatus]}`)
    } catch (e) {
      toast.error('Erreur lors de la mise à jour du statut')
    }
  }

  const handlePaymentStatusChange = async (targetStatus: PaymentStatus) => {
    try {
      const amountPaid = targetStatus === 'paid' ? order.total : targetStatus === 'partial' ? (order.total / 2) : 0;
      await updatePayment(order.id, amountPaid)
      setOrder({ ...order, paymentStatus: targetStatus, amountPaid })
      toast.success('Paiement mis à jour')
    } catch (e) {
      toast.error('Erreur lors de la mise à jour du paiement')
    }
  }

  const handleGenerateInvoice = async () => {
    try {
      setIsGenerating(true)
      const newInvoice = await generateInvoice(order.id)
      setInvoice(newInvoice)
      toast.success('Facture générée avec succès')
    } catch (error: any) {
      toast.error('Erreur: ' + error.message)
    } finally {
      setIsGenerating(false)
    }
  }

  const name = order.guestInfo?.firstName 
    ? `${order.guestInfo.firstName} ${order.guestInfo.lastName}`
    : (order as any).profiles ? `${(order as any).profiles.first_name} ${(order as any).profiles.last_name}` : 'Inconnu';

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders">
          <button className="p-2 hover:bg-emerald-50 rounded-xl transition-colors text-emerald-900/40 hover:text-emerald-900">
            <ArrowLeft size={24} />
          </button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-serif text-emerald-950">Commande {order.orderNumber}</h1>
          <p className="text-emerald-950/40 text-sm mt-1">Passée le {new Date(order.createdAt).toLocaleString('fr-FR')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Tracking & Products */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Tracking Timeline */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-emerald-50 shadow-sm">
            <h2 className="text-xl font-bold font-serif text-emerald-950 mb-8">Suivi de la Commande</h2>
            
            {order.status === 'cancelled' ? (
              <div className="p-6 bg-rose-50 text-rose-700 rounded-2xl font-bold text-center">
                Cette commande a été annulée.
              </div>
            ) : (
              <div className="relative">
                {/* Background Line */}
                <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-emerald-50 rounded-full" />
                
                {/* Progress Line */}
                <div 
                  className="absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-emerald-600 transition-all duration-500 rounded-full z-0"
                  style={{ width: `${Math.max(0, currentStatusIndex) / (STATUSES.length - 1) * 100}%` }}
                />

                <div className="relative z-10 flex justify-between items-center">
                  {STATUSES.map((status, idx) => {
                    const isCompleted = idx <= currentStatusIndex
                    const isCurrent = idx === currentStatusIndex

                    return (
                      <div 
                        key={status} 
                        className="flex flex-col items-center gap-3 cursor-pointer group"
                        onClick={() => handleStatusChange(status)}
                      >
                        <motion.div 
                          className={`w-10 h-10 rounded-full flex items-center justify-center border-[3px] transition-colors relative bg-white
                            ${isCompleted ? 'border-emerald-600 text-emerald-600' : 'border-emerald-100 text-emerald-200'}
                          `}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {isCompleted ? <CheckCircle2 size={20} className="fill-emerald-100" /> : <span className="text-xs font-black">{idx + 1}</span>}
                          
                          {/* Pulsing ring for current status */}
                          {isCurrent && (
                            <span className="absolute -inset-2 border-2 border-emerald-600/30 rounded-full animate-ping" />
                          )}
                        </motion.div>
                        <span className={`text-[10px] font-black uppercase tracking-widest text-center transition-colors
                          ${isCurrent ? 'text-emerald-950' : isCompleted ? 'text-emerald-950/60' : 'text-emerald-950/20'}
                        `}>
                          {STATUS_LABELS[status]}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
            
            {order.status !== 'cancelled' && (
              <div className="mt-8 flex justify-end">
                 <button 
                   onClick={() => handleStatusChange('cancelled')}
                   className="text-xs text-rose-500 hover:text-rose-700 font-bold underline"
                 >
                   Annuler la commande
                 </button>
              </div>
            )}
          </div>

          {/* Ordered Items */}
          <div className="bg-white rounded-[2.5rem] overflow-hidden border border-emerald-50 shadow-sm">
            <div className="p-8 border-b border-emerald-50 bg-emerald-50/20">
              <h2 className="text-xl font-bold font-serif text-emerald-950">Produits Commandés</h2>
            </div>
            <div className="divide-y divide-emerald-50">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-6 flex items-center justify-between hover:bg-emerald-50/10 transition-colors">
                  <div>
                    <div className="font-bold text-emerald-950">{item.productNameFR}</div>
                    <div className="text-xs text-emerald-900/40 mt-1">
                      {item.quantity} × {item.unitPrice.toLocaleString()} DZD
                    </div>
                  </div>
                  <div className="font-black text-emerald-900 text-lg">
                    {(item.quantity * item.unitPrice).toLocaleString()} <span className="text-[10px] font-normal text-emerald-900/40">DZD</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 bg-emerald-50/10 flex justify-between items-center border-t border-emerald-50">
              <span className="font-bold text-emerald-950 uppercase text-xs tracking-widest">Sous-total</span>
              <span className="font-black text-emerald-950 text-xl">{order.total.toLocaleString()} <span className="text-[10px] font-normal">DZD</span></span>
            </div>
          </div>
        </div>

        {/* Right Column: Customer & Invoice & Payment */}
        <div className="space-y-8">
          
          {/* Customer Info */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-emerald-50 shadow-sm">
            <h2 className="text-lg font-bold font-serif text-emerald-950 mb-6">Client</h2>
            <div className="space-y-4">
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40 mb-1">Nom Complet</div>
                <div className="font-bold text-emerald-950">{name}</div>
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40 mb-1">Téléphone</div>
                <div className="font-bold text-emerald-950">
                  {order.guestInfo?.phoneNumber || (order as any).profiles?.phone || 'Non renseigné'}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40 mb-1">Wilaya</div>
                <div className="font-bold text-emerald-950">
                  {order.guestInfo?.wilaya || (order as any).profiles?.wilaya || 'Non renseignée'}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-emerald-50 shadow-sm">
            <h2 className="text-lg font-bold font-serif text-emerald-950 mb-6">Paiement</h2>
            
            <div className="mb-6">
              <div className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40 mb-1">Statut Actuel</div>
              <select 
                value={order.paymentStatus}
                onChange={(e) => handlePaymentStatusChange(e.target.value as PaymentStatus)}
                className={`w-full p-4 rounded-xl font-bold appearance-none cursor-pointer border-none focus:ring-2 focus:ring-emerald-900 outline-none
                  ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : order.paymentStatus === 'partial' ? 'bg-orange-100 text-orange-800' : 'bg-red-50 text-red-800'}`}
              >
                <option value="unpaid">Non Payé (À régler)</option>
                <option value="partial">Partiel</option>
                <option value="paid">Payé en totalité</option>
              </select>
            </div>

            <div>
               <div className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40 mb-1">Montant Réglé</div>
               <div className="font-black text-emerald-950 text-2xl">
                 {order.amountPaid.toLocaleString()} <span className="text-sm font-normal">/ {order.total.toLocaleString()} DZD</span>
               </div>
            </div>
          </div>

          {/* Invoice Generation */}
          <div className="bg-emerald-950 text-white rounded-[2.5rem] p-8 shadow-sm">
            <h2 className="text-lg font-bold font-serif mb-2">Facturation</h2>
            <p className="text-emerald-50/60 text-xs mb-8">
              Générez une facture PDF professionnelle pour cette commande.
            </p>

            {invoice?.pdf_url ? (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-900/50 rounded-2xl flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-800 rounded-xl flex items-center justify-center">
                    <CheckCircle2 size={20} className="text-emerald-400" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">Facture Générée</div>
                    <div className="text-xs text-emerald-400 font-mono">{invoice.invoice_number}</div>
                  </div>
                </div>
                <Link href={invoice.pdf_url} target="_blank" className="block w-full">
                  <button className="w-full py-4 bg-white text-emerald-950 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-50 transition-colors">
                    <FileText size={18} />
                    Ouvrir le PDF
                  </button>
                </Link>
                {/* Re-Generate Option */}
                <button 
                  onClick={handleGenerateInvoice}
                  disabled={isGenerating}
                  className="w-full py-3 text-xs text-emerald-50/60 hover:text-white font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  Régénérer la facture
                </button>
              </div>
            ) : (
              <button 
                onClick={handleGenerateInvoice}
                disabled={isGenerating}
                className="w-full py-4 bg-emerald-500 text-white hover:bg-emerald-400 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {isGenerating ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <FileText size={18} />
                )}
                Générer la Facture
              </button>
            )}
          </div>
          
        </div>
      </div>
    </div>
  )
}
