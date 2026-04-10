"use client";

import Link from 'next/link';
import { useI18n } from '@/i18n/i18n-context';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';
import { getOrderStatusLabel } from '@/lib/status-helpers';

interface AccountOrdersListClientProps {
  initialOrders: any[];
}

export default function AccountOrdersListClient({ initialOrders }: AccountOrdersListClientProps) {
  const { t, language } = useI18n();
  const orders = initialOrders;

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center gap-4 mb-8">
        <Package className="h-8 w-8 text-emerald-900" />
        <h1 className="text-3xl font-serif font-bold text-emerald-950 italic">
          {t('account.my_orders')}
        </h1>
      </div>

      <div className="bg-white border border-emerald-950/5 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right font-sans">
            <thead className="text-[10px] font-black tracking-widest text-emerald-950/40 bg-neutral-50/50 uppercase border-b border-emerald-950/5">
              <tr>
                <th className="px-6 py-5">{t('account.order_id')}</th>
                <th className="px-6 py-5">{t('account.order_date')}</th>
                <th className="px-6 py-5">{t('account.order_status')}</th>
                <th className="px-6 py-5">{t('account.amount_paid')}</th>
                <th className="px-6 py-5">{t('account.order_total')}</th>
                <th className="px-6 py-5 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-950/5 text-emerald-950 font-sans">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-neutral-50/50 transition-colors">
                   <td className="px-6 py-5 font-bold font-mono">{order.order_number}</td>
                   <td className="px-6 py-5 text-emerald-950/50 font-medium">
                     {new Date(order.created_at).toLocaleDateString(language === 'ar' ? 'ar-DZ' : 'fr-FR', {
                       year: 'numeric',
                       month: 'long',
                       day: 'numeric'
                     })}
                   </td>
                   <td className="px-6 py-5">
                     <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] ${getStatusStyles(order.order_status)}`}>
                       {getOrderStatusLabel(order.order_status, language)}
                     </span>
                   </td>
                   <td className="px-6 py-5">
                     <span className={(Number(order.amount_paid) || 0) >= (Number(order.total_amount) || 0) ? "text-emerald-600 font-bold" : "text-amber-600 font-bold"}>
                        {(Number(order.amount_paid) || 0).toLocaleString()} {t('common.dzd')}
                     </span>
                   </td>
                   <td className="px-6 py-5 font-bold text-lg">{(Number(order.total_amount) || 0).toLocaleString()} <span className="text-[10px] font-normal uppercase tracking-widest text-emerald-950/40">{t('common.dzd')}</span></td>
                   <td className="px-6 py-5 text-right">
                     <Link href={`/account/orders/${order.id}`}>
                       <Button variant="outline" size="sm" className="rounded-xl border-emerald-950/10 text-emerald-900 hover:bg-emerald-900 hover:text-white uppercase tracking-widest text-[10px] font-black h-8">
                         {t('account.view_details')}
                       </Button>
                     </Link>
                   </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                   <td colSpan={6} className="px-6 py-20 text-center">
                     <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                       <Package className="text-emerald-900/20" size={24} />
                     </div>
                     <p className="font-serif italic text-emerald-950/40 text-lg">
                        {t('account.no_orders')}
                     </p>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function getStatusStyles(status: string) {
  switch (status) {
    case 'delivered': return 'bg-emerald-100/50 text-emerald-800 border border-emerald-200';
    case 'pending': return 'bg-amber-100/50 text-amber-800 border border-amber-200';
    case 'confirmed': return 'bg-blue-100/50 text-blue-800 border border-blue-200';
    case 'preparing': return 'bg-indigo-100/50 text-indigo-700 border border-indigo-200';
    case 'shipped': return 'bg-cyan-100/50 text-cyan-800 border border-cyan-200';
    case 'cancelled': return 'bg-rose-100/50 text-rose-800 border border-rose-200';
    default: return 'bg-slate-100/50 text-slate-800 border border-slate-200';
  }
}
