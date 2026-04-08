'use client'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ProductCard } from './ProductCard'

export function TagSection({ tag, products }: { tag: any; products: any[] }) {
  // Déterminer la locale depuis le contexte i18n
  // Par défaut : afficher fr

  return (
    <section className="py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-serif text-3xl text-gray-900">{tag.name_fr}</h2>
            <div className="w-10 h-0.5 bg-amber-400 mt-2" />
          </div>
          <Link
            href={`/shop?tag=${tag.slug}`}
            className="flex items-center gap-1.5 text-sm text-emerald-700 hover:text-emerald-900 font-medium group"
          >
            Voir tout
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid desktop */}
        <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.slice(0, 8).map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {/* Scroll horizontal mobile */}
        <div className="sm:hidden flex gap-3 overflow-x-auto pb-3 -mx-4 px-4 snap-x snap-mandatory scroll-smooth">
          {products.slice(0, 8).map(p => (
            <div key={p.id} className="snap-start flex-shrink-0 w-44">
              <ProductCard product={p} compact />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
