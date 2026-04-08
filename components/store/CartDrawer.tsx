"use client";

import { Drawer } from 'vaul';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { useI18n } from '@/i18n/i18n-context';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartDrawer({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { items, removeItem, updateGrams, updateUnits, getTotal } = useCartStore();
  const { language } = useI18n();

  const isAr = language === 'ar';
  const isEmpty = items.length === 0;

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} direction="right">
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-[100] bg-emerald-950/40 backdrop-blur-md" />
        <Drawer.Content className="fixed inset-y-0 right-0 z-[101] flex w-full max-w-md flex-col bg-neutral-50 shadow-2xl outline-none">
          
          {/* Header */}
          <div className="flex items-center justify-between p-8 border-b border-emerald-950/5">
            <div>
              <Drawer.Title className="font-serif text-2xl text-emerald-950 mb-1">
                {isAr ? 'حقيبة التسوق' : 'Votre Panier'}
              </Drawer.Title>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C9A84C]">
                {items.length} {isAr ? 'منتج' : 'Articles sélectionnés'}
              </p>
            </div>
            <button 
              onClick={() => onOpenChange(false)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-emerald-950/5 hover:bg-emerald-50 transition-colors"
            >
              <X size={18} className="text-emerald-950" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-8 py-6 no-scrollbar">
            {isEmpty ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center mb-6">
                  <ShoppingBag size={32} strokeWidth={1} className="text-emerald-900/30" />
                </div>
                <h3 className="font-serif text-xl text-emerald-950 mb-3">Votre panier est vide</h3>
                <p className="text-emerald-950/40 text-sm max-w-[240px] leading-relaxed mb-8 italic">
                  Explorez nos collections pour trouver votre signature olfactive.
                </p>
                <button 
                  onClick={() => onOpenChange(false)}
                  className="px-8 py-4 bg-[#0a3d2e] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-900/10"
                >
                  Continuer la découverte
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => {
                    const isPerfume = item.product_type === 'perfume';
                    return (
                      <motion.div 
                        layout
                        key={item.id} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="group relative flex gap-6 bg-white p-6 rounded-[2rem] border border-emerald-950/5 hover:border-emerald-950/10 transition-all shadow-sm shadow-emerald-900/5 mb-4"
                      >
                        {/* Fake Thumb (since images might be missing) */}
                        <div className="w-20 h-24 bg-neutral-100 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-950/5">
                           <span className="text-emerald-950/10 font-serif text-3xl select-none">{item.name_fr.charAt(0)}</span>
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div className="relative pr-6">
                            <h4 className="font-serif text-base text-emerald-950 truncate mb-1">
                              {isAr ? item.name_ar : item.name_fr}
                            </h4>
                            {item.variant_label && (
                              <p className="text-[9px] font-black uppercase tracking-widest text-[#C9A84C]">
                                {item.variant_label}
                              </p>
                            )}
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="absolute -top-1 -right-1 p-2 text-emerald-950/20 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center bg-neutral-50 rounded-xl p-1 border border-emerald-950/5">
                              <button 
                                onClick={() => isPerfume ? updateGrams(item.id, (item.quantity_grams || 0) - 50) : updateUnits(item.id, (item.quantity_units || 0) - 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg text-emerald-950 transition-colors"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-12 text-center text-xs font-bold text-emerald-950">
                                {isPerfume ? `${item.quantity_grams}g` : item.quantity_units}
                              </span>
                              <button 
                                onClick={() => isPerfume ? updateGrams(item.id, (item.quantity_grams || 0) + 50) : updateUnits(item.id, (item.quantity_units || 0) + 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg text-emerald-950 transition-colors"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            <div className="text-right">
                               <p className="text-sm font-bold text-emerald-950">{item.total_price.toLocaleString()} DZD</p>
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
                  <span className="text-xs font-bold text-emerald-950/30 uppercase tracking-widest">Sous-total</span>
                  <span className="font-serif text-2xl text-emerald-950">{getTotal().toLocaleString()} DZD</span>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-[10px] font-black uppercase tracking-widest text-emerald-950/10">Livraison (Algérie)</span>
                   <span className="text-[10px] font-black uppercase tracking-widest text-[#C9A84C]">Paiement à la livraison</span>
                </div>
              </div>

              <Link 
                href="/checkout" 
                onClick={() => onOpenChange(false)}
                className="group relative w-full h-16 bg-[#0a3d2e] rounded-2xl flex items-center justify-center overflow-hidden transition-transform active:scale-95"
              >
                <div className="absolute inset-0 bg-emerald-900 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <span className="relative z-10 text-white text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3">
                   {isAr ? 'إتمام الطلب' : 'Passer la commande'}
                   <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              
              <p className="text-[9px] text-center text-emerald-950/20 font-black uppercase tracking-widest leading-loose">
                 Livraison sécurisée dans les 48 wilayas.<br />
                 Garantie de satisfaction Amouris Parfums.
              </p>
            </div>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
