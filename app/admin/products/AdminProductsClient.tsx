"use client";

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Package, 
  Droplet, 
  Filter, 
  Eye, 
  EyeOff, 
  X 
} from 'lucide-react';
import { ProductModal } from '@/components/admin/ProductModal';
import { ProductImage } from '@/components/store/ProductImage';
import { deleteProductAction, updateProductAction } from '@/lib/actions/products.actions';
import { useRouter, useSearchParams } from 'next/navigation';
import { useProductsStore } from '@/store/products.store';
import { useI18n } from '@/i18n/i18n-context';
import { toast } from 'sonner';

interface AdminProductsClientProps {
  initialProducts: any[];
  categories: any[];
  brands: any[];
  collections: any[];
  tags: any[];
}

function StatusBadge({ status }: { status: string }) {
  const { t } = useI18n();
  const isActive = status === 'active';
  return (
    <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-100 text-neutral-400'}`}>
      {isActive ? t('admin.products.status_active') : t('admin.products.status_draft')}
    </span>
  );
}

export default function AdminProductsClient({ 
  initialProducts, 
  categories, 
  brands, 
  collections, 
  tags 
}: AdminProductsClientProps) {
  const { t, dir, language } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState('');
  const invalidateCache = useProductsStore(s => s.invalidateCache);
  const typeFromUrl = searchParams.get('type');
  const [typeFilter, setTypeFilter] = useState<'all' | 'perfume' | 'flacon' | 'accessory'>(
    (typeFromUrl === 'perfume' || typeFromUrl === 'flacon' || typeFromUrl === 'accessory') ? typeFromUrl : 'all'
  );
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft'>('all');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Map products to ensure they have tag_ids correctly formatted
  const products = useMemo(() => {
    return initialProducts.map(p => ({
      ...p,
      tag_ids: p.tags?.map((t: any) => t.tag_id) || []
    }));
  }, [initialProducts]);

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchSearch = (p.name_fr?.toLowerCase().includes(search.toLowerCase()) ?? false) || 
                          (p.name_ar?.includes(search) ?? false);
      const matchType = typeFilter === 'all' || p.product_type === typeFilter;
      const matchCategory = categoryFilter === 'all' || p.category_id === categoryFilter;
      const matchBrand = brandFilter === 'all' || p.brand_id === brandFilter;
      const matchStatus = statusFilter === 'all' || p.status === statusFilter;
      return matchSearch && matchType && matchCategory && matchBrand && matchStatus;
    });
  }, [products, search, typeFilter, categoryFilter, brandFilter, statusFilter]);

  const handleAdd = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleEdit = (p: any) => {
    setEditingProduct(p);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm(t('admin.products.confirm_delete'))) {
      try {
        const result = await deleteProductAction(id);
        if (result.success) {
          invalidateCache();
          router.refresh();
          toast.success(t('admin.products.toast_success_delete'));
        } else {
          toast.error(t('admin.products.toast_error_delete') + ': ' + result.error);
        }
      } catch (err) {
        toast.error(t('admin.products.toast_error_delete'));
      }
    }
  };

  const toggleStatus = async (product: any) => {
    const newStatus = product.status === 'active' ? 'draft' : 'active';
    try {
      const result = await updateProductAction(product.id, { status: newStatus });
      if (result.success) {
        invalidateCache();
        router.refresh();
        toast.success(t('admin.products.toast_success_status'));
      } else {
        toast.error(t('admin.products.toast_error_status') + ': ' + result.error);
      }
    } catch (err) {
      toast.error(t('admin.products.toast_error_status'));
    }
  };

  return (
    <div className="space-y-12 pb-20" dir={dir}>
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <motion.div 
          initial={{ opacity: 0, x: dir === 'rtl' ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={dir === 'rtl' ? 'text-right' : ''}
        >
           <h1 className="font-serif text-5xl text-emerald-950 mb-2 font-bold italic">{t('admin.products.title')}</h1>
           <p className="text-[11px] font-black uppercase tracking-[0.5em] text-[#C9A84C]/80">{t('admin.products.subtitle')}</p>
        </motion.div>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAdd}
          className="bg-[#0a3d2e] text-white px-8 py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-emerald-900/30 hover:shadow-emerald-900/40 transition-all flex items-center gap-3"
        >
          <Plus size={18} /> {t('admin.products.add_button')}
        </motion.button>
      </header>

      {/* Filters & Search */}
      <section className="space-y-6">
        <div className={`flex flex-col md:flex-row gap-6 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
          <div className="relative flex-1 group">
             <Search size={18} className={`absolute ${dir === 'rtl' ? 'right-6' : 'left-6'} top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#C9A84C] transition-colors`} />
             <input 
                type="text"
                placeholder={t('admin.products.search_placeholder')}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className={`w-full h-16 ${dir === 'rtl' ? 'pr-16 pl-8 text-right' : 'pl-16 pr-8'} bg-white border border-emerald-950/5 rounded-2xl outline-none focus:border-[#C9A84C] shadow-sm font-medium text-emerald-950 transition-all font-sans`}
             />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`h-16 px-8 rounded-2xl border flex items-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all ${showFilters ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-white border-emerald-950/5 text-gray-500 hover:text-emerald-950'}`}
          >
            <Filter size={16} /> {showFilters ? t('admin.products.close_filters') : t('admin.products.advanced_filters')}
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 p-10 bg-neutral-100/80 backdrop-blur-md rounded-[2.5rem] border border-emerald-950/5" dir={dir}>
                <div className={`space-y-3 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  <label className="text-[10px] font-black uppercase tracking-widest text-emerald-950/50 px-2">{t('admin.products.product_type_label')}</label>
                  <select value={typeFilter} onChange={e => setTypeFilter(e.target.value as any)} className="w-full h-14 px-5 rounded-2xl bg-white border border-emerald-950/10 outline-none text-[11px] font-bold uppercase text-emerald-950 focus:border-[#C9A84C] transition-all">
                    <option value="all">{t('admin.products.all_types')}</option>
                    <option value="perfume">{t('admin.products.type_perfume')}</option>
                    <option value="flacon">{t('admin.products.type_flacon')}</option>
                    <option value="accessory">{t('admin.products.type_accessory')}</option>
                  </select>
                </div>
                <div className={`space-y-3 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  <label className="text-[10px] font-black uppercase tracking-widest text-emerald-950/50 px-2">{t('admin.categories.title')}</label>
                  <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="w-full h-14 px-5 rounded-2xl bg-white border border-emerald-950/10 outline-none text-[11px] font-bold uppercase text-emerald-950 focus:border-[#C9A84C] transition-all">
                    <option value="all">{t('admin.products.all_categories')}</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{language === 'ar' ? (c.name_ar || c.name_fr) : c.name_fr}</option>)}
                  </select>
                </div>
                <div className={`space-y-3 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  <label className="text-[10px] font-black uppercase tracking-widest text-emerald-950/50 px-2">{t('admin.brands.title')}</label>
                  <select value={brandFilter} onChange={e => setBrandFilter(e.target.value)} className="w-full h-14 px-5 rounded-2xl bg-white border border-emerald-950/10 outline-none text-[11px] font-bold uppercase text-emerald-950 focus:border-[#C9A84C] transition-all">
                    <option value="all">{t('admin.products.all_brands')}</option>
                    {brands.map(b => <option key={b.id} value={b.id}>{language === 'ar' ? (b.name_ar || b.name || b.name_fr) : (b.name || b.name_fr)}</option>)}
                  </select>
                </div>
                <div className={`space-y-3 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  <label className="text-[10px] font-black uppercase tracking-widest text-emerald-950/50 px-2">{t('admin.products.table.status')}</label>
                  <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="w-full h-14 px-5 rounded-2xl bg-white border border-emerald-950/10 outline-none text-[11px] font-bold uppercase text-emerald-950 focus:border-[#C9A84C] transition-all">
                    <option value="all">{t('admin.products.all_statuses')}</option>
                    <option value="active">{t('admin.products.status_active')}</option>
                    <option value="draft">{t('admin.products.status_draft')}</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <div className="luxury-card overflow-hidden">
        {/* Mobile View: Cards */}
        <div className="lg:hidden divide-y divide-emerald-950/5">
          {filtered.map((product) => {
            const isPerfume = product.product_type === 'perfume';
            return (
              <div key={product.id} className="p-5 space-y-4 hover:bg-neutral-50 active:bg-neutral-100 transition-colors">
                <div className={`flex items-center gap-4 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                  <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center overflow-hidden border border-emerald-950/5">
                    <ProductImage 
                      images={product.images} 
                      productName={language === 'ar' ? (product.name_ar || product.name_fr) : product.name_fr} 
                      categoryId={product.category_id} 
                      productType={product.product_type}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-lg text-emerald-950 font-bold truncate leading-tight">{language === 'ar' ? (product.name_ar || product.name_fr) : product.name_fr}</h3>
                    <div className={`flex items-center gap-2 mt-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#C9A84C] italic">/{product.slug}</p>
                      <StatusBadge status={product.status === 'active' ? 'active' : 'draft'} />
                    </div>
                  </div>
                </div>

                <div className={`flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-emerald-950/40 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                   <div className={`space-y-1 ${dir === 'rtl' ? 'text-right' : ''}`}>
                      <p>{(language === 'ar' ? product.categories?.name_ar : product.categories?.name_fr) || t('admin.products.no_category')}</p>
                      <p className="text-emerald-950/20">{(language === 'ar' ? product.brands?.name_ar : (product.brands?.name || product.brands?.name_fr)) || t('admin.products.no_brand')}</p>
                   </div>
                   <div className={dir === 'rtl' ? 'text-left' : 'text-right'}>
                      <p className="text-emerald-950 font-mono text-sm">
                        {isPerfume ? `${product.stock_grams?.toLocaleString()}${t('admin.products.grams')}` : `${product.flacon_variants?.length || 0} ${t('admin.products.units_models')}`}
                      </p>
                      <p className="text-[#C9A84C] mt-1">
                        {isPerfume ? `${product.price_per_gram} ${t('admin.products.per_gram')}` : (
                          (product.flacon_variants?.length > 0) 
                            ? `${Math.min(...product.flacon_variants.map((v: any) => v.price)).toLocaleString()} DZD`
                            : `${(product.base_price || 0).toLocaleString()} DZD`
                        )}
                      </p>
                   </div>
                </div>

                <div className={`flex gap-2 pt-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                   <button 
                     onClick={() => handleEdit(product)}
                     className="flex-1 h-12 rounded-xl bg-white border border-emerald-950/10 text-emerald-950 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                   >
                     <Edit2 size={14} /> {t('admin.common.edit')}
                   </button>
                   <button 
                     onClick={() => toggleStatus(product)}
                     className="flex-1 h-12 rounded-xl bg-white border border-emerald-950/10 text-emerald-950 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                   >
                     {product.status === 'active' ? <EyeOff size={14} /> : <Eye size={14} />} 
                     {product.status === 'active' ? t('admin.products.hide') : t('admin.products.publish')}
                   </button>
                   <button 
                     onClick={() => handleDelete(product.id)}
                     className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center"
                   >
                     <Trash2 size={16} />
                   </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden lg:block overflow-x-auto no-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-emerald-950/5 bg-neutral-50/50">
                <th className={`luxury-table-header ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.products.table.ref')}</th>
                <th className={`luxury-table-header ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.products.table.classification')}</th>
                <th className={`luxury-table-header ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.products.table.inventory')}</th>
                <th className={`luxury-table-header ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.products.table.price')}</th>
                <th className={`luxury-table-header ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.products.table.status')}</th>
                <th className={`luxury-table-header ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>{t('admin.products.table.controls')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-950/5">
              <AnimatePresence mode="popLayout">
                {filtered.map((product) => {
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
                        <div className={`flex items-center gap-6 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                          <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center text-emerald-950/20 group-hover:bg-emerald-50 group-hover:text-[#0a3d2e] transition-all overflow-hidden border border-emerald-950/5 shadow-inner">
                             <ProductImage 
                               images={product.images} 
                               productName={language === 'ar' ? (product.name_ar || product.name_fr) : product.name_fr} 
                               categoryId={product.category_id} 
                               productType={product.product_type}
                               className="w-full h-full"
                             />
                          </div>
                          <div>
                            <p className="font-serif text-2xl text-emerald-950 font-bold mb-0.5">{language === 'ar' ? (product.name_ar || product.name_fr) : product.name_fr}</p>
                            <p className="text-[10px] uppercase font-black tracking-widest text-[#C9A84C] italic">/{product.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <div className={`space-y-1.5 ${dir === 'rtl' ? 'text-right' : ''}`}>
                           <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${isPerfume ? 'bg-emerald-50 text-emerald-700' : product.product_type === 'accessory' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'} ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                             {isPerfume ? <Droplet size={10} /> : product.product_type === 'accessory' ? <Plus size={10} /> : <Package size={10} />}
                             {isPerfume ? t('admin.products.label_huile') : product.product_type === 'accessory' ? t('admin.products.label_accessory') : t('admin.products.label_flacon')}
                           </span>
                           <p className="text-[10px] font-bold text-emerald-950/60 uppercase tracking-widest">
                             {(language === 'ar' ? product.categories?.name_ar : product.categories?.name_fr) || t('admin.products.no_category')} / {(language === 'ar' ? product.brands?.name_ar : (product.brands?.name || product.brands?.name_fr)) || t('admin.products.no_brand')}
                           </p>
                        </div>
                      </td>
                      <td className="px-10 py-6 font-mono">
                         {isPerfume ? (
                           <div className={`space-y-1 ${dir === 'rtl' ? 'text-right' : ''}`}>
                              <p className="text-sm font-bold text-emerald-950">{product.stock_grams?.toLocaleString()} <span className="text-[10px] font-black opacity-30">{t('admin.products.grams').toUpperCase()}</span></p>
                              <div className={`w-20 h-1 bg-neutral-100 rounded-full overflow-hidden ${dir === 'rtl' ? 'ml-auto' : ''}`}>
                                <div className={`h-full bg-emerald-500 ${dir === 'rtl' ? 'float-right' : ''}`} style={{ width: `${Math.min(100, (product.stock_grams || 0) / 10)}%` }} />
                              </div>
                           </div>
                         ) : (
                          <p className={`text-sm font-bold text-emerald-950 ${dir === 'rtl' ? 'text-right' : ''}`}>
                            {(product.flacon_variants?.length || 0)} <span className="text-[10px] font-black opacity-30">{t('admin.products.units_models').toUpperCase()}</span>
                          </p>
                         )}
                      </td>
                      <td className="px-10 py-6 font-mono">
                         <p className={`text-sm font-black text-[#C9A84C] ${dir === 'rtl' ? 'text-right' : ''}`}>
                           {isPerfume ? `${product.price_per_gram} ${t('admin.products.per_gram')}` : (
                             (product.flacon_variants?.length > 0) 
                               ? `${t('admin.products.from_price')} ${Math.min(...product.flacon_variants.map((v: any) => v.price)).toLocaleString()} DZD`
                               : `${(product.base_price || 0).toLocaleString()} DZD`
                           )}
                         </p>
                      </td>
                      <td className="px-10 py-6">
                        <button 
                          onClick={() => toggleStatus(product)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${product.status === 'active' ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-neutral-100 text-neutral-400 hover:bg-neutral-200'} ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                        >
                          {product.status === 'active' ? <Eye size={12} /> : <EyeOff size={12} />}
                          {product.status === 'active' ? t('admin.products.status_active') : t('admin.products.status_draft')}
                        </button>
                      </td>
                      <td className="px-10 py-6 text-right">
                         <div className={`flex ${dir === 'rtl' ? 'justify-start' : 'justify-end'} gap-3`}>
                            <button onClick={() => handleEdit(product)} className="w-12 h-12 rounded-2xl bg-white border border-emerald-950/5 flex items-center justify-center text-emerald-950/40 hover:text-emerald-950 hover:border-emerald-950/20 transition-all shadow-sm">
                               <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDelete(product.id)} className="w-12 h-12 rounded-2xl bg-white border border-emerald-950/5 flex items-center justify-center text-rose-300 hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm">
                               <Trash2 size={16} />
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
          <div className="py-32 text-center bg-neutral-50/20">
             <div className="w-24 h-24 bg-neutral-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-emerald-100 border border-emerald-950/5">
                <Search size={40} />
             </div>
             <p className="font-serif text-3xl text-emerald-950/10 italic">{t('admin.products.no_results')}</p>
             <p className="text-[10px] font-black uppercase tracking-widest text-emerald-950/20 mt-2">{t('admin.products.adjust_filters')}</p>
          </div>
        )}
      </div>

      <ProductModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)}
        product={editingProduct}
        categories={categories}
        brands={brands}
        collections={collections}
        tags={tags}
        onSave={() => {
          invalidateCache();
          setModalOpen(false);
          router.refresh();
        }}
      />
    </div>
  );
}
