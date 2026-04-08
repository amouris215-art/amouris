'use client'

import { useState, useEffect } from 'react'
import { getProducts, updatePerfumeStock, updateVariantStock } from '@/lib/actions/products'
import { Package, Search, AlertTriangle, Save, Loader2, Minus, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Product } from '@/lib/types'

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isSaving, setIsSaving] = useState<string | null>(null)

  const loadData = async () => {
    setIsLoading(true)
    try {
      const p = await getProducts({ status: 'active' })
      setProducts(p)
    } catch (error) {
      console.error('Failed to load inventory:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleUpdatePerfumeStock = async (id: string, newStock: number) => {
    setIsSaving(id)
    try {
      await updatePerfumeStock(id, newStock)
      setProducts(prev => prev.map(p => p.id === id ? { ...p, stockInGrams: newStock } as any : p))
    } catch (error) {
      alert('Erreur lors de la mise à jour du stock')
    } finally {
      setIsSaving(null)
    }
  }

  const handleUpdateVariantStock = async (productId: string, variantId: string, newStock: number) => {
    setIsSaving(variantId)
    try {
      await updateVariantStock(variantId, newStock)
      setProducts(prev => prev.map(p => {
        if (p.id === productId && p.type === 'flacon') {
          return {
            ...p,
            variants: p.variants.map(v => v.id === variantId ? { ...v, stock: newStock } : v)
          }
        }
        return p
      }))
    } catch (error) {
      alert('Erreur lors de la mise à jour du stock')
    } finally {
      setIsSaving(null)
    }
  }

  const filtered = products.filter(p => {
    return p.nameFR.toLowerCase().includes(search.toLowerCase()) || p.nameAR.includes(search)
  })

  const lowStockThreshold = 500 // 500g for perfume, 10 units for flacons (approx)

  return (
    <div className="space-y-8 p-4 md:p-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
            <h1 className="text-3xl font-bold font-serif text-emerald-950 flex items-center gap-3">
              <Package size={32} />
              Gestion des Stocks
            </h1>
            <p className="text-emerald-950/40 text-sm mt-1">Surveillez et mettez à jour les niveaux de stock en temps réel</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-900/20" />
          <input
            type="text"
            placeholder="Rechercher par nom de produit..."
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
        <div className="space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-emerald-50 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                <thead>
                    <tr className="bg-emerald-50/30">
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/40">Produit</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/40">Type</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/40">Stock Actuel</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/40 text-right">Actions de Stock</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-emerald-50">
                    <AnimatePresence mode="popLayout">
                    {filtered.map(product => {
                      if (product.type === 'perfume') {
                        const isLowStock = product.stockInGrams < lowStockThreshold
                        return (
                          <motion.tr 
                              layout
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              key={product.id} 
                              className="hover:bg-emerald-50/20 transition-all group"
                          >
                            <td className="px-8 py-6">
                                <div className="font-bold text-emerald-950">{product.nameFR}</div>
                                <div className="text-[10px] text-emerald-900/40 font-arabic" dir="rtl">{product.nameAR}</div>
                            </td>
                            <td className="px-8 py-6">
                              <span className="text-[9px] px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full font-black uppercase tracking-widest">Parfum</span>
                            </td>
                            <td className="px-8 py-6">
                               <div className="flex items-center gap-2">
                                  <span className={`font-black ${isLowStock ? 'text-amber-600' : 'text-emerald-900'}`}>
                                    {product.stockInGrams.toLocaleString()}g
                                  </span>
                                  {isLowStock && <AlertTriangle size={14} className="text-amber-600" />}
                               </div>
                            </td>
                            <td className="px-8 py-6">
                               <div className="flex justify-end items-center gap-3">
                                  <div className="flex items-center bg-gray-50 rounded-xl border p-1">
                                     <button 
                                        onClick={() => handleUpdatePerfumeStock(product.id, Math.max(0, product.stockInGrams - 100))}
                                        className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all"
                                     >
                                        <Minus size={14} />
                                     </button>
                                     <input 
                                        type="number" 
                                        className="w-20 text-center bg-transparent font-bold text-sm focus:outline-none" 
                                        value={product.stockInGrams}
                                        onChange={(e) => handleUpdatePerfumeStock(product.id, parseInt(e.target.value) || 0)}
                                     />
                                     <button 
                                        onClick={() => handleUpdatePerfumeStock(product.id, product.stockInGrams + 100)}
                                        className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all"
                                     >
                                        <Plus size={14} />
                                     </button>
                                  </div>
                                  {isSaving === product.id && <Loader2 size={16} className="animate-spin text-emerald-900" />}
                               </div>
                            </td>
                          </motion.tr>
                        )
                      } else {
                        return (
                          <React.Fragment key={product.id}>
                            <tr className="bg-gray-50/50">
                              <td colSpan={4} className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-emerald-900/40">
                                {product.nameFR} (Flacons)
                              </td>
                            </tr>
                            {product.variants.map(variant => {
                              const isLowStock = variant.stock < 10
                              return (
                                <motion.tr 
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    key={variant.id} 
                                    className="hover:bg-emerald-50/20 transition-all group"
                                >
                                  <td className="px-8 py-4 pl-12 text-sm text-emerald-900/60 italic">
                                     {variant.size} — {variant.color} {variant.shape ? `(${variant.shape})` : ''}
                                  </td>
                                  <td className="px-8 py-4">
                                    <span className="text-[9px] px-2 py-1 bg-amber-50 text-amber-700 rounded-full font-black uppercase tracking-widest">Variante</span>
                                  </td>
                                  <td className="px-8 py-4">
                                     <div className="flex items-center gap-2">
                                        <span className={`font-black ${isLowStock ? 'text-amber-600' : 'text-emerald-900'}`}>
                                          {variant.stock} u
                                        </span>
                                        {isLowStock && <AlertTriangle size={14} className="text-amber-600" />}
                                     </div>
                                  </td>
                                  <td className="px-8 py-4">
                                     <div className="flex justify-end items-center gap-3">
                                        <div className="flex items-center bg-gray-50 rounded-xl border p-1">
                                           <button 
                                              onClick={() => handleUpdateVariantStock(product.id, variant.id, Math.max(0, variant.stock - 1))}
                                              className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-lg transition-all"
                                           >
                                              <Minus size={12} />
                                           </button>
                                           <input 
                                              type="number" 
                                              className="w-14 text-center bg-transparent font-bold text-xs focus:outline-none" 
                                              value={variant.stock}
                                              onChange={(e) => handleUpdateVariantStock(product.id, variant.id, parseInt(e.target.value) || 0)}
                                           />
                                           <button 
                                              onClick={() => handleUpdateVariantStock(product.id, variant.id, variant.stock + 1)}
                                              className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-lg transition-all"
                                           >
                                              <Plus size={12} />
                                           </button>
                                        </div>
                                        {isSaving === variant.id && <Loader2 size={14} className="animate-spin text-emerald-900" />}
                                     </div>
                                  </td>
                                </motion.tr>
                              )
                            })}
                          </React.Fragment>
                        )
                      }
                    })}
                    </AnimatePresence>
                </tbody>
                </table>
            </div>
            {filtered.length === 0 && (
              <div className="p-24 text-center">
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Package size={32} className="text-emerald-950/10" />
                  </div>
                  <p className="text-emerald-950/20 font-serif text-xl">Aucun produit trouvé</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

import React from 'react'
