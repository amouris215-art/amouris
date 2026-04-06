"use client";

import { useI18n } from '@/i18n/i18n-context';
import { collections } from '@/lib/mock-data';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CollectionsPage() {
  const { language } = useI18n();

  return (
    <div className="min-h-screen bg-neutral-50 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center md:text-start">
          <h1 className="text-4xl md:text-5xl font-serif text-emerald-950 mb-4">
            {language === 'ar' ? 'مجموعاتنا الحصرية' : 'Nos Collections Exclusives'}
          </h1>
          <p className="text-gray-600 max-w-2xl font-light text-lg">
            {language === 'ar' 
              ? 'تصفح مجموعاتنا المنسقة بعناية لتجد الروائح التي تناسب ذوق عملائك.' 
              : 'Explorez nos collections soigneusement sélectionnées pour trouver les fragrances qui correspondent aux goûts de vos clients.'}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {collections.map((collection, idx) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group relative h-[400px] bg-emerald-900 overflow-hidden shadow-lg"
            >
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1546190255-451a91afc548?q=80&w=800')] bg-cover bg-center group-hover:scale-110 transition-transform duration-700 opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-transparent to-transparent opacity-80" />
              
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-2xl font-serif text-white mb-2">
                  {language === 'ar' ? collection.nameAR : collection.nameFR}
                </h3>
                <p className="text-emerald-100/70 text-sm font-light mb-6">
                  {language === 'ar' ? 'اكتشف عبير الأصالة' : 'Découvrez l\'essence de l\'authenticité'}
                </p>
                <Link 
                  href={`/shop?collection=${collection.id}`}
                  className="inline-block border border-amber-400 text-amber-400 px-6 py-2 text-sm uppercase tracking-widest hover:bg-amber-400 hover:text-emerald-950 transition-colors"
                >
                  {language === 'ar' ? 'استكشاف' : 'Découvrir'}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
