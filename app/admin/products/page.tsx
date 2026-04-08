'use client'
import { useState } from 'react'
import { mockProducts, mockCategories, mockBrands } from '@/lib/mock-data'
import { Plus, Search, Edit2, Trash2, Package } from 'lucide-react'

export default function AdminProductsPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'perfume' | 'flacon'>('all')

  const filtered = mockProducts.filter(p => {
    const matchSearch = p.name_fr.toLowerCase().includes(search.toLowerCase()) ||
                       p.name_ar.includes(search)
    const matchType = typeFilter === 'all' || p.product_type === typeFilter
    return matchSearch && matchType
  })

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Produits</h1>
        <button className="flex items-center gap-2 bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors">
          <Plus size={16} /> Ajouter un produit
        </button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-400"
          />
        </div>
        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
          {(['all', 'perfume', 'flacon'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${typeFilter === t ? 'bg-emerald-700 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {t === 'all' ? 'Tous' : t === 'perfume' ? 'Parfums' : 'Flacons'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Produit</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Type</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Catégorie</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Prix</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Stock</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(product => {
              const cat = mockCategories.find(c => c.id === product.category_id)
              return (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-50 to-amber-50 flex items-center justify-center flex-shrink-0">
                        <Package size={16} className="text-emerald-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{product.name_fr}</div>
                        <div className="text-gray-400 text-xs" dir="rtl">{product.name_ar}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${product.product_type === 'perfume' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {product.product_type === 'perfume' ? 'Parfum' : 'Flacon'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{cat?.name_fr || '—'}</td>
                  <td className="px-4 py-3 text-gray-900 font-medium">
                    {product.product_type === 'perfume'
                      ? `${product.price_per_gram?.toLocaleString()} DZD/g`
                      : `Dès ${product.base_price?.toLocaleString()} DZD`}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {product.product_type === 'perfume'
                      ? `${product.stock_grams?.toLocaleString()}g`
                      : `${product.variants?.length || 0} variantes`}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors">
                        <Edit2 size={15} />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">Aucun produit trouvé</div>
        )}
      </div>
    </div>
  )
}
