"use client";

import { Drawer } from 'vaul';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { useProductsStore } from '@/store/products.store';
import { useI18n } from '@/i18n/i18n-context';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function CartDrawer({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { items, removeItem, updateGrams, updateUnits, getTotal } = useCartStore();
  const { products } = useProductsStore();
  const { t, language, dir } = useI18n();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isAr = language === 'ar';
  const isRtl = dir === 'rtl';
  const isEmpty = items.length === 0;

  const getStockLimit = (item: any) => {
    const product = products.find(p => p.id === item.product_id);
    if (!product) return undefined;
    if (item.product_type === 'perfume') return product.stock_grams;
    const variant = product.variants?.find(v => v.id === item.flacon_variant_id);
    return variant?.stock_units;
  };

  return (
    <Drawer.Root 
      open={open} 
      onOpenChange={onOpenChange} 
      direction={isMobile ? "bottom" : (isRtl ? "left" : "right")}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-[100] bg-emerald-950/40 backdrop-blur-md" />
        <Drawer.Content 
          className={`fixed z-[101] flex flex-col bg-neutral-50 shadow-2xl outline-none ${
            isMobile 
              ? "bottom-0 inset-x-0 h-[85vh] rounded-t-[2.5rem]" 
              : `top-0 ${isRtl ? 'left-0' : 'right-0'} bottom-0 w-full max-w-md`
          }`}
          dir={dir}
        >
          {isMobile && (
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-emerald-950/10 mt-4 mb-2" />
          )}
          
          {/* Header */}
          <div className="flex items-center justify-between p-8 border-b border-emerald-950/5">
            <div className="text-start">
              <Drawer.Title className="font-serif text-2xl text-emerald-950 mb-1">
                {t('cart.title')}
              </Drawer.Title>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C9A84C]">
                {t('cart.items_count')
                  .replace('{count}', items.length.toString())
                  .replace('{items}', items.length > 1 ? t('cart.item_articles') : t('cart.item_article'))
                }
              </p>
            </div>
            {!isMobile && (
              <button 
                onClick={() => onOpenChange(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-emerald-950/5 hover:bg-emerald-50 transition-colors"
              >
                <X size={18} className="text-emerald-950" />
              </button>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 no-scrollbar">
            {isEmpty ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center mb-6">
                  <ShoppingBag size={32} strokeWidth={1} className="text-emerald-900/30" />
                </div>
                <h3 className="font-serif text-xl text-emerald-950 mb-3">
                  {t('cart.empty')}
                </h3>
                <p className="text-emerald-950/40 text-sm max-w-[240px] leading-relaxed mb-8 italic">
                  {t('cart.empty_desc')}
                </p>
                <button 
                  onClick={() => onOpenChange(false)}
                  className="px-8 py-4 bg-[#0a3d2e] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-900/10"
                >
                  {t('cart.continue_shopping')}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => {
                    const isPerfume = item.product_type === 'perfume';
                    const stock = getStockLimit(item);
                    return (
                      <motion.div 
                        layout
                        key={item.id} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="group relative flex gap-4 bg-white p-4 rounded-3xl border border-emerald-950/5 hover:border-emerald-950/10 transition-all shadow-sm shadow-emerald-900/5"
                      >
                        {/* Fake Thumb */}
                        <div className="w-16 h-20 bg-neutral-100 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-950/5">
                           <span className="text-emerald-950/10 font-serif text-2xl select-none">{item.name_fr.charAt(0)}</span>
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                          <div className={`relative ${isRtl ? 'pl-6' : 'pr-6'} text-start`}>
                            <h4 className="font-serif text-base text-emerald-950 truncate mb-0.5">
                              {isAr ? item.name_ar : item.name_fr}
                            </h4>
                            {item.variant_label && (
                              <p className="text-[9px] font-black uppercase tracking-widest text-[#C9A84C]">
                                {item.variant_label}
                              </p>
                            )}
                            <button 
                              onClick={() => removeItem(item.id)}
                              className={`absolute -top-1 ${isRtl ? '-left-1' : '-right-1'} p-2 text-emerald-950/20 hover:text-red-500 transition-colors`}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center bg-neutral-50 rounded-xl p-1 border border-emerald-950/5">
                              <button 
                                onClick={() => isPerfume 
                                  ? updateGrams(item.id, (item.quantity_grams || 0) - 50, stock) 
                                  : updateUnits(item.id, (item.quantity_units || 0) - 1, stock)
                                }
                                className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg text-emerald-950 transition-colors"
                              >
                                {isRtl ? <Plus size={12} /> : <Minus size={12} />}
                              </button>
                              <span className="w-14 text-center text-xs font-bold text-emerald-950">
                                {isPerfume ? `${item.quantity_grams}g` : item.quantity_units}
                              </span>
                              <button 
                                onClick={() => isPerfume 
                                  ? updateGrams(item.id, (item.quantity_grams || 0) + 50, stock) 
                                  : updateUnits(item.id, (item.quantity_units || 0) + 1, stock)
                                }
                                className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg text-emerald-950 transition-colors"
                              >
                                {isRtl ? <Minus size={12} /> : <Plus size={12} />}
                              </button>
                            </div>
                            <div className="text-right rtl:text-left">
                               <p className="text-sm font-bold text-emerald-950">{item.total_price.toLocaleString()} {t('common.dzd')}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Footer */}
          {!isEmpty && (
            <div className="p-8 bg-white border-t border-emerald-950/5 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-emerald-950/30 uppercase tracking-widest">
                    {t('cart.subtotal')}
                  </span>
                  <span className="font-serif text-2xl text-emerald-950">{getTotal().toLocaleString()} {t('common.dzd')}</span>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-[10px] font-black uppercase tracking-widest text-emerald-950/20">
                     {t('cart.shipping_info')}
                   </span>
                   <span className="text-[10px] font-black uppercase tracking-widest text-[#C9A84C]">
                     {isAr ? 'الدفع عند الاستلام' : 'Paiement à la livraison'}
                   </span>
                </div>
              </div>

              <Link 
                href="/checkout" 
                onClick={() => onOpenChange(false)}
                className="group relative w-full h-16 bg-[#0a3d2e] rounded-2xl flex items-center justify-center overflow-hidden transition-transform active:scale-95 shadow-xl shadow-emerald-900/10"
              >
                <div className="absolute inset-0 bg-emerald-900 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <span className="relative z-10 text-white text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3">
                   {t('cart.checkout')}
                   <ArrowRight size={14} className={`${isRtl ? "group-hover:-translate-x-1 rotate-180" : "group-hover:translate-x-1"} transition-transform`} />
                </span>
              </Link>
              
              <p className="text-[9px] text-center text-emerald-950/30 font-black uppercase tracking-widest leading-loose">
                 {t('cart.delivery_guarantee')}<br />
                 {t('cart.satisfaction_guarantee')}
              </p>
            </div>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
