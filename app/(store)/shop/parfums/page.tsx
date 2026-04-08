import { mockProducts } from '@/lib/mock-data'
import { ProductGrid } from '@/components/store/ProductGrid'

export default function ParfumsPage() {
  const parfums = mockProducts.filter(p => p.product_type === 'perfume' && p.status === 'active')
  return (
    <div>
      <div className="bg-emerald-950 py-12 text-center">
        <h1 className="text-white font-serif text-3xl">Parfums & Huiles</h1>
        <p className="text-emerald-200/60 text-sm mt-2">
          {parfums.length} références disponibles — Commande minimum 100g
        </p>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <ProductGrid products={parfums} type="perfume" />
      </div>
    </div>
  )
}
