"use client";

import { useState, useMemo } from 'react';
import { useProductsStore, Product } from '@/store/products.store';
import { useCategoriesStore } from '@/store/categories.store';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Package, Droplets, Box, Filter } from 'lucide-react';
import { ProductModal } from '@/components/admin/ProductModal';

export default function AdminProductsPage() {
  const { products, deleteProduct } = useProductsStore();
  const categories = useCategoriesStore(s => s.categories);

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'perfume' | 'flacon'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name_fr.toLowerCase().includes(search.toLowerCase()) || 
                          p.name_ar.includes(search);
      const matchType = typeFilter === 'all' || p.product_type === typeFilter;
      return matchSearch && matchType;
    });
  }, [products, search, typeFilter]);

  const handleAdd = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleEdit = (p: Product) => {
    setEditingProduct(p);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Voulez-vous vraiment retirer ce produit du catalogue ?')) {
      deleteProduct(id);
    }
  };

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
           <h1 className="font-serif text-4xl text-emerald-950 mb-2">Catalogue Maître</h1>
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C9A84C]">Gestion de l'inventaire Amouris</p>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-[#0a3d2e] text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-emerald-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3"
        >
          <Plus size={16} /> Ajouter une référence
        </button>
      </header>

      <section className="flex flex-col md:flex-row gap-6">
        <div className="relative flex-1 group">
           <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-950/20 group-focus-within:text-[#C9A84C] transition-colors" />
           <input 
             type="text"
             placeholder="Rechercher par nom (FR/AR)..."
             value={search}
             onChange={e => setSearch(e.target.value)}
             className="w-full h-16 pl-16 pr-8 bg-white border border-emerald-950/5 rounded-2xl outline-none focus:border-[#C9A84C] shadow-sm font-medium text-emerald-950 transition-all"
           />
        </div>
        <div className="flex bg-neutral-100 p-1.5 rounded-2xl border border-emerald-950/5 h-16 items-center">
            {(['all', 'perfume', 'flacon'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-8 h-full rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${typeFilter === t ? 'bg-[#0a3d2e] text-white shadow-lg' : 'text-emerald-950/40 hover:text-emerald-950'}`}
              >
                {t === 'all' ? 'Tout' : t === 'perfume' ? 'Parfums' : 'Flacons'}
              </button>
            ))}
        </div>
      </section>

      <div className="bg-white rounded-[3rem] border border-emerald-950/5 shadow-2xl shadow-emerald-950/5 overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-emerald-950/5 bg-neutral-50/50">
                <th className="px-10 py-6 text-left text-[9px] font-black uppercase tracking-[0.3em] text-emerald-950/30">Produit</th>
                <th className="px-10 py-6 text-left text-[9px] font-black uppercase tracking-[0.3em] text-emerald-950/30">Type</th>
                <th className="px-10 py-6 text-left text-[9px] font-black uppercase tracking-[0.3em] text-emerald-950/30">Catégorie</th>
                <th className="px-10 py-6 text-left text-[9px] font-black uppercase tracking-[0.3em] text-emerald-950/30">Stock / Variants</th>
                <th className="px-10 py-6 text-left text-[9px] font-black uppercase tracking-[0.3em] text-emerald-950/30">Tarification</th>
                <th className="px-10 py-6 text-right text-[9px] font-black uppercase tracking-[0.3em] text-emerald-950/30">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-950/5">
              <AnimatePresence mode="popLayout">
                {filtered.map((product) => {
                  const cat = categories.find(c => c.id === product.category_id);
                  const isPerfume = product.product_type === 'perfume';
                  
                  return (
                    <motion.tr 
                      layout
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="group hover:bg-neutral-50/50 transition-colors"
                    >
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-neutral-100 rounded-2xl flex items-center justify-center text-emerald-950/20 group-hover:bg-emerald-50 group-hover:text-[#0a3d2e] transition-all overflow-hidden border border-emerald-950/5">
                             {product.images?.[0] ? <img src={product.images[0]} className="w-full h-full object-cover" /> : <Package size={20} />}
                          </div>
                          <div>
                            <p className="font-serif text-lg text-emerald-950">{product.name_fr}</p>
                            <p className="text-xs font-arabic text-emerald-950/30" dir="rtl">{product.name_ar}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                         <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${isPerfume ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                           {isPerfume ? <Droplets size={10} /> : <Box size={10} />}
                           {isPerfume ? 'Huile' : 'Flacon'}
                         </span>
                      </td>
                      <td className="px-10 py-6">
                        <p className="text-xs font-bold text-emerald-950/50">{cat?.name_fr || 'Sans catégorie'}</p>
                      </td>
                      <td className="px-10 py-6">
                         {isPerfume ? (
                           <p className="text-sm font-bold text-emerald-950">{product.stock_grams?.toLocaleString()} <span className="text-[10px] font-black opacity-30">GR</span></p>
                         ) : (
                           <p className="text-sm font-bold text-emerald-950">{product.variants?.length || 0} <span className="text-[10px] font-black opacity-30">MODÈLES</span></p>
                         )}
                      </td>
                      <td className="px-10 py-6">
                         <p className="text-sm font-bold text-[#C9A84C]">
                           {isPerfume ? `${product.price_per_gram} DZD/g` : `Dès ${Math.min(...(product.variants?.map(v => v.price) || [0]))} DZD`}
                         </p>
                      </td>
                      <td className="px-10 py-6 text-right">
                         <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(product)} className="w-10 h-10 rounded-xl bg-white border border-emerald-950/5 flex items-center justify-center text-emerald-950/40 hover:text-emerald-950 hover:border-emerald-950/20 transition-all shadow-sm">
                               <Edit2 size={14} />
                            </button>
                            <button onClick={() => handleDelete(product.id)} className="w-10 h-10 rounded-xl bg-white border border-emerald-950/5 flex items-center justify-center text-rose-300 hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm">
                               <Trash2 size={14} />
                            </button>
                         </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-32 text-center">
             <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-100">
                <Search size={32} />
             </div>
             <p className="font-serif text-2xl text-emerald-950/20 italic">Aucune référence trouvée dans le catalogue.</p>
          </div>
        )}
      </div>

      <ProductModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        product={editingProduct} 
      />
    </div>
  );
}
