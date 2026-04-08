import { ProductCard } from './ProductCard'

export function ProductGrid({ products, type }: { products: any[]; type: 'perfume' | 'flacon' }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
      {products.length === 0 && (
        <div className="col-span-full py-12 text-center text-gray-500">
          Aucun produit trouvé.
        </div>
      )}
    </div>
  )
}
