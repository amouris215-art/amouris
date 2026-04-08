import Link from 'next/link'

const CATEGORY_GRADIENTS: Record<string, string> = {
  'cat-01': 'from-amber-900/20 to-amber-800/10',  // Oud
  'cat-02': 'from-rose-900/20 to-pink-800/10',    // Floral
  'cat-03': 'from-emerald-900/20 to-teal-800/10', // Oriental
  'cat-04': 'from-sky-900/20 to-blue-800/10',     // Frais
  'cat-05': 'from-stone-800/20 to-stone-700/10',  // Boisé
  'cat-06': 'from-purple-900/20 to-purple-800/10',// Musqué
  'cat-07': 'from-orange-900/20 to-red-800/10',   // Épicé
  'cat-08': 'from-yellow-900/20 to-yellow-800/10',// Citrus
  'cat-09': 'from-cyan-900/20 to-cyan-800/10',    // Aquatique
  'cat-10': 'from-amber-800/20 to-orange-700/10', // Ambré
}

export function ProductCard({ product, compact = false }: { product: any; compact?: boolean }) {
  const isFlacon = product.product_type === 'flacon'
  const displayPrice = isFlacon
    ? (product.variants?.length > 0
        ? Math.min(...product.variants.map((v: any) => v.price))
        : product.base_price)
    : product.price_per_gram

  const gradient = CATEGORY_GRADIENTS[product.category_id] || 'from-emerald-900/20 to-emerald-800/10'

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:border-emerald-200 hover:shadow-md transition-all duration-300">
        {/* Image */}
        <div className={`relative bg-gradient-to-br ${gradient} ${compact ? 'aspect-square' : 'aspect-[4/5]'} overflow-hidden`}>
          {/* Icone centrale */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white/10 font-serif text-7xl select-none">A</div>
          </div>
          {/* Badge type */}
          <div className="absolute top-2.5 left-2.5">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              isFlacon ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
            }`}>
              {isFlacon ? 'Flacon' : 'Parfum'}
            </span>
          </div>
          {/* Overlay hover */}
          <div className="absolute inset-0 bg-emerald-950/0 group-hover:bg-emerald-950/10 transition-colors duration-300" />
        </div>

        {/* Info */}
        <div className={`${compact ? 'p-2.5' : 'p-4'}`}>
          <h3 className={`font-medium text-gray-900 truncate ${compact ? 'text-sm' : 'text-base'} mb-1`}>
            {product.name_fr}
          </h3>
          <p className="text-xs text-gray-400 truncate mb-2" dir="rtl">
            {product.name_ar}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-emerald-800 font-semibold text-sm">
              {isFlacon
                ? `Dès ${displayPrice?.toLocaleString()} DZD`
                : `${displayPrice?.toLocaleString()} DZD/g`}
            </span>
            {!compact && (
              <span className="text-xs text-gray-400">
                {isFlacon ? `${product.variants?.length || 0} variantes` : 'Min. 100g'}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
