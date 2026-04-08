'use client'
import { useState, useEffect, useMemo } from 'react'
import { getProducts } from '@/lib/actions/products'
import { ProductGrid } from '@/components/store/ProductGrid'
import { useI18n } from '@/i18n/i18n-context'
import { motion } from 'framer-motion'
import { Product } from '@/lib/types'

export default function ParfumsPage() {
  const { language } = useI18n()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts({ type: 'perfume', status: 'active' })
        setProducts(data)
      } catch (error) {
        console.error('Failed to fetch perfumes:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadProducts()
  }, [])
  
  return (
    <div>
      <div className="bg-emerald-950 py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1),transparent)]" />
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10"
        >
            <h1 className="text-white font-serif text-4xl md:text-6xl mb-4">
                {language === 'ar' ? 'العطور والزيوت الأساسية' : 'Huiles de Parfums'}
            </h1>
            <div className="w-12 h-1 bg-amber-400 mx-auto rounded-full mb-6" />
            <p className="text-emerald-200/60 text-sm md:text-base uppercase tracking-widest font-medium">
                {isLoading ? '...' : products.length} {language === 'ar' ? 'مرجع متاح' : 'Références disponibles'} — {language === 'ar' ? 'الحد الأدنى للطلب 100 جم' : 'Min. 100g'}
            </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-900"></div>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  )
}
