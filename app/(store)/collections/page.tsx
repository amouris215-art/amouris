"use client";

import { useI18n } from '@/i18n/i18n-context';
import { useCollectionsStore } from '@/store/collections.store';
import { getCollections } from '@/lib/actions/collections';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CollectionsPage() {
  const { language } = useI18n();
  const { collections, seed } = useCollectionsStore();
  const [loading, setLoading] = useState(collections.length === 0);

  useEffect(() => {
    async function load() {
      try {
        const data = await getCollections();
        // The store currently uses name_fr/name_ar in its interface, 
        // but the action returns nameFR/nameAR. We adapt here for the store seed.
        const adaptedData = data.map(c => ({
          id: c.id,
          name_fr: c.nameFR,
          name_ar: c.nameAR,
          description_fr: '',
          cover_image: c.coverImage || null
        }));
        seed(adaptedData);
      } catch (err) {
        console.error('Failed to load collections:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [seed]);

  if (loading && collections.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-900"></div>
      </div>
    );
  }

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
              <div 
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700 opacity-60" 
                style={{ backgroundImage: `url(${collection.cover_image || 'https://images.unsplash.com/photo-1546190255-451a91afc548?q=80&w=800'})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-transparent to-transparent opacity-80" />
              
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-2xl font-serif text-white mb-2">
                  {language === 'ar' ? collection.name_ar : collection.name_fr}
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
