'use client'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ProductCard } from './product-card'
import { useI18n } from '@/i18n/i18n-context'
import { motion } from 'framer-motion'
import { Tag, Product } from '@/lib/types'

interface TagSectionProps {
  tag: Tag
  products: Product[]
}

export function TagSection({ tag, products }: TagSectionProps) {
  const { language } = useI18n()

  const title = language === 'ar' ? tag.nameAR : tag.nameFR
  const subtitle = language === 'ar' ? tag.nameFR : tag.nameAR

  return (
    <section className="py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
        >
          <div className="relative">
            <div className="inline-block px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-black uppercase tracking-[0.2em] mb-3 rounded-full border border-amber-100">
                {tag.id.startsWith('tag-') ? tag.id.replace('tag-', '') : 'tag'}
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-emerald-950 flex flex-col md:flex-row md:items-baseline gap-4">
              <span>{title}</span>
              <span className="text-emerald-900/10 font-arabic text-3xl md:text-4xl" dir="rtl">{subtitle}</span>
            </h2>
            <div className="w-16 h-1 bg-amber-400 mt-6 rounded-full" />
          </div>
          
          <Link
            href={`/shop?tag=${tag.id}`}
            className="flex items-center gap-2 text-sm text-emerald-800 hover:text-emerald-600 font-bold group bg-emerald-50 px-6 py-3 rounded-xl transition-all hover:bg-emerald-100"
          >
            Voir tout {title}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Grid desktop */}
        <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {products.slice(0, 8).map((p, idx) => (
            <ProductCard key={p.id} product={p} index={idx} />
          ))}
        </div>

        {/* Scroll horizontal mobile */}
        <div className="sm:hidden flex gap-4 overflow-x-auto pb-8 -mx-4 px-4 snap-x snap-mandatory scroll-smooth no-scrollbar">
          {products.slice(0, 8).map(p => (
            <div key={p.id} className="snap-start flex-shrink-0 w-64">
              <ProductCard product={p} compact />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
