"use client";

import { useMemo, useState, useEffect } from 'react';
import { useI18n } from '@/i18n/i18n-context';
import { useProductsStore } from '@/store/products.store';
import { useCategoriesStore } from '@/store/categories.store';
import { useBrandsStore } from '@/store/brands.store';
import { useCollectionsStore } from '@/store/collections.store';
import { useTagsStore } from '@/store/tags.store';
import { useCartStore } from '@/store/cart.store';
import { motion } from 'framer-motion';
import { ChevronRight, Minus, Plus, ShoppingCart, Info, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface ProductClientProps {
  slug: string;
}

export default function ProductClient({ slug }: ProductClientProps) {
  const { language } = useI18n();
  const product = useProductsStore(s => s.getBySlug(slug));
  const categories = useCategoriesStore(s => s.categories);
  const brands = useBrandsStore(s => s.brands);
  const collections = useCollectionsStore(s => s.collections);
  const tagsList = useTagsStore(s => s.tags);
  const addItem = useCartStore(s => s.addItem);

  const [grams, setGrams] = useState(100);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  const isAr = language === 'ar';

  // Initialize variant for flacons
  useEffect(() => {
    if (product?.product_type === 'flacon' && product.variants && product.variants.length > 0) {
      setSelectedVariantId(product.variants[0].id);
    }
  }, [product]);

  const selectedVariant = useMemo(() => {
    return product?.variants?.find(v => v.id === selectedVariantId) || null;
  }, [product, selectedVariantId]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <h2 className="font-serif text-3xl text-emerald-950 mb-4">Produit introuvable</h2>
        <p className="text-emerald-900/40 mb-8">Désolé, ce produit n'existe pas ou plus.</p>
        <Link href="/shop" className="bg-[#0a3d2e] text-white px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest">
            Retour à la boutique
        </Link>
      </div>
    );
  }

  const category = categories.find(c => c.id === product.category_id);
  const brand = brands.find(b => b.id === product.brand_id);
  const collection = collections.find(c => c.id === product.collection_id);
  const productTags = tagsList.filter(t => product.tag_ids.includes(t.id));

  const isPerfume = product.product_type === 'perfume';
  const unitPrice = isPerfume ? (product.price_per_gram || 0) : (selectedVariant?.price || 0);
  const total = isPerfume ? unitPrice * grams : unitPrice * quantity;

  const handleAddToCart = () => {
    addItem({
      product_id: product.id,
      product_type: product.product_type,
      name_fr: product.name_fr,
      name_ar: product.name_ar,
      slug: product.slug,
      flacon_variant_id: selectedVariantId || undefined,
      variant_label: selectedVariant ? `${selectedVariant.size} — ${selectedVariant.color}` : undefined,
      unit_price: unitPrice,
      quantity_grams: isPerfume ? grams : undefined,
      quantity_units: !isPerfume ? quantity : undefined,
      total_price: total,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 pb-32">
      {/* Breadcrumb */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-950/20">
          <Link href="/shop" className="hover:text-emerald-950 transition-colors">Boutique</Link>
          <ChevronRight size={12} />
          <Link href={isPerfume ? '/shop/parfums' : '/shop/flacons'} className="hover:text-emerald-950 transition-colors">
            {isPerfume ? (isAr ? 'عطور' : 'Parfums') : (isAr ? 'قوارير' : 'Flacons')}
          </Link>
          {category && (
            <>
              <ChevronRight size={12} />
              <span className="opacity-50">{isAr ? category.name_ar : category.name_fr}</span>
            </>
          )}
        </div>
      </div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left: Gallery (Placeholder for now) */}
          <div className="space-y-6">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="aspect-[4/5] bg-white rounded-[3rem] shadow-2xl shadow-emerald-950/5 border border-emerald-950/5 flex items-center justify-center relative overflow-hidden group"
            >
              <span className="text-emerald-950/5 font-serif text-[15rem] select-none group-hover:scale-110 transition-transform duration-1000">
                {product.name_fr.charAt(0)}
              </span>
              <div className="absolute top-8 right-8">
                 {brand && <div className="bg-white/80 backdrop-blur px-6 py-3 rounded-2xl shadow-sm border border-emerald-950/5">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C9A84C]">{isAr ? brand.name_ar : brand.name_fr}</p>
                 </div>}
              </div>
            </motion.div>
          </div>

          {/* Right: Info & Purchase */}
          <div className="flex flex-col">
            <div className="mb-10">
              <div className="flex items-center gap-4 mb-4">
                 <span className="bg-emerald-50 text-[#0a3d2e] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                    {isPerfume ? (isAr ? 'مجموعة الزيوت' : 'Huile de Parfum') : (isAr ? 'عبوة فاخرة' : 'Packaging Elite')}
                 </span>
                 {product.status === 'draft' && <span className="bg-amber-50 text-amber-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100">Brouillon</span>}
              </div>

              <h1 className="font-serif text-5xl md:text-6xl text-emerald-950 mb-3 tracking-tight">
                {product.name_fr}
              </h1>
              <p className="text-emerald-950/30 text-2xl font-arabic mb-8" dir="rtl">
                {product.name_ar}
              </p>

              <div className="prose prose-emerald max-w-none">
                <p className="text-emerald-950/60 leading-relaxed text-lg">
                  {product.description_fr}
                </p>
                {product.description_ar && <p className="text-emerald-950/40 text-sm mt-4 italic font-arabic" dir="rtl">{product.description_ar}</p>}
              </div>
            </div>

            <div className="h-px bg-emerald-950/5 mb-12" />

            {/* Selection Logic */}
            <div className="space-y-12 mb-12">
              {isPerfume ? (
                /* Perfume: Grams Selector */
                <div className="space-y-8">
                   <div className="flex justify-between items-center">
                      <h3 className="text-[10px] uppercase font-black tracking-[0.3em] text-emerald-950/20">Quantité en grammes</h3>
                      <span className="text-[10px] font-bold text-[#C9A84C]">Min. 100g — Stock: {product.stock_grams?.toLocaleString()}g</span>
                   </div>
                   
                   <div className="flex items-center gap-6">
                      <div className="flex items-center bg-white border border-emerald-950/5 rounded-2xl p-2 shadow-sm">
                        <button 
                          onClick={() => setGrams(Math.max(100, grams - 50))} 
                          className="w-14 h-14 rounded-xl hover:bg-emerald-50 text-emerald-950 transition-colors flex items-center justify-center"
                        >
                          <Minus size={20} />
                        </button>
                        <input 
                           type="number" 
                           value={grams}
                           onChange={(e) => setGrams(Math.max(100, +e.target.value))}
                           className="w-24 text-center font-serif text-2xl text-emerald-950 bg-transparent outline-none"
                        />
                        <button 
                           onClick={() => setGrams(grams + 50)} 
                           className="w-14 h-14 rounded-xl hover:bg-emerald-50 text-emerald-950 transition-colors flex items-center justify-center"
                        >
                          <Plus size={20} />
                        </button>
                      </div>
                      <span className="text-emerald-950/20 font-serif text-2xl italic">grammes</span>
                   </div>
                </div>
              ) : (
                /* Flacon: Variant Selector */
                <div className="space-y-12">
                  <div className="space-y-6">
                    <h3 className="text-[10px] uppercase font-black tracking-[0.3em] text-emerald-950/20 shadow-none border-b border-emerald-950/5 pb-4">Choix du modèle</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {product.variants?.map(v => (
                        <button 
                          key={v.id}
                          onClick={() => setSelectedVariantId(v.id)}
                          className={`relative p-5 rounded-3xl border-2 transition-all text-left ${selectedVariantId === v.id ? 'border-[#C9A84C] bg-white shadow-xl shadow-amber-900/5' : 'border-emerald-950/5 bg-transparent hover:border-emerald-950/10'}`}
                        >
                          <div className="flex items-center gap-3 mb-3">
                             <div className="w-4 h-4 rounded-full border border-black/5" style={{ backgroundColor: v.color }} />
                             <span className={`text-xs font-black tracking-widest ${selectedVariantId === v.id ? 'text-emerald-950' : 'text-emerald-950/40'}`}>{v.size}</span>
                          </div>
                          <p className={`text-[10px] uppercase font-bold tracking-tight ${selectedVariantId === v.id ? 'text-[#C9A84C]' : 'text-emerald-950/20'}`}>
                             {v.color_name || v.color} — {v.shape}
                          </p>
                          {selectedVariantId === v.id && (
                             <div className="absolute top-4 right-4 text-[#C9A84C]">
                               <CheckCircle size={14} />
                             </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-8">
                    <h3 className="text-[10px] uppercase font-black tracking-[0.3em] text-emerald-950/20 border-b border-emerald-950/5 pb-4">Unités à commander</h3>
                    <div className="flex items-center gap-6">
                       <div className="flex items-center bg-white border border-emerald-950/5 rounded-2xl p-2 shadow-sm w-fit">
                          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-14 h-14 rounded-xl hover:bg-emerald-50 text-emerald-950 transition-colors flex items-center justify-center"><Minus size={20} /></button>
                          <span className="w-20 text-center font-serif text-2xl text-emerald-950">{quantity}</span>
                          <button onClick={() => setQuantity(quantity + 1)} className="w-14 h-14 rounded-xl hover:bg-emerald-50 text-emerald-950 transition-colors flex items-center justify-center"><Plus size={20} /></button>
                       </div>
                       <p className="text-[10px] font-bold text-emerald-950/30 uppercase tracking-widest">Stock: {selectedVariant?.stock_units || 0} pcs</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Total Display */}
            <div className="p-8 rounded-[2.5rem] bg-white border border-emerald-950/5 shadow-2xl shadow-emerald-950/5 mb-10 flex justify-between items-center group">
               <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-950/20 mb-2">Total de votre sélection</p>
                  <p className="font-serif text-4xl text-emerald-950">
                    {total.toLocaleString()} <span className="text-sm font-normal text-emerald-950/40 italic">DZD</span>
                  </p>
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-950/20 mb-1">Prix Unitaire</p>
                  <p className="text-sm font-bold text-[#C9A84C]">{unitPrice.toLocaleString()} DZD</p>
               </div>
            </div>

            {/* Add to Cart Button */}
            <button 
               onClick={handleAddToCart}
               disabled={added}
               className={`w-full py-6 rounded-2xl font-bold uppercase tracking-[0.3em] text-xs transition-all flex items-center justify-center gap-4 ${added ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' : 'bg-[#0a3d2e] text-white shadow-2xl shadow-emerald-900/40 hover:scale-[1.02] active:scale-95'}`}
            >
              {added ? (
                <>
                  <CheckCircle size={18} />
                  {isAr ? 'تمت الإضافة' : 'Produit ajouté'}
                </>
              ) : (
                <>
                  <ShoppingCart size={18} />
                  {isAr ? 'إضافة إلى السلة' : 'Ajouter au panier'}
                </>
              )}
            </button>

            {isPerfume && <p className="text-center mt-6 text-[10px] uppercase font-black tracking-widest text-[#C9A84C] flex items-center justify-center gap-2">
                <Info size={12} />
                {isAr ? 'تعبئة يدوية بوزن دقيق جداً' : 'Conditionnement manuel avec précision de pesée'}
            </p>}
          </div>
        </div>

        {/* Detailed Info Footer */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-t border-emerald-950/5 pt-16">
           <div>
              <h4 className="text-[10px] uppercase font-black tracking-widest text-emerald-950/20 mb-6">Maison / Collection</h4>
              <div className="space-y-4">
                <p className="text-sm font-bold text-emerald-950">{brand?.name_fr || 'Amouris Selection'}</p>
                <p className="text-xs text-emerald-950/40 italic">{collection?.name_fr || 'Collection Royale'}</p>
              </div>
           </div>
           <div>
              <h4 className="text-[10px] uppercase font-black tracking-widest text-emerald-950/20 mb-6">Univers</h4>
              <p className="text-sm font-bold text-emerald-950">{category?.name_fr || 'Inconnu'}</p>
           </div>
           <div>
              <h4 className="text-[10px] uppercase font-black tracking-widest text-emerald-950/20 mb-6">Signatures Olfactives</h4>
              <div className="flex flex-wrap gap-2">
                {productTags.map(tag => (
                   <span key={tag.id} className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-white border border-emerald-950/5 rounded-full text-emerald-900/60">
                      {isAr ? tag.name_ar : tag.name_fr}
                   </span>
                ))}
              </div>
           </div>
           <div>
              <h4 className="text-[10px] uppercase font-black tracking-widest text-emerald-950/20 mb-6">Service Client B2B</h4>
              <p className="text-xs text-emerald-950/60 leading-relaxed font-medium">Pour toute assistance personnalisée ou demande de gros volume, contactez notre équipe sur WhatsApp.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
