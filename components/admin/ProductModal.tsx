"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useProductsStore, FlaconVariant, Product } from '@/store/products.store';
import { useCategoriesStore } from '@/store/categories.store';
import { useBrandsStore } from '@/store/brands.store';
import { useTagsStore } from '@/store/tags.store';
import { Upload, X, Plus, Trash2, Loader2, Sparkles, Box, Droplets } from 'lucide-react';

interface ProductModalProps {
  product?: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const { addProduct, updateProduct } = useProductsStore();
  const categories = useCategoriesStore(s => s.categories);
  const brands = useBrandsStore(s => s.brands);
  const tags = useTagsStore(s => s.tags);

  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState<'perfume' | 'flacon'>('perfume');
  
  const [formData, setFormData] = useState<Partial<Product>>({
    name_fr: '',
    name_ar: '',
    description_fr: '',
    description_ar: '',
    category_id: '',
    brand_id: '',
    tag_ids: [],
    images: [],
    status: 'active',
  });

  // Specific fields
  const [pricePerGram, setPricePerGram] = useState<number>(0);
  const [stockGrams, setStockGrams] = useState<number>(0);
  const [variants, setVariants] = useState<FlaconVariant[]>([]);

  useEffect(() => {
    if (product) {
      setType(product.product_type);
      setFormData({
        name_fr: product.name_fr,
        name_ar: product.name_ar,
        description_fr: product.description_fr,
        description_ar: product.description_ar,
        category_id: product.category_id,
        brand_id: product.brand_id,
        tag_ids: product.tag_ids || [],
        images: product.images || [],
        status: product.status || 'active',
      });
      if (product.product_type === 'perfume') {
        setPricePerGram(product.price_per_gram || 0);
        setStockGrams(product.stock_grams || 0);
      } else {
        setVariants(product.variants || []);
      }
    } else {
      setType('perfume');
      setFormData({
        name_fr: '',
        name_ar: '',
        description_fr: '',
        description_ar: '',
        category_id: categories[0]?.id || '',
        brand_id: '',
        tag_ids: [],
        images: [],
        status: 'active',
      });
      setPricePerGram(0);
      setStockGrams(0);
      setVariants([]);
    }
  }, [product, isOpen, categories]);

  const handleAddVariant = () => {
    setVariants([...variants, {
      id: `v_${Date.now()}`,
      size_ml: 50,
      color: '#000000',
      color_name: 'Noir',
      shape: 'Ronde',
      price: 0,
      stock_units: 0
    }]);
  };

  const handleRemoveVariant = (id: string) => {
    setVariants(variants.filter(v => v.id !== id));
  };

  const handeUpdateVariant = (id: string, updates: Partial<FlaconVariant>) => {
    setVariants(variants.map(v => v.id === id ? { ...v, ...updates } : v));
  };

  const toggleTag = (tagId: string) => {
    const current = formData.tag_ids || [];
    if (current.includes(tagId)) {
      setFormData({ ...formData, tag_ids: current.filter(id => id !== tagId) });
    } else {
      setFormData({ ...formData, tag_ids: [...current, tagId] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data: any = {
        ...formData,
        product_type: type,
        ...(type === 'perfume' ? { price_per_gram: pricePerGram, stock_grams: stockGrams } : { variants })
      };

      if (product) {
        updateProduct(product.id, data);
      } else {
        addProduct(data);
      }
      onClose();
    } catch (err) {
      alert('Erreur lors de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-[2rem] p-0 border-none shadow-2xl">
        <div className="bg-[#0a3d2e] p-8 text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-[80px]" />
           <DialogHeader className="relative z-10">
              <DialogTitle className="font-serif text-3xl">
                {product ? 'Modifier l\'essence' : 'Nouvelle création'}
              </DialogTitle>
              <p className="text-emerald-100/40 text-[10px] font-black uppercase tracking-[0.4em]">Administration Catalogue</p>
           </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-12">
           {/* Product Type Toggle */}
           <div className="flex gap-4 p-2 bg-neutral-100 rounded-2xl w-fit">
              <button 
                type="button" 
                onClick={() => setType('perfume')}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${type === 'perfume' ? 'bg-[#0a3d2e] text-white shadow-lg' : 'text-emerald-950/40 hover:text-emerald-950'}`}
              >
                <Droplets size={14} /> Parfum / Huile
              </button>
              <button 
                type="button" 
                onClick={() => setType('flacon')}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${type === 'flacon' ? 'bg-[#0a3d2e] text-white shadow-lg' : 'text-emerald-950/40 hover:text-emerald-950'}`}
              >
                <Box size={14} /> Flacon / Vide
              </button>
           </div>

           {/* Core Info */}
           <section className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-emerald-950/20 px-1">Nom Français</label>
                    <input required value={formData.name_fr} onChange={e => setFormData({ ...formData, name_fr: e.target.value })} className="w-full h-14 px-6 rounded-2xl bg-neutral-50 border border-emerald-950/5 focus:border-[#C9A84C] outline-none font-medium text-emerald-950 transition-colors" />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-emerald-950/20 px-1">Nom Arabe</label>
                    <input required value={formData.name_ar} onChange={e => setFormData({ ...formData, name_ar: e.target.value })} dir="rtl" className="w-full h-14 px-6 rounded-2xl bg-neutral-50 border border-emerald-950/5 focus:border-[#C9A84C] outline-none font-medium text-emerald-950 transition-colors font-arabic" />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-emerald-950/20 px-1">Description FR</label>
                    <textarea value={formData.description_fr} onChange={e => setFormData({ ...formData, description_fr: e.target.value })} rows={3} className="w-full p-6 rounded-2xl bg-neutral-50 border border-emerald-950/5 focus:border-[#C9A84C] outline-none font-medium text-emerald-950 transition-colors resize-none" />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-emerald-950/20 px-1">Description AR</label>
                    <textarea value={formData.description_ar} onChange={e => setFormData({ ...formData, description_ar: e.target.value })} rows={3} dir="rtl" className="w-full p-6 rounded-2xl bg-neutral-50 border border-emerald-950/5 focus:border-[#C9A84C] outline-none font-medium text-emerald-950 transition-colors font-arabic resize-none" />
                 </div>
              </div>
           </section>

           {/* Taxonomy */}
           <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-emerald-950/20 px-1">Classification Boutique</label>
                    <select value={formData.category_id} onChange={e => setFormData({ ...formData, category_id: e.target.value })} className="w-full h-14 px-6 rounded-2xl bg-neutral-50 border border-emerald-950/5 outline-none text-sm font-bold text-emerald-950">
                       <option value="">Sélectionner une catégorie</option>
                       {categories.map(c => <option key={c.id} value={c.id}>{c.name_fr}</option>)}
                    </select>
                 </div>
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-emerald-950/20 px-1">Maison / Marque</label>
                    <select value={formData.brand_id || ''} onChange={e => setFormData({ ...formData, brand_id: e.target.value })} className="w-full h-14 px-6 rounded-2xl bg-neutral-50 border border-emerald-950/5 outline-none text-sm font-bold text-emerald-950">
                       <option value="">Sélectionner une marque</option>
                       {brands.map(b => <option key={b.id} value={b.id}>{b.name_fr}</option>)}
                    </select>
                 </div>
              </div>

              <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-emerald-950/20 px-1">Tags & Attributs</label>
                  <div className="flex flex-wrap gap-2">
                     {tags.map(t => (
                        <button 
                           key={t.id} 
                           type="button" 
                           onClick={() => toggleTag(t.id)}
                           className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${formData.tag_ids?.includes(t.id) ? 'bg-[#C9A84C] border-[#C9A84C] text-emerald-950' : 'bg-neutral-50 border-emerald-950/5 text-emerald-950/40'}`}
                        >
                           {t.name_fr}
                        </button>
                     ))}
                  </div>
              </div>
           </section>

           {/* Type Specific Fields */}
           <section className="p-8 md:p-12 bg-neutral-50 rounded-[2.5rem] border border-emerald-950/5">
              {type === 'perfume' ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-widest text-emerald-950/20 px-1">Prix par Gramme (DZD)</label>
                       <input type="number" step={0.01} value={pricePerGram} onChange={e => setPricePerGram(+e.target.value)} className="w-full h-16 px-8 rounded-2xl bg-white border border-emerald-950/5 text-2xl font-serif text-emerald-950 outline-none" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-widest text-emerald-950/20 px-1">Stock en Grammes</label>
                       <input type="number" value={stockGrams} onChange={e => setStockGrams(+e.target.value)} className="w-full h-16 px-8 rounded-2xl bg-white border border-emerald-950/5 text-2xl font-serif text-emerald-950 outline-none" />
                    </div>
                 </div>
              ) : (
                 <div className="space-y-8">
                    <div className="flex justify-between items-center mb-4">
                       <h3 className="font-serif text-xl text-emerald-950">Gestion des variantes</h3>
                       <button type="button" onClick={handleAddVariant} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-600 hover:text-amber-500 transition-colors">
                          <Plus size={14} /> Ajouter une taille/couleur
                       </button>
                    </div>
                    
                    <div className="space-y-4">
                       {variants.map((v, i) => (
                          <div key={v.id} className="grid grid-cols-2 md:grid-cols-6 gap-4 p-6 bg-white border border-emerald-950/5 rounded-[2rem] items-end">
                             <div className="space-y-2 col-span-1">
                                <label className="text-[8px] font-black uppercase tracking-widest text-emerald-950/20">Contenance ml</label>
                                <input type="number" value={v.size_ml} onChange={e => handeUpdateVariant(v.id, { size_ml: +e.target.value })} className="w-full h-10 px-3 bg-neutral-50 rounded-lg text-xs font-bold" />
                             </div>
                             <div className="space-y-2 col-span-1">
                                <label className="text-[8px] font-black uppercase tracking-widest text-emerald-950/20">Teinte</label>
                                <div className="flex gap-2">
                                   <input type="color" value={v.color} onChange={e => handeUpdateVariant(v.id, { color: e.target.value })} className="w-10 h-10 p-0 border-none bg-transparent cursor-pointer" />
                                   <input type="text" value={v.color_name} onChange={e => handeUpdateVariant(v.id, { color_name: e.target.value })} placeholder="Nom" className="w-full h-10 px-3 bg-neutral-50 rounded-lg text-[10px] font-bold" />
                                </div>
                             </div>
                             <div className="space-y-2 col-span-1">
                                <label className="text-[8px] font-black uppercase tracking-widest text-emerald-950/20">Forme</label>
                                <input type="text" value={v.shape} onChange={e => handeUpdateVariant(v.id, { shape: e.target.value })} className="w-full h-10 px-3 bg-neutral-50 rounded-lg text-xs font-bold" />
                             </div>
                             <div className="space-y-2 col-span-1">
                                <label className="text-[8px] font-black uppercase tracking-widest text-emerald-950/20">Prix (DZD)</label>
                                <input type="number" value={v.price} onChange={e => handeUpdateVariant(v.id, { price: +e.target.value })} className="w-full h-10 px-3 bg-neutral-50 rounded-lg text-xs font-bold text-amber-600" />
                             </div>
                             <div className="space-y-2 col-span-1">
                                <label className="text-[8px] font-black uppercase tracking-widest text-emerald-950/20">Unités Stock</label>
                                <input type="number" value={v.stock_units} onChange={e => handeUpdateVariant(v.id, { stock_units: +e.target.value })} className="w-full h-10 px-3 bg-neutral-50 rounded-lg text-xs font-bold" />
                             </div>
                             <div className="flex justify-end p-2">
                                <button type="button" onClick={() => handleRemoveVariant(v.id)} className="text-rose-400 hover:text-rose-600 transition-colors p-2"><Trash2 size={16} /></button>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              )}
           </section>

           <div className="pt-12 border-t border-emerald-950/5 flex gap-4">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 h-16 rounded-2xl border border-emerald-950/5 text-emerald-950/40 text-[10px] font-black uppercase tracking-widest hover:bg-neutral-50 transition-colors"
              >
                Annuler
              </button>
              <button 
                type="submit" 
                disabled={isLoading}
                className="flex-[2] h-16 rounded-2xl bg-[#0a3d2e] text-white text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-emerald-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                {isLoading ? <Loader2 className="animate-spin" size={16} /> : (product ? 'Enregistrer les modifications' : 'Créer la référence boutique')}
              </button>
           </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
