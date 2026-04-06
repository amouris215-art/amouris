"use client";

import { useI18n } from '@/i18n/i18n-context';
import { brands } from '@/lib/mock-data';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function BrandsPage() {
  const { language } = useI18n();

  return (
    <div className="min-h-screen bg-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center md:text-start">
          <h1 className="text-4xl md:text-5xl font-serif text-emerald-950 mb-4">
            {language === 'ar' ? 'العلامات المتاحة' : 'Marques Disponibles'}
          </h1>
          <p className="text-gray-600 max-w-2xl font-light text-lg">
            {language === 'ar' 
              ? 'نحن فخورون بتقديم أرقى العلامات التجارية العالمية في عالم الزيوت العطرية والروائح الشرقية.' 
              : 'Nous sommes fiers de proposer les marques internationales les plus prestigieuses dans l\'univers des huiles de parfum et des fragrances orientales.'}
          </p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {brands.map((brand, idx) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="group relative h-48 flex items-center justify-center border border-emerald-50 bg-neutral-50 hover:bg-white hover:border-emerald-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="text-center p-6 grayscale group-hover:grayscale-0 transition-all">
                <span className="text-4xl font-serif text-emerald-900 block mb-2">{brand.nameFR.charAt(0)}</span>
                <p className="text-lg font-serif tracking-widest text-emerald-950">
                  {language === 'ar' ? brand.nameAR : brand.nameFR}
                </p>
                <Link 
                  href={`/shop?brand=${brand.id}`}
                  className="mt-4 text-xs uppercase tracking-widest text-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {language === 'ar' ? 'استعراض المنتجات' : 'Voir les produits'}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
