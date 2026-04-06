"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useI18n } from '@/i18n/i18n-context';
import { ProductCard } from '@/components/store/product-card';
import { Button } from '@/components/ui/button';
import { Product, Category, Brand } from '@/lib/types';

interface HomeClientProps {
  categories: Category[];
  brands: Brand[];
  announcements: any[];
  tagSections: {
    id: string;
    nameAR: string;
    nameFR: string;
    products: Product[];
  }[];
}

export default function HomeClient({ categories, brands, announcements, tagSections }: HomeClientProps) {
  const { t, language } = useI18n();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section - Emerald & Gold Luxury */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Fond gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-900 to-black" />
        
        {/* Décoration géométrique */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute right-[-100px] top-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-amber-400/20 rounded-full hidden lg:block" 
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 2.5 }}
          className="absolute right-[50px] top-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-amber-400/10 rounded-full hidden lg:block" 
        />
        
        {/* Contenu */}
        <div className="container relative z-10 mx-auto px-6 py-24 text-start">
          <div className="max-w-3xl">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-amber-400 text-sm tracking-[0.3em] uppercase mb-6 font-light"
            >
              Amouris Parfums
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-8xl font-serif text-white leading-tight mb-8"
            >
              {language === 'ar' ? (
                <>اكتشف<br /><span className="text-amber-400">جوهر</span><br />الفخامة</>
              ) : (
                <>Découvrez<br /><span className="text-amber-400">l'Essence</span><br />du Luxe</>
              )}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-emerald-200/80 text-lg md:text-xl mb-10 font-light leading-relaxed max-w-xl"
            >
              {t('home.hero_subtitle')}
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/shop" className="bg-amber-400 text-emerald-950 px-10 py-5 font-medium hover:bg-amber-300 transition-all duration-300 rounded-none shadow-lg hover:shadow-amber-400/20 active:scale-95">
                {t('home.shop_now')}
              </Link>
              <Link href="/register" className="border border-white/30 text-white px-10 py-5 font-light hover:border-white/60 hover:bg-white/5 transition-all duration-300 rounded-none active:scale-95">
                {t('nav.register')}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Announcements */}
      {announcements && announcements.length > 0 && (
        <div className="bg-emerald-800 text-emerald-50 py-3 text-center text-sm font-light tracking-widest uppercase">
          {language === 'ar' ? announcements[0].textAR : announcements[0].textFR}
        </div>
      )}

      {/* Brands Ribbon */}
      <section className="bg-white py-12 border-b border-neutral-100 overflow-hidden relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 items-center grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            {brands.map((brand) => (
              <span key={brand.id} className="text-xl md:text-2xl font-serif text-emerald-950 tracking-tighter">
                {language === 'ar' ? brand.nameAR : brand.nameFR}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Tag Sections */}
      {tagSections.map((section, sIndex) => (
        <section key={section.id} className={`py-24 ${sIndex % 2 === 0 ? 'bg-neutral-50' : 'bg-white'}`}>
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center mb-16"
            >
              <span className="text-amber-500 text-xs tracking-[0.2em] uppercase mb-4">{section.id === 't1' ? 'Nouveautés' : section.id === 't2' ? 'Les Préférés' : 'Excellence'}</span>
              <h2 className="text-3xl md:text-5xl font-serif text-emerald-950 mb-6">
                {language === 'ar' ? section.nameAR : section.nameFR}
              </h2>
              <div className="w-16 h-[1px] bg-amber-400" />
            </motion.div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {section.products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </motion.div>

            {section.products.length === 0 && (
              <div className="text-center py-20 bg-neutral-50 border border-dashed border-neutral-200">
                <p className="text-gray-400 font-light italic">
                  {t('common.no_products_found')}
                </p>
              </div>
            )}
          </div>
        </section>
      ))}

      {/* Categories Banner with Gradient Styles */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category, i) => {
              const bgGradients = [
                'from-amber-950 to-amber-900',
                'from-rose-950 to-rose-900',
                'from-emerald-950 to-emerald-900',
                'from-sky-950 to-sky-900',
                'from-stone-800 to-stone-900',
              ];
              const gradient = bgGradients[i % bgGradients.length];
              
              return (
                <motion.div 
                  key={category.id} 
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                >
                  <Link href={`/shop?category=${category.id}`} className="group block relative h-64 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-transform duration-500 group-hover:scale-105`} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 border border-white/5 group-hover:border-white/20 transition-all duration-500">
                      <span className="text-white/40 text-xs tracking-[0.3em] uppercase mb-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">Explorer</span>
                      <h3 className="text-xl font-serif text-white group-hover:text-amber-400 transition-colors">
                        {language === 'ar' ? category.nameAR : category.nameFR}
                      </h3>
                      <div className="mt-4 w-8 h-[1px] bg-amber-400/50 group-hover:w-16 transition-all duration-500" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>

  );
}
