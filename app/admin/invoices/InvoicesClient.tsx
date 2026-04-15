'use client'

import { useState, useMemo } from 'react';
import { FileText, Search, Download, Trash2, Loader2, Receipt, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateInvoicePDF } from '@/lib/utils/invoice-generator';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/i18n/i18n-context';

interface InvoicesClientProps {
  initialOrders: any[]
  settings: any
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
}

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
}

export default function InvoicesClient({ initialOrders, settings }: InvoicesClientProps) {
  const { t, dir, language } = useI18n();
  const [search, setSearch] = useState('');
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return initialOrders
      .filter(o => o.invoice_generated) // Only show generated invoices
      .filter(o => {
        const name = o.guest_first_name ? `${o.guest_first_name} ${o.guest_last_name}` : (o.customer?.first_name ? `${o.customer.first_name} ${o.customer.last_name}` : t('admin.invoices.registered_customer'));
        const s = search.toLowerCase();
        return o.order_number.toLowerCase().includes(s) || name.toLowerCase().includes(s);
      });
  }, [initialOrders, search, t]);

  const handleDownload = async (order: any) => {
    const toastId = toast.loading(t('admin.invoices.generating'));
    try {
      const doc = await generateInvoicePDF(order, settings);
      doc.save(`Facture_Amouris_${order.order_number}.pdf`);
      toast.success(t('admin.invoices.success_generation'), { id: toastId });
    } catch (err: any) {
      toast.error(t('admin.invoices.error_generation') + ': ' + err.message, { id: toastId });
    }
  };


  return (
    <div className="space-y-16 pb-32" dir={dir}>
      <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-12">
        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 flex items-center justify-center text-[#C9A84C] shadow-lg">
                 <Receipt size={20} />
              </div>
              <h1 className="font-serif text-5xl text-emerald-950 font-bold italic tracking-tight">{t('admin.invoices.title')}</h1>
           </div>
           <p className={`text-[11px] font-black uppercase tracking-[0.4em] text-[#C9A84C] pl-2 ${dir === 'rtl' ? 'border-r-2 pr-2 border-l-0' : 'border-l-2'}`}>
              {t('admin.invoices.subtitle')}
           </p>
        </div>

        <div className="relative group min-w-[400px]">
           <Search size={20} className={`absolute ${dir === 'rtl' ? 'right-6' : 'left-6'} top-1/2 -translate-y-1/2 text-emerald-950/20 group-focus-within:text-[#C9A84C] transition-colors`} />
           <input 
             type="text"
             placeholder={t('admin.invoices.search_placeholder')}
             value={search}
             onChange={e => setSearch(e.target.value)}
             className={`w-full h-20 ${dir === 'rtl' ? 'pr-16 pl-8' : 'pl-16 pr-8'} bg-white border-2 border-emerald-950/5 rounded-[2rem] outline-none focus:border-[#C9A84C] shadow-xl shadow-emerald-900/5 font-medium text-emerald-950 transition-all font-sans`}
           />
        </div>
      </header>

      <div className="bg-white rounded-[4rem] border border-emerald-950/5 shadow-2xl shadow-emerald-900/5 overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-neutral-50/50">
                <th className={`px-12 py-10 ${dir === 'rtl' ? 'text-right' : 'text-left'} text-[10px] font-black uppercase tracking-[0.4em] text-emerald-950/30`}>{t('admin.invoices.table_invoice')}</th>
                <th className={`px-12 py-10 ${dir === 'rtl' ? 'text-right' : 'text-left'} text-[10px] font-black uppercase tracking-[0.4em] text-emerald-950/30`}>{t('admin.invoices.table_customer')}</th>
                <th className={`px-12 py-10 ${dir === 'rtl' ? 'text-right' : 'text-left'} text-[10px] font-black uppercase tracking-[0.4em] text-emerald-950/30`}>{t('admin.invoices.table_payment')}</th>
                <th className={`px-12 py-10 ${dir === 'rtl' ? 'text-right' : 'text-left'} text-[10px] font-black uppercase tracking-[0.4em] text-emerald-950/30`}>{t('admin.invoices.table_situation')}</th>
                <th className={`px-12 py-10 ${dir === 'rtl' ? 'text-left' : 'text-right'} text-[10px] font-black uppercase tracking-[0.4em] text-emerald-950/30`}>{t('admin.common.actions')}</th>
              </tr>
            </thead>
            <motion.tbody 
              variants={container}
              initial="hidden"
              animate="show"
              className="divide-y divide-emerald-950/[0.03]"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((order) => {
                  const customerName = order.guest_first_name ? `${order.guest_first_name} ${order.guest_last_name}` : (order.customer ? `${order.customer.first_name} ${order.customer.last_name}` : t('admin.invoices.partner_customer'));
                  const invoiceNumber = `FAC-${order.id.slice(0, 6).toUpperCase()}`;
                  const remaining = (order.total_amount || 0) - (order.amount_paid || 0);
                  const isPaid = order.payment_status === 'paid';
                  const isPartial = order.payment_status === 'partial';

                  return (
                    <motion.tr 
                      layout
                      variants={item}
                      key={order.id}
                      className="group hover:bg-neutral-50/50 transition-all duration-500"
                    >
                      <td className="px-12 py-12">
                        <div className="flex items-center gap-6">
                           <div className="w-14 h-14 rounded-2xl bg-white border border-emerald-950/5 flex items-center justify-center text-emerald-950/20 group-hover:text-emerald-950 group-hover:border-[#C9A84C] group-hover:bg-amber-50/30 transition-all duration-500 shadow-sm">
                              <FileText size={20} />
                           </div>
                           <div>
                             <p className="font-mono font-bold text-emerald-950 text-base">{invoiceNumber}</p>
                             <p className="text-[10px] font-black tracking-widest text-emerald-950/30 uppercase mt-1">
                                {t('admin.invoices.ref_label')} {order.order_number}
                             </p>
                           </div>
                        </div>
                      </td>
                      <td className="px-12 py-12">
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-emerald-950">{customerName}</p>
                          <p className="text-[10px] text-emerald-950/40 font-black uppercase tracking-widest">
                            {new Date(order.created_at).toLocaleDateString(language === 'ar' ? 'ar-DZ' : 'fr-FR', { day: '2-digit', month: 'short' })} • {order.guest_wilaya || t('admin.invoices.algeria')}
                          </p>
                        </div>
                      </td>
                      <td className="px-12 py-12">
                        <div className="flex flex-col gap-1">
                           <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-emerald-950">{(order.total_amount || 0).toLocaleString()}</span>
                              <span className="text-[9px] font-black text-emerald-950/30">DZD</span>
                           </div>
                           <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border w-fit ${
                             isPaid ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                             isPartial ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                             'bg-rose-50 text-rose-600 border-rose-100'
                           }`}>
                             {isPaid ? t('admin.invoices.status_paid') : isPartial ? t('admin.invoices.status_partial') : t('admin.invoices.status_unpaid')}
                           </div>
                        </div>
                      </td>
                      <td className="px-12 py-12">
                        <div className="space-y-2">
                           <div className="flex justify-between items-center w-full max-w-[150px]">
                              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-950/30">{t('admin.invoices.paid_label')}</span>
                              <span className="text-xs font-bold text-emerald-600">{(order.amount_paid || 0).toLocaleString()}</span>
                           </div>
                           <div className="flex justify-between items-center w-full max-w-[150px]">
                              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-950/30">{t('admin.invoices.remaining_label')}</span>
                              <span className={`text-xs font-bold ${remaining > 0 ? 'text-amber-600' : 'text-emerald-950/20'}`}>{remaining.toLocaleString()}</span>
                           </div>
                        </div>
                      </td>
                       <td className={`px-12 py-12 ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>
                          <div className={`flex ${dir === 'rtl' ? 'justify-start' : 'justify-end'} gap-4`}>
                             <button 
                                onClick={() => handleDownload(order)}
                                className="w-14 h-14 rounded-2xl bg-white border border-emerald-950/5 flex items-center justify-center text-emerald-950/30 hover:text-emerald-950 hover:border-emerald-950/20 transition-all shadow-sm hover:shadow-xl group/btn"
                                title={t('admin.invoices.download_tooltip')}
                             >
                                <Download size={20} className="group-hover/btn:scale-110 transition-transform" />
                             </button>
                          </div>
                       </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </motion.tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-48 text-center bg-neutral-50/20">
             <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center mx-auto mb-10 text-emerald-100 border-4 border-emerald-950/[0.02] shadow-2xl relative">
                <Receipt size={64} className="opacity-10" />
                <div className="absolute inset-0 bg-emerald-500/5 blur-3xl rounded-full" />
             </div>
             <p className="font-serif text-5xl text-emerald-950 font-bold italic tracking-tighter mb-4 opacity-20">{t('admin.invoices.no_invoices')}</p>
             <p className="text-[12px] font-black uppercase tracking-[0.5em] text-emerald-950/10">
               {t('admin.invoices.empty_search')}
             </p>
          </div>
        )}
      </div>
    </div>
  );
}
