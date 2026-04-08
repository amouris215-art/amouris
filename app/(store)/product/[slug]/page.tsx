'use client'
import { useParams, notFound } from 'next/navigation'
import { useState, useEffect } from 'react'
import { getProductBySlug } from '@/lib/actions/products'
import { getCategories } from '@/lib/actions/categories'
import { getBrands } from '@/lib/actions/brands'
import { useCartStore } from '@/store/cart-store'
import { Product, Category, Brand, FlaconVariant } from '@/lib/types'
import { useI18n } from '@/i18n/i18n-context'

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const { t, language } = useI18n()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const addToCart = useCartStore(s => s.addItem)

  const [selectedVariant, setSelectedVariant] = useState<FlaconVariant | null>(null)
  const [grams, setGrams] = useState(100)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    async function loadData() {
      if (!slug) return
      try {
        const [p, c, b] = await Promise.all([
          getProductBySlug(slug),
          getCategories(),
          getBrands()
        ])
        
        if (p) {
          setProduct(p)
          if (p.type === 'flacon' && p.variants?.length > 0) {
            setSelectedVariant(p.variants[0])
          }
        }
        setCategories(c)
        setBrands(b)
      } catch (error) {
        console.error('Failed to load product details:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [slug])

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-900"></div>
      </div>
    )
  }

  if (!product) {
    notFound()
    return null
  }

  const category = categories.find(c => c.id === product.categoryId)
  const brand = brands.find(b => b.id === product.brandId)
  const isPerfume = product.type === 'perfume'

  const totalPrice = isPerfume
    ? (product.pricePerGram || 0) * grams
    : (selectedVariant?.price || 0) * quantity

  function handleAddToCart() {
    if (!product) return
    
    addToCart({
      id: Math.random().toString(36).substr(2, 9), // Local cart item ID
      productId: product.id,
      type: product.type,
      nameFR: product.nameFR,
      nameAR: product.nameAR,
      slug: product.slug,
      variantId: selectedVariant?.id,
      variantLabel: selectedVariant ? `${selectedVariant.size} — ${selectedVariant.color}` : undefined,
      unitPrice: isPerfume ? product.pricePerGram! : selectedVariant!.price,
      quantity: isPerfume ? grams : quantity,
      total: totalPrice,
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image */}
        <div className="aspect-square bg-gradient-to-br from-emerald-50 to-amber-50 rounded-2xl flex items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="text-emerald-950/10 font-serif text-[12rem] select-none">
            {product.nameFR.charAt(0)}
          </span>
          <div className="absolute bottom-6 right-6">
            <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-sm">
                <span className="text-xs font-medium text-emerald-900 uppercase tracking-widest">{product.type}</span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="mb-8">
            {brand && <p className="text-amber-700 text-sm uppercase tracking-widest mb-3 font-medium">{brand.nameFR}</p>}
            <h1 className="font-serif text-4xl text-emerald-950 mb-2 leading-tight">
              {language === 'ar' ? product.nameAR : product.nameFR}
            </h1>
            <p className="text-emerald-900/40 text-2xl font-arabic mb-4" dir="rtl">
              {language === 'ar' ? product.nameFR : product.nameAR}
            </p>
            <div className="flex items-center gap-3">
                {category && <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium">{language === 'ar' ? category.nameAR : category.nameFR}</span>}
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${product.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                    {product.status === 'active' ? (language === 'ar' ? 'متوفر' : 'En Stock') : (language === 'ar' ? 'غير متوفر' : 'Épuisé')}
                </span>
            </div>
          </div>

          <div className="prose prose-emerald mb-10">
            <p className="text-emerald-900/70 text-lg leading-relaxed">{language === 'ar' ? product.descriptionAR : product.descriptionFR}</p>
          </div>

          <div className="h-px bg-emerald-100 mb-10 w-full" />

          {/* Configuration */}
          <div className="space-y-8 mb-10">
            {isPerfume && (
              <div>
                <label className="block text-sm font-semibold text-emerald-950 mb-4 flex justify-between items-center">
                  <span>{language === 'ar' ? 'الكمية المطلوبة' : 'Quantité souhaitée'}</span>
                  <span className="text-xs font-normal text-emerald-900/50">Min. 100g — Max. {product.stockInGrams?.toLocaleString()}g</span>
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 border-2 border-emerald-100 rounded-xl p-1 bg-white">
                    <button onClick={() => setGrams(Math.max(100, grams - 50))}
                      className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-lg flex items-center justify-center text-2xl hover:bg-emerald-100 transition-colors">−</button>
                    <input type="number" min={100} max={product.stockInGrams} step={50}
                      value={grams} onChange={e => setGrams(Math.max(100, Math.min(product.stockInGrams!, +e.target.value)))}
                      className="w-24 text-center font-bold text-lg text-emerald-950 focus:outline-none" />
                    <button onClick={() => setGrams(Math.min(product.stockInGrams!, grams + 50))}
                      className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-lg flex items-center justify-center text-2xl hover:bg-emerald-100 transition-colors">+</button>
                  </div>
                  <span className="text-emerald-900/50 font-medium">{language === 'ar' ? 'جرام' : 'grammes'}</span>
                </div>
                <div className="mt-6 p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-xs text-emerald-900/50 uppercase tracking-widest mb-1">{language === 'ar' ? 'السعر الإجمالي' : 'Prix total'}</p>
                            <p className="text-emerald-900 font-bold text-3xl">
                                {totalPrice.toLocaleString()} <span className="text-sm font-normal">DZD</span>
                            </p>
                        </div>
                        <p className="text-xs text-emerald-900/50">
                            {product.pricePerGram?.toLocaleString()} DZD / gramme
                        </p>
                    </div>
                </div>
              </div>
            )}

            {!isPerfume && product.variants && (
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-semibold text-emerald-950 mb-4">{language === 'ar' ? 'اختر الموديل' : 'Sélectionner un modèle'}</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {product.variants.map(v => (
                      <button key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`group p-3 border-2 rounded-xl text-left transition-all relative overflow-hidden ${selectedVariant?.id === v.id ? 'border-amber-500 bg-amber-50/30' : 'border-emerald-50 hover:border-emerald-200'}`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-4 h-4 rounded-full border border-black/5" style={{ backgroundColor: v.color }} />
                            <span className={`text-xs font-bold leading-none ${selectedVariant?.id === v.id ? 'text-amber-900' : 'text-emerald-900'}`}>{v.size}</span>
                        </div>
                        <p className={`text-[10px] uppercase tracking-tighter leading-none ${selectedVariant?.id === v.id ? 'text-amber-800/60' : 'text-emerald-900/40'}`}>
                            {v.color} — {v.shape}
                        </p>
                        {selectedVariant?.id === v.id && (
                            <div className="absolute top-0 right-0 p-1 bg-amber-500 text-white rounded-bl-lg">
                                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                {selectedVariant && (
                  <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-emerald-950 mb-4 flex justify-between items-center">
                            <span>{language === 'ar' ? 'الكمية' : 'Quantité'}</span>
                            <span className="text-xs font-normal text-emerald-900/50">Stock: {selectedVariant.stock} unités</span>
                        </label>
                        <div className="flex items-center gap-2 border-2 border-emerald-100 rounded-xl p-1 bg-white w-fit">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-lg flex items-center justify-center text-2xl hover:bg-emerald-100 transition-colors">−</button>
                            <span className="w-16 text-center font-bold text-lg text-emerald-950">{quantity}</span>
                            <button onClick={() => setQuantity(Math.min(selectedVariant.stock, quantity + 1))}
                            className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-lg flex items-center justify-center text-2xl hover:bg-emerald-100 transition-colors">+</button>
                        </div>
                    </div>

                    <div className="p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-xs text-emerald-900/50 uppercase tracking-widest mb-1">{language === 'ar' ? 'السعر الإجمالي' : 'Prix total'}</p>
                                <p className="text-emerald-900 font-bold text-3xl">
                                    {totalPrice.toLocaleString()} <span className="text-sm font-normal">DZD</span>
                                </p>
                            </div>
                            <p className="text-xs text-emerald-900/50">
                                {selectedVariant.price.toLocaleString()} DZD / unité
                            </p>
                        </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => {
                handleAddToCart();
            }}
            disabled={!isPerfume && !selectedVariant}
            className="w-full bg-emerald-900 text-white py-6 rounded-2xl font-bold text-lg hover:bg-emerald-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xl shadow-emerald-900/10 active:scale-[0.98]"
          >
            {language === 'ar' ? 'إضافة إلى السلة' : 'Ajouter au panier'}
            <span className="mx-3 opacity-30">|</span>
            {totalPrice.toLocaleString()} DZD
          </button>

          <p className="text-center mt-6 text-emerald-950/40 text-xs font-medium uppercase tracking-[0.2em]">
            {language === 'ar' ? 'الدفع عند الاستلام في جميع أنحاء الجزائر' : "Paiement à la livraison dans toute l'Algérie"}
          </p>
        </div>
      </div>
    </div>
  )
}
