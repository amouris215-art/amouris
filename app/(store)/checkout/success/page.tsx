"use client";

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useI18n } from '@/i18n/i18n-context';
import { useOrdersStore, Order } from '@/store/orders.store';
import { motion } from 'framer-motion';
import { CheckCircle2, Package, Truck, ArrowRight, UserPlus, Home } from 'lucide-react';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t, language, dir } = useI18n();
  const { orders } = useOrdersStore();
  const [order, setOrder] = useState<Order | null>(null);

  const orderNumber = searchParams.get('order');
  const isAr = language === 'ar';
  const isRtl = dir === 'rtl';

  useEffect(() => {
    if (orderNumber) {
      const found = orders.find(o => o.order_number === orderNumber);
      if (found) {
        setOrder(found);
      }
    } else {
      router.push('/shop');
    }
  }, [orderNumber, orders, router]);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50/50 py-12 md:py-24" dir={dir}>
      <div className="container mx-auto px-6 max-w-3xl">
        
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-emerald-950/5 border border-emerald-950/5 overflow-hidden">
          
          {/* Header */}
          <div className="bg-emerald-900 p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12 }}
              className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-8 relative z-10"
            >
              <CheckCircle2 size={48} />
            </motion.div>
            <h1 className="font-serif text-3xl md:text-4xl text-white mb-4 relative z-10 uppercase">
              {t('checkout.success_title')}
            </h1>
            <p className="text-emerald-100/60 font-black uppercase tracking-[0.3em] text-[10px] relative z-10">
              {t('checkout.success_desc_short')}
            </p>
          </div>

          <div className="p-8 md:p-12 space-y-10">
            
            {/* Order Number */}
            <div className="text-center bg-neutral-50 p-8 rounded-[2.5rem] border border-emerald-950/5 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent opacity-50" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-900/40 mb-4">
                {t('checkout.order_id')}
              </p>
              <div className="relative">
                <h2 className="font-serif text-6xl md:text-8xl text-emerald-950 tracking-tighter mb-2 group-hover:scale-105 transition-transform duration-500">
                  {order.order_number}
                </h2>
                <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#C9A84C]">
                  <span className="w-8 h-px bg-[#C9A84C]/20" />
                  {t('checkout.save_number_notice')}
                  <span className="w-8 h-px bg-[#C9A84C]/20" />
                </div>
              </div>
            </div>

            <div className="h-px bg-emerald-950/5" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Summary */}
               <div className="space-y-6 text-start">
                 <h3 className="font-bold text-emerald-950 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                   <Package size={16} className="text-[#C9A84C]" />
                   {t('checkout.order_details')}
                 </h3>
                 <div className="space-y-4 max-h-48 overflow-y-auto pr-2 no-scrollbar">
                   {order.items.map((item, idx) => (
                     <div key={idx} className="flex justify-between items-start text-xs border-b border-emerald-950/5 pb-3">
                       <span className="text-emerald-950 font-medium text-start">
                         {isAr ? item.product_name_ar : item.product_name_fr}
                         <span className="block text-[9px] text-emerald-900/40 uppercase tracking-widest mt-0.5">
                           {item.product_type === 'perfume' ? `${item.quantity_grams}g` : `${item.quantity_units}x ${item.variant_label}`}
                         </span>
                       </span>
                       <span className="font-bold text-emerald-950 whitespace-nowrap">{item.total_price.toLocaleString()} {t('common.dzd')}</span>
                     </div>
                   ))}
                 </div>
                 <div className="pt-4 flex justify-between items-end">
                    <span className="font-serif text-lg text-emerald-950">{t('checkout.total')}</span>
                    <div className="text-right rtl:text-left">
                       <span className="block text-[9px] font-black uppercase tracking-widest text-emerald-950/40 mb-1">{t('checkout.cod')}</span>
                       <span className="font-serif text-3xl text-[#0a3d2e] font-bold">{order.total_amount.toLocaleString()} {t('common.dzd')}</span>
                    </div>
                 </div>
               </div>

               {/* Delivery Info */}
               <div className="space-y-6 text-start">
                  <h3 className="font-bold text-emerald-950 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                     <Truck size={16} className="text-[#C9A84C]" />
                     {t('checkout.delivery_info')}
                  </h3>
                  <div className="bg-neutral-50 p-6 rounded-3xl border border-emerald-950/5 space-y-4">
                     <div>
                       <p className="text-emerald-900/40 uppercase tracking-widest font-black text-[8px] mb-1">{t('checkout.recipient')}</p>
                       <p className="font-bold text-emerald-950 text-sm">
                         {order.is_registered_customer ? t('admin.orders.customer_registered') : `${order.guest_first_name} ${order.guest_last_name}`}
                       </p>
                     </div>
                     <div>
                       <p className="text-emerald-900/40 uppercase tracking-widest font-black text-[8px] mb-1">{t('common.contact')}</p>
                       <p className="font-bold text-emerald-950 text-sm">{order.guest_phone || t('admin.customers.view_profile')}</p>
                     </div>
                     <div>
                       <p className="text-emerald-900/40 uppercase tracking-widest font-black text-[8px] mb-1">{t('checkout.wilaya')}</p>
                       <p className="font-bold text-emerald-950 text-sm">
                         {order.guest_wilaya || t('admin.customers.view_profile_short')} {order.guest_commune ? `(${order.guest_commune})` : ''}
                       </p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-8 bg-amber-50 rounded-[2rem] border border-amber-200/50 flex items-start gap-4 text-start">
               <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-amber-600 shrink-0">
                  <Truck size={20} />
               </div>
               <div>
                  <p className="text-xs font-bold text-amber-900 mb-1">
                    {t('checkout.contact_notice_title')}
                  </p>
                  <p className="text-[10px] text-amber-900/60 leading-relaxed uppercase tracking-wider">
                    {t('checkout.contact_notice')}
                  </p>
               </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4">
              {order.is_registered_customer ? (
                <Link href={`/account/orders/${order.id}`} className="w-full">
                  <button className="w-full h-16 bg-emerald-950 text-white rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3 hover:bg-[#C9A84C] transition-all group shadow-xl shadow-emerald-950/20">
                    {t('account.view_details')}
                    <ArrowRight size={16} className={`${isRtl ? "group-hover:-translate-x-1 rotate-180" : "group-hover:translate-x-1"} transition-transform`} />
                  </button>
                </Link>
              ) : (
                <div className="space-y-4 md:col-span-2">
                   <div className="p-6 border-2 border-dashed border-emerald-100 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 text-start">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                          <UserPlus size={24} />
                        </div>
                        <div className="text-left rtl:text-right">
                          <p className="font-bold text-emerald-950 text-sm">{t('checkout.register_action')}</p>
                          <p className="text-xs text-emerald-900/40">{t('checkout.register_promo_success')}</p>
                        </div>
                      </div>
                      <Link href="/register">
                        <button className="bg-emerald-100 text-emerald-900 px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-200 transition-colors">
                          {t('checkout.register_action')}
                        </button>
                      </Link>
                   </div>
                   <div className="p-4 bg-emerald-50 text-emerald-950/40 text-[10px] font-bold text-center uppercase tracking-widest rounded-xl">
                      {t('checkout.note_order_number')}: {order.order_number}
                   </div>
                </div>
              )}
              
              <Link href="/" className={order.is_registered_customer ? "w-full" : "w-full md:col-span-2"}>
                <button className="w-full h-14 bg-white border border-emerald-950/10 text-emerald-950 rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-neutral-50 transition-all">
                  <Home size={14} />
                  {t('product.back_to_shop')}
                </button>
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
