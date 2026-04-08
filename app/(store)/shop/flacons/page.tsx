'use client'
import { useProductsStore } from '@/store/products.store'
import { ProductGrid } from '@/components/store/ProductGrid'
import { useI18n } from '@/i18n/i18n-context'
import { motion } from 'framer-motion'

export default function FlaconsPage() {
  const { language } = useI18n()
  const flacons = useProductsStore(s => s.getActiveByType('flacon'))
  
  return (
    <div>
      <div className="bg-emerald-950 py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,119,6,0.05),transparent)]" />
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10"
        >
            <h1 className="text-white font-serif text-4xl md:text-6xl mb-4">
                {language === 'ar' ? 'قوارير زجاجية فاخرة' : 'Flacons de Luxe'}
            </h1>
            <div className="w-12 h-1 bg-amber-400 mx-auto rounded-full mb-6" />
            <p className="text-emerald-200/60 text-sm md:text-base uppercase tracking-widest font-medium">
                {flacons.length} {language === 'ar' ? 'نموذج متاح' : 'Modèles exclusifs'} — {language === 'ar' ? 'جودة بريميوم' : 'Qualité Premium'}
            </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <ProductGrid products={flacons} />
      </div>
    </div>
  )
}
