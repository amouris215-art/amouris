'use client'
import { ProductCard } from './product-card'
import { Product } from '@/store/products.store'

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
      {products.map((product, idx) => (
        <ProductCard key={product.id} product={product} index={idx} />
      ))}
      {products.length === 0 && (
        <div className="col-span-full py-24 text-center">
            <div className="text-emerald-950/20 font-serif text-2xl mb-2">Aucun produit trouvé</div>
            <p className="text-emerald-900/40 text-sm">Découvrez nos autres collections</p>
        </div>
      )}
    </div>
  )
}
