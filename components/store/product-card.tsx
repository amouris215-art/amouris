"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useI18n } from '@/i18n/i18n-context';
import { Product } from '@/lib/types';
import { tags as mockTags } from '@/lib/mock-data';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { t, language } = useI18n();
  
  const name = language === 'ar' ? product.nameAR : product.nameFR;
  const isPerfume = product.type === 'perfume';
  
  // Get the first tag's name if available
  const tag = mockTags.find(t => product.tagIds?.includes(t.id));
  const tagName = tag ? (language === 'ar' ? tag.nameAR : tag.nameFR) : null;

  const displayPrice = isPerfume 
    ? product.pricePerGram
    : Math.min(...(product.variants?.map(v => v.price) || [0]));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={`/product/${product.id}`} className="group block relative bg-white border border-neutral-100 hover:border-emerald-200 hover:shadow-2xl transition-all duration-500 rounded-none overflow-hidden h-full">
        {/* Image Container */}
        <div className="relative aspect-[4/5] bg-neutral-50 overflow-hidden">
          <Image 
            src={product.images[0] || 'https://images.unsplash.com/photo-1594035910387-fea477262dc0?q=80&w=800'} 
            alt={name} 
            fill 
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
          />
          
          {/* Tag badge */}
          {tagName && (
            <div className="absolute top-4 left-4 z-10">
              <span className={`text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 font-bold shadow-sm ${
                tag?.id === 't1' ? 'bg-emerald-800 text-white' : 
                tag?.id === 't2' ? 'bg-amber-400 text-emerald-950' : 
                'bg-rose-900 text-white'
              }`}>
                {tagName}
              </span>
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-emerald-950/0 group-hover:bg-emerald-950/20 transition-colors duration-500" />
          
          <div className="absolute bottom-6 left-0 right-0 flex justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
            <span className="bg-white text-emerald-950 text-xs uppercase tracking-[0.2em] px-8 py-3 font-bold shadow-xl border border-emerald-50">
              {t('common.view_details')}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-6 text-start">
          <p className="text-[10px] text-amber-600 uppercase tracking-[0.3em] mb-2 font-bold">
            {isPerfume ? (language === 'ar' ? 'عطر زيتي' : 'Huile de Parfum') : (language === 'ar' ? 'قارورة فاخرة' : 'Flaccon de Luxe')}
          </p>
          <h3 className="font-serif text-xl text-emerald-950 mb-3 line-clamp-1 group-hover:text-emerald-700 transition-colors">
            {name}
          </h3>
          <div className="flex items-center justify-between pt-4 border-t border-neutral-50">
            <p className="text-emerald-900 font-bold text-lg">
              {isPerfume ? `${displayPrice.toLocaleString()} DZD/g` : `Dès ${displayPrice.toLocaleString()} DZD`}
            </p>
            {!isPerfume && product.variants && (
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">{product.variants.length} {language === 'ar' ? 'أنواع' : 'Variantes'}</p>
            )}
            {isPerfume && (
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">Min. 100g</p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
