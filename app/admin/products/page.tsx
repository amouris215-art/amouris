'use client'
import { useState } from 'react'
import { useProductsStore } from '@/store/products.store'
import { useCategoriesStore } from '@/store/categories.store'
import { Plus, Search, Edit2, Trash2, Package, Filter } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'

export default function AdminProductsPage() {
  const { products, remove } = useProductsStore()
  const categories = useCategoriesStore(s => s.categories)
  
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'perfume' | 'flacon'>('all')

  const filtered = products.filter(p => {
    const matchSearch = p.name_fr.toLowerCase().includes(search.toLowerCase()) ||
                       p.name_ar.includes(search)
    const matchType = typeFilter === 'all' || p.product_type === typeFilter
    return matchSearch && matchType
  })

  return (
    <div className="space-y-8 p-4 md:p-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
            <h1 className="text-3xl font-bold font-serif text-emerald-950">Catalogue Produits</h1>
            <p className="text-emerald-950/40 text-sm mt-1">Gérez votre inventaire de parfums et flacons</p>
        </div>
        <Button className="bg-emerald-900 text-white px-8 py-6 rounded-2xl hover:bg-emerald-800 shadow-xl shadow-emerald-900/10 transition-all font-bold flex items-center gap-3">
          <Plus size={20} /> Ajouter un produit
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-900/20" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white border border-emerald-50 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-emerald-900/5 transition-all shadow-sm"
          />
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl border border-emerald-50 shadow-sm">
          {(['all', 'perfume', 'flacon'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${typeFilter === t ? 'bg-emerald-900 text-white shadow-lg' : 'text-emerald-950/40 hover:text-emerald-900 hover:bg-emerald-50'}`}
            >
              {t === 'all' ? 'Tous' : t === 'perfume' ? 'Parfums' : 'Flacons'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-emerald-50 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
            <thead>
                <tr className="bg-emerald-50/30">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/40">Produit</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/40 text-center">Type</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/40">Catégorie</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/40">Prix de base</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/40">Stock actuel</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/40 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50">
                <AnimatePresence mode="popLayout">
                {filtered.map(product => {
                const cat = categories.find(c => c.id === product.category_id)
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
                        <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-900 transition-colors">
                            <Package size={20} className="text-emerald-900 group-hover:text-white transition-colors" />
                        </div>
                        <div>
                            <div className="font-bold text-emerald-950 text-base">{product.name_fr}</div>
                            <div className="text-emerald-950/30 text-xs font-arabic" dir="rtl">{product.name_ar}</div>
                        </div>
                        </div>
                    </td>
                    <td className="px-8 py-6">
                        <div className="flex justify-center">
                            <span className={`text-[9px] px-3 py-1.5 rounded-full font-black uppercase tracking-widest ${product.product_type === 'perfume' ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-700'}`}>
                                {product.product_type === 'perfume' ? 'Parfum' : 'Flacon'}
                            </span>
                        </div>
                    </td>
                    <td className="px-8 py-6 font-medium text-emerald-900/60">{cat?.name_fr || '—'}</td>
                    <td className="px-8 py-6 font-black text-emerald-950 font-sans">
                        {product.product_type === 'perfume'
                        ? `${product.price_per_gram?.toLocaleString()} DZD/g`
                        : `Dès ${product.base_price?.toLocaleString()} DZD`}
                    </td>
                    <td className="px-8 py-6">
                        {product.product_type === 'perfume'
                        ? <span className="font-bold text-emerald-900">{product.stock_grams?.toLocaleString()} <span className="text-[10px] font-normal text-emerald-900/40">grammes</span></span>
                        : <span className="px-3 py-1 bg-emerald-50 text-emerald-900 text-[10px] font-bold rounded-lg uppercase tracking-tighter">{product.variants?.length || 0} Variantes</span>}
                    </td>
                    <td className="px-8 py-6">
                        <div className="flex justify-end gap-3">
                        <button className="w-10 h-10 flex items-center justify-center text-emerald-900/20 hover:text-emerald-900 hover:bg-emerald-50 rounded-xl transition-all">
                            <Edit2 size={16} />
                        </button>
                        <button 
                            onClick={() => { if(confirm('Sûr ?')) remove(product.id) }}
                            className="w-10 h-10 flex items-center justify-center text-rose-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                        >
                            <Trash2 size={16} />
                        </button>
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
          <div className="p-24 text-center">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package size={32} className="text-emerald-950/10" />
              </div>
              <p className="text-emerald-950/20 font-serif text-xl">Aucun produit ne correspond à votre recherche</p>
          </div>
        )}
      </div>
    </div>
  )
}
