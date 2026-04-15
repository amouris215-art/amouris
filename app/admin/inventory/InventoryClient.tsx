'use client'

import { useState, useMemo } from 'react'
import { 
  AlertTriangle, 
  Loader2, Minus, Plus, Filter, 
  Droplets, Box, Search
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import React from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { 
  updateStockGrams as apiUpdateStockGrams, 
  updateVariantStock as apiUpdateVariantStock,
  setProductStockGrams as apiSetStockGrams,
  setVariantStockUnits as apiSetVariantStock
} from '@/lib/api/products'
import { useI18n } from '@/i18n/i18n-context'

interface InventoryClientProps {
  initialProducts: any[]
  settings: any
  categories: any[]
}

export default function InventoryClient({ initialProducts, settings, categories }: InventoryClientProps) {
  const router = useRouter()
  const { t, dir, language } = useI18n()
  const [search, setSearch] = useState('')
  const [isSaving, setIsSaving] = useState<string | null>(null)
  const [filterLowStock, setFilterLowStock] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState('all')

  const thresholdPerfume = settings.alertStockPerfume || 500
  const thresholdFlacon = settings.alertStockFlacon || 10

  const handleSetStock = async (id: string, value: string, type: 'perfume' | 'variant') => {
    const amount = parseFloat(value)
    if (isNaN(amount)) return

    setIsSaving(id)
    try {
      if (type === 'perfume') {
        await apiSetStockGrams(id, amount)
      } else {
        await apiSetVariantStock(id, amount)
      }
      router.refresh()
      toast.success(t('admin.inventory.toast_success'))
    } catch (err: any) {
      toast.error(t('admin.inventory.toast_error') + ': ' + err.message)
    } finally {
      setIsSaving(null)
    }
  }

  const handleUpdatePerfumeStock = async (id: string, current: number, delta: number) => {
    setIsSaving(id)
    try {
      await apiUpdateStockGrams(id, delta)
      router.refresh()
      toast.success(t('admin.inventory.toast_success'))
    } catch (err: any) {
      toast.error(t('admin.inventory.toast_error') + ': ' + err.message)
    } finally {
      setIsSaving(null)
    }
  }

  const handleUpdateVariantStock = async (productId: string, variantId: string, current: number, delta: number) => {
    setIsSaving(variantId)
    try {
      await apiUpdateVariantStock(variantId, delta)
      router.refresh()
      toast.success(t('admin.inventory.toast_success'))
    } catch (err: any) {
      toast.error(t('admin.inventory.toast_error') + ': ' + err.message)
    } finally {
      setIsSaving(null)
    }
  }

  const filtered = useMemo(() => {
    return initialProducts.filter(p => {
      const name = language === 'ar' ? (p.name_ar || p.name_fr) : p.name_fr;
      const matchSearch = name.toLowerCase().includes(search.toLowerCase()) || 
                          p.name_fr.toLowerCase().includes(search.toLowerCase());
      const matchCategory = categoryFilter === 'all' || p.category_id === categoryFilter;
      
      let matchLowStock = true;
      if (filterLowStock) {
        if (p.product_type === 'perfume') {
          matchLowStock = (p.stock_grams || 0) < thresholdPerfume;
        } else {
          matchLowStock = (p.variants || []).some((v: any) => (v.stock_units || 0) < thresholdFlacon);
        }
      }

      return matchSearch && matchCategory && matchLowStock;
    });
  }, [initialProducts, search, categoryFilter, filterLowStock, thresholdPerfume, thresholdFlacon, language]);

  return (
    <div className="space-y-12 pb-20 font-sans" dir={dir}>
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className={dir === 'rtl' ? 'text-right' : ''}>
           <h1 className="font-serif text-4xl text-emerald-950 mb-2 font-bold italic">{t('admin.inventory.title')}</h1>
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C9A84C]">{t('admin.inventory.subtitle')}</p>
        </div>
        <div className="flex bg-neutral-100 p-2 rounded-2xl gap-2 h-fit" dir="ltr">
           <button 
             onClick={() => setFilterLowStock(false)}
             className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${!filterLowStock ? 'bg-emerald-950 text-white shadow-lg' : 'text-emerald-950/40 hover:text-emerald-950'}`}
           >
             {t('admin.inventory.all_stock')}
           </button>
           <button 
             onClick={() => setFilterLowStock(true)}
             className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${filterLowStock ? 'bg-rose-600 text-white shadow-lg' : 'text-emerald-950/40 hover:text-rose-600'}`}
           >
             <AlertTriangle size={12} /> {t('admin.inventory.low_stock')}
           </button>
        </div>
      </header>

      <section className={`flex flex-col md:flex-row gap-6 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
        <div className="relative flex-1 group">
           <Search size={18} className={`absolute ${dir === 'rtl' ? 'right-6' : 'left-6'} top-1/2 -translate-y-1/2 text-emerald-950/20 group-focus-within:text-[#C9A84C] transition-colors`} />
           <input 
             type="text"
             placeholder={t('admin.inventory.search_placeholder')}
             value={search}
             onChange={e => setSearch(e.target.value)}
             className={`w-full h-16 ${dir === 'rtl' ? 'pr-16 pl-8' : 'pl-16 pr-8'} bg-white border border-emerald-950/5 rounded-2xl outline-none focus:border-[#C9A84C] shadow-sm font-medium text-emerald-950 transition-all font-sans ${dir === 'rtl' ? 'text-right' : ''}`}
           />
        </div>
        <div className={`flex bg-neutral-50 p-1.5 rounded-2xl border border-emerald-950/5 h-16 items-center ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <Filter size={16} className="text-emerald-950/20 mx-4" />
            <select 
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className={`bg-transparent text-[10px] font-black uppercase tracking-widest text-emerald-950 outline-none ${dir === 'rtl' ? 'pl-8' : 'pr-8'} cursor-pointer`}
            >
              <option value="all">{t('admin.inventory.all_categories')}</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>
                  {language === 'ar' ? (c.name_ar || c.name_fr) : c.name_fr}
                </option>
              ))}
            </select>
        </div>
      </section>

      <div className="bg-white rounded-[3rem] border border-emerald-950/5 shadow-2xl shadow-emerald-950/5 overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-emerald-950/5 bg-neutral-50/50">
                <th className={`px-10 py-6 ${dir === 'rtl' ? 'text-right' : 'text-left'} text-[9px] font-black uppercase tracking-[0.3em] text-emerald-950/30`}>{t('admin.inventory.table.product')}</th>
                <th className={`px-10 py-6 ${dir === 'rtl' ? 'text-right' : 'text-left'} text-[9px] font-black uppercase tracking-[0.3em] text-emerald-950/30`}>{t('admin.inventory.table.volume')}</th>
                <th className={`px-10 py-6 ${dir === 'rtl' ? 'text-right' : 'text-left'} text-[9px] font-black uppercase tracking-[0.3em] text-emerald-950/30`}>{t('admin.inventory.table.alerts')}</th>
                <th className={`px-10 py-6 ${dir === 'rtl' ? 'text-left' : 'text-right'} text-[9px] font-black uppercase tracking-[0.3em] text-emerald-950/30`}>{t('admin.inventory.table.update')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-950/5">
              <AnimatePresence mode="popLayout">
                {filtered.map((product) => {
                  if (product.product_type === 'perfume') {
                    const current = product.stock_grams || 0;
                    const isLow = current < thresholdPerfume;
                    return (
                      <motion.tr 
                        layout
                        key={product.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="group hover:bg-neutral-50/20 transition-all font-sans"
                      >
                        <td className="px-10 py-8">
                          <div className={`flex items-center gap-6 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                             <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-700">
                                <Droplets size={24} />
                             </div>
                             <div className={dir === 'rtl' ? 'text-right' : ''}>
                               <p className="font-serif text-lg font-bold text-emerald-950">{language === 'ar' ? (product.name_ar || product.name_fr) : product.name_fr}</p>
                               <p className="text-[10px] font-black uppercase tracking-widest text-emerald-950/20 italic">{t('admin.inventory.type_perfume')}</p>
                             </div>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                            <span className="font-mono text-xl font-bold text-emerald-950">{current.toLocaleString()} <span className="text-[10px] font-black opacity-30">{t('admin.inventory.grams_label')}</span></span>
                        </td>
                        <td className="px-10 py-8">
                           {isLow ? (
                             <div className={`flex items-center gap-2 text-rose-500 bg-rose-50 px-3 py-1.5 rounded-xl w-fit ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                                <AlertTriangle size={14} />
                                <span className="text-[9px] font-black uppercase tracking-widest font-sans">{t('admin.inventory.critical_refill')}</span>
                             </div>
                           ) : (
                             <span className="text-[9px] font-black uppercase tracking-widest text-emerald-950/20">{t('admin.inventory.optimal_status')}</span>
                           )}
                        </td>
                        <td className={`px-10 py-8 ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>
                           <div className={`flex ${dir === 'rtl' ? 'justify-start' : 'justify-end'} items-center gap-4`}>
                              <div className="flex items-center bg-neutral-100 rounded-xl p-1 shadow-inner" dir="ltr">
                                 <button 
                                   onClick={() => handleUpdatePerfumeStock(product.id, current, -100)} 
                                   className="w-10 h-10 rounded-lg hover:bg-white transition-all text-emerald-950/40 hover:text-rose-500 flex items-center justify-center"
                                 >
                                   <Minus size={14} />
                                 </button>
                                 <input 
                                   type="number"
                                   defaultValue={current}
                                   onBlur={(e) => {
                                     if (parseFloat(e.target.value) !== current) {
                                       handleSetStock(product.id, e.target.value, 'perfume')
                                     }
                                   }}
                                   onKeyDown={(e) => {
                                     if (e.key === 'Enter') {
                                       handleSetStock(product.id, (e.target as HTMLInputElement).value, 'perfume')
                                       ;(e.target as HTMLInputElement).blur()
                                     }
                                   }}
                                   className="w-24 text-center bg-transparent font-mono font-bold text-lg text-emerald-950 outline-none"
                                 />
                                 <button 
                                   onClick={() => handleUpdatePerfumeStock(product.id, current, 100)} 
                                   className="w-10 h-10 rounded-lg hover:bg-white transition-all text-emerald-950/40 hover:text-emerald-950 flex items-center justify-center"
                                 >
                                   <Plus size={14} />
                                 </button>
                              </div>
                              {isSaving === product.id && <Loader2 size={16} className="animate-spin text-amber-500" />}
                           </div>
                        </td>
                      </motion.tr>
                    );
                  } else {
                    return (
                      <React.Fragment key={product.id}>
                        <tr className="bg-neutral-50 border-b border-emerald-950/5">
                           <td colSpan={4} className={`px-10 py-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                             <div className={`flex items-center gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                                <Box size={16} className="text-amber-600" />
                                <p className="font-serif text-lg font-bold text-emerald-950">
                                  {language === 'ar' ? (product.name_ar || product.name_fr) : product.name_fr} 
                                  <span className={`font-sans text-[10px] font-black text-emerald-950/20 uppercase tracking-widest ${dir === 'rtl' ? 'mr-2' : 'ml-2'}`}>
                                    {t('admin.inventory.variant_system_tag')}
                                  </span>
                                </p>
                             </div>
                           </td>
                        </tr>
                        {product.variants?.map((v: any) => {
                          const isLow = (v.stock_units || 0) < thresholdFlacon;
                          return (
                            <motion.tr key={v.id} layout className="hover:bg-neutral-50/20 transition-all border-b border-emerald-950/5 last:border-0 font-sans">
                               <td className={`px-10 py-5 ${dir === 'rtl' ? 'pr-24 pl-10 text-right' : 'pl-24 pr-10 text-left'}`}>
                                  <div className={`flex items-center gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                                     <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                     <p className="text-sm font-bold text-emerald-950">
                                       {v.size_ml}ml — {language === 'ar' ? (v.color_name_ar || v.color_name) : v.color_name} {v.shape ? `(${v.shape})` : ''}
                                     </p>
                                  </div>
                               </td>
                               <td className="px-10 py-5">
                                  <span className="font-mono text-base font-bold text-emerald-950">{(v.stock_units || 0).toLocaleString()} <span className="text-[9px] font-black opacity-30">{t('admin.inventory.units_label')}</span></span>
                               </td>
                               <td className="px-10 py-5">
                                  {isLow && (
                                    <div className={`flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl w-fit ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                                       <AlertTriangle size={14} />
                                       <span className="text-[9px] font-black uppercase tracking-widest">{t('admin.inventory.low_level')}</span>
                                    </div>
                                  )}
                               </td>
                               <td className={`px-10 py-5 ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>
                                  <div className={`flex ${dir === 'rtl' ? 'justify-start' : 'justify-end'} items-center gap-4`}>
                                     <div className="flex items-center bg-neutral-100 rounded-xl p-1 shadow-inner" dir="ltr">
                                        <button 
                                          onClick={() => handleUpdateVariantStock(product.id, v.id, v.stock_units || 0, -1)} 
                                          className="w-10 h-10 rounded-lg hover:bg-white transition-all text-emerald-950/40 hover:text-rose-500 flex items-center justify-center"
                                        >
                                          <Minus size={14} />
                                        </button>
                                        <input 
                                          type="number"
                                          defaultValue={v.stock_units || 0}
                                          onBlur={(e) => {
                                            if (parseFloat(e.target.value) !== (v.stock_units || 0)) {
                                              handleSetStock(v.id, e.target.value, 'variant')
                                            }
                                          }}
                                          onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                              handleSetStock(v.id, (e.target as HTMLInputElement).value, 'variant')
                                              ;(e.target as HTMLInputElement).blur()
                                            }
                                          }}
                                          className="w-20 text-center bg-transparent font-mono font-bold text-sm text-emerald-950 outline-none"
                                        />
                                        <button 
                                          onClick={() => handleUpdateVariantStock(product.id, v.id, v.stock_units || 0, 1)} 
                                          className="w-10 h-10 rounded-lg hover:bg-white transition-all text-emerald-950/40 hover:text-emerald-950 flex items-center justify-center"
                                        >
                                          <Plus size={14} />
                                        </button>
                                     </div>
                                     {isSaving === v.id && <Loader2 size={16} className="animate-spin text-amber-500" />}
                                  </div>
                               </td>
                            </motion.tr>
                          )
                        })}
                      </React.Fragment>
                    );
                  }
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
