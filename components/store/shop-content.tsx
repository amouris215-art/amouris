"use client";

import { useState, useMemo } from 'react';
import { useI18n } from '@/i18n/i18n-context';
import { ProductCard } from '@/components/store/product-card';
import { motion, AnimatePresence } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Product, Category, Brand } from '@/lib/types';
import { useSearchParams } from 'next/navigation';

interface ShopContentProps {
  initialProducts: Product[];
  categories: Category[];
  brands: Brand[];
  initialType?: 'all' | 'perfume' | 'flacon';
}

export function ShopContent({ initialProducts, categories, brands, initialType }: ShopContentProps) {
  const { t, language } = useI18n();
  const searchParams = useSearchParams();
  
  const [selectedType, setSelectedType] = useState<'all' | 'perfume' | 'flacon'>(
    (searchParams.get('type') as any) || initialType || 'all'
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('category') || 'all'
  );
  const [selectedBrand, setSelectedBrand] = useState<string>(
    searchParams.get('brand') || 'all'
  );
  const [selectedTag, setSelectedTag] = useState<string>(
    searchParams.get('tag') || 'all'
  );
  
  // Filtering logic
  const filteredProducts = useMemo(() => {
    return initialProducts.filter(p => {
      if (selectedType !== 'all' && p.product_type !== selectedType) return false;
      if (selectedCategory !== 'all' && p.category_id !== selectedCategory) return false;
      if (selectedBrand !== 'all' && p.brand_id !== selectedBrand) return false;
      if (selectedTag !== 'all' && !p.tag_ids?.includes(selectedTag)) return false;
      return true;
    });
  }, [initialProducts, selectedType, selectedCategory, selectedBrand, selectedTag]);

  const heroConfig = {
    all: {
      titleFR: "La Boutique Amouris",
      titleAR: "بوتيك أموريس",
      descFR: "Découvrez l'intégralité de nos collections d'exception.",
      descAR: "اكتشف مجموعاتنا الكاملة والمميزة.",
      bg: "bg-[#0a3d2e]",
      accent: "text-amber-400"
    },
    perfume: {
      titleFR: "Huiles de Parfums",
      titleAR: "زيوت عطرية",
      descFR: "L'essence de l'élégance capturée dans nos huiles les plus pures.",
      descAR: "جوهر الأناقة المحفوف في أنقى زيوتنا العطرية.",
      bg: "bg-[#0a3d2e]",
      accent: "text-emerald-300"
    },
    flacon: {
      titleFR: "Flacons & Packaging",
      titleAR: "قوارير وتغليف",
      descFR: "Des écrins de verre sculptés pour préserver vos fragrances.",
      descAR: "صناديق زجاجية منحوتة للحفاظ على عطورك.",
      bg: "bg-[#1a202c]",
      accent: "text-amber-500"
    }
  };

  const currentHero = heroConfig[selectedType];

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50/50">
      {/* Premium Hero Banner */}
      <section className={`relative py-24 overflow-hidden ${currentHero.bg} transition-colors duration-1000`}>
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-30" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 opacity-20" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
           <motion.div
             key={selectedType}
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
           >
              <span className={`text-[10px] uppercase tracking-[0.4em] font-black mb-6 block ${currentHero.accent}`}>
                Amouris L'Excellence
              </span>
              <h1 className="font-serif text-5xl md:text-7xl text-white mb-8 tracking-tight">
                {language === 'ar' ? currentHero.titleAR : currentHero.titleFR}
              </h1>
              <p className="text-white/40 font-light text-sm md:text-xl max-w-2xl mx-auto leading-relaxed italic">
                {language === 'ar' ? currentHero.descAR : currentHero.descFR}
              </p>
           </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-20">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Redesigned Sidebar Filters - Premium Minimalist */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="sticky top-32 space-y-16">
              
              {/* Filter Group: Category */}
              <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-emerald-950/5 pb-4">
                  <h3 className="text-[10px] uppercase font-black tracking-[0.3em] text-emerald-950/20">
                    {language === 'ar' ? 'الفئات' : 'Collection'}
                  </h3>
                </div>
                <div className="flex flex-col gap-2">
                  <FilterChip 
                    label={language === 'ar' ? 'جميع الفئات' : 'Toutes les catégories'} 
                    active={selectedCategory === 'all'} 
                    onClick={() => setSelectedCategory('all')} 
                  />
                  {categories.map(cat => (
                    <FilterChip 
                      key={cat.id}
                      label={language === 'ar' ? cat.name_ar : cat.name_fr} 
                      active={selectedCategory === cat.id} 
                      onClick={() => setSelectedCategory(cat.id)} 
                    />
                  ))}
                </div>
              </div>

              {/* Filter Group: Brands */}
              <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-emerald-950/5 pb-4">
                  <h3 className="text-[10px] uppercase font-black tracking-[0.3em] text-emerald-950/20">
                    {language === 'ar' ? 'العلامات التجارية' : 'Maisons'}
                  </h3>
                </div>
                <div className="flex flex-col gap-2">
                  <FilterChip 
                    label={language === 'ar' ? 'جميع الماركات' : 'Toutes les marques'} 
                    active={selectedBrand === 'all'} 
                    onClick={() => setSelectedBrand('all')} 
                  />
                  {brands.map(brand => (
                    <FilterChip 
                      key={brand.id}
                      label={language === 'ar' ? brand.name_ar : brand.name_fr} 
                      active={selectedBrand === brand.id} 
                      onClick={() => setSelectedBrand(brand.id)} 
                    />
                  ))}
                </div>
              </div>

              {/* Filter Group: Type */}
              <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-emerald-950/5 pb-4">
                  <h3 className="text-[10px] uppercase font-black tracking-[0.3em] text-emerald-950/20">
                    {language === 'ar' ? 'النوع' : 'Univers'}
                  </h3>
                </div>
                <div className="flex flex-col gap-2">
                  {(['all', 'perfume', 'flacon'] as const).map(type => (
                    <FilterChip 
                      key={type}
                      label={
                        type === 'all' ? (language === 'ar' ? 'الكل' : 'Tout l\'univers') : 
                        type === 'perfume' ? (language === 'ar' ? 'زيوت عطرية' : 'Huiles de Parfums') : 
                        (language === 'ar' ? 'قوارير وتغليف' : 'Flacons & Packaging')
                      } 
                      active={selectedType === type} 
                      onClick={() => setSelectedType(type)} 
                    />
                  ))}
                </div>
              </div>

            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-16 gap-8">
              <div>
                <h2 className="text-3xl font-serif text-emerald-950 mb-2">
                  {filteredProducts.length} {language === 'ar' ? 'منتج متاح' : 'Créations disponibles'}
                </h2>
                <div className="h-0.5 w-12 bg-[#C9A84C]" />
              </div>
              
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <Select>
                  <SelectTrigger className="w-full sm:w-[260px] border-emerald-950/5 bg-white h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm">
                    <SelectValue placeholder={language === 'ar' ? 'ترتيب حسب' : 'Trier par rayonnement'} />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-emerald-950/5">
                    <SelectItem value="newest" className="text-[10px] font-black uppercase tracking-widest py-3">Nouveautés</SelectItem>
                    <SelectItem value="price-asc" className="text-[10px] font-black uppercase tracking-widest py-3">Prix croissant</SelectItem>
                    <SelectItem value="price-desc" className="text-[10px] font-black uppercase tracking-widest py-3">Prix décroissant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10"
            >
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product, i) => (
                  <motion.div
                    layout
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-40 bg-white border border-dashed border-emerald-950/10 rounded-[3rem]">
                <div className="mb-8 text-emerald-950/5">
                  <svg className="w-24 h-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="font-serif text-2xl text-emerald-950/20 italic mb-2">
                  Aucun trésor ne correspond à votre recherche.
                </h3>
                <p className="font-arabic text-emerald-950/10 text-xl" dir="rtl">لا توجد منتجات تطابق بحثكم.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-start px-6 py-5 rounded-[1.2rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-700 border flex items-center justify-between group ${
        active 
          ? 'bg-[#0a3d2e] text-white border-[#0a3d2e] shadow-2xl shadow-emerald-900/20' 
          : 'bg-white text-emerald-950/30 border-emerald-950/5 hover:border-[#C9A84C] hover:text-emerald-950'
      }`}
    >
      <span>{label}</span>
      {active && <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />}
    </button>
  );
}
