'use client'

import { useProductsStore } from '@/store/products.store'
import { useI18n } from '@/i18n/i18n-context'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Waves, Box, Pipette } from 'lucide-react'

export default function ShopPage() {
  const { language } = useI18n()
  const products = useProductsStore(s => s.products)
  
  const perfumeCount = products.filter(p => p.status === 'active' && p.product_type === 'perfume').length
  const flaconCount = products.filter(p => p.status === 'active' && p.product_type === 'flacon').length
  const accessoryCount = products.filter(p => p.status === 'active' && p.product_type === 'accessory').length

  const isAr = language === 'ar'

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-emerald-950 mb-4 tracking-tight">
            {isAr ? 'المتجر الإلكتروني' : 'Boutique Amouris'}
          </h1>
          <p className="text-emerald-900/40 uppercase tracking-[0.3em] text-xs font-black">
            {isAr ? 'روائح فاخرة وعبوات استثنائية' : 'Huiles précieuses & Flacons d’exception'}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Parfums Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-emerald-900/10"
          >
            <div className="absolute inset-0 bg-[#0a3d2e]" />
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-transparent" />
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 group-hover:scale-110 transition-transform duration-1000">
              <Waves size={400} strokeWidth={0.5} className="text-white" />
            </div>

            <div className="absolute inset-0 p-10 flex flex-col justify-end">
              <div className="mb-6">
                <span className="bg-emerald-400/20 text-emerald-300 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md border border-emerald-400/20">
                  {perfumeCount} {isAr ? 'مرجع متاح' : 'références disponibles'}
                </span>
              </div>
              <h2 className="text-3xl font-serif text-white mb-4">
                {isAr ? 'العطور والزيوت' : 'Parfums & Huiles'}
              </h2>
              <p className="text-emerald-100/60 font-light mb-8 text-sm">
                {isAr 
                  ? 'اكتشف مجموعتنا من الزيوت العطرية النقية والمستوردة. الحد أدنى للطلب 100 جرام.' 
                  : 'Découvrez notre collection d’huiles de parfum pures et importées. Commande min. 100g.'}
              </p>
              <Link 
                href="/shop/parfums"
                className="inline-flex items-center gap-3 bg-[#C9A84C] text-emerald-950 px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-amber-400 transition-all w-fit active:scale-95 group/btn"
              >
                {isAr ? 'عرض المجموعة' : 'Voir les parfums'}
                <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Flacons Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="group relative h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/5"
          >
            <div className="absolute inset-0 bg-[#1a202c]" />
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 to-transparent" />
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 group-hover:scale-110 transition-transform duration-1000">
              <Box size={400} strokeWidth={0.5} className="text-amber-400" />
            </div>

            <div className="absolute inset-0 p-10 flex flex-col justify-end">
              <div className="mb-6">
                <span className="bg-amber-400/20 text-amber-300 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md border border-amber-400/20">
                  {flaconCount} {isAr ? 'موديلات متنوعة' : 'modèles disponibles'}
                </span>
              </div>
              <h2 className="text-3xl font-serif text-white mb-4">
                {isAr ? 'القوارير والعبوات' : 'Flacons & Vides'}
              </h2>
              <p className="text-gray-400 font-light mb-8 text-sm">
                {isAr 
                  ? 'تشكيلة واسعة من القوارير الزجاجية الفاخرة بمختلف الأحجام والألوان.' 
                  : 'Une gamme de flacons en verre premium disponible en plusieurs tailles et coloris.'}
              </p>
              <Link 
                href="/shop/flacons"
                className="inline-flex items-center gap-3 bg-white text-emerald-950 px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-100 transition-all w-fit active:scale-95 group/btn"
              >
                {isAr ? 'عرض القوارير' : 'Voir les flacons'}
                <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Accessory Card (Feature 7.2) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="group relative h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-rose-950/10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#3d1a1a] to-[#2d1515]" />
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 to-transparent" />
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 group-hover:scale-110 transition-transform duration-1000">
              <Pipette size={400} strokeWidth={0.5} className="text-orange-300" />
            </div>

            <div className="absolute inset-0 p-10 flex flex-col justify-end">
              <div className="mb-6">
                <span className="bg-orange-400/20 text-orange-200 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md border border-orange-400/20">
                  {accessoryCount} {isAr ? 'مرجع متاح' : 'références disponibles'}
                </span>
              </div>
              <h2 className="text-3xl font-serif text-white mb-4">
                {isAr ? 'إكسسوارات وأدوات' : 'Accessoires & Outils'}
              </h2>
              <p className="text-orange-100/40 font-light mb-8 text-sm">
                {isAr 
                  ? 'سرنجات، قطارات، بخاخات وكل ما تحتاجه لتعبئة وتغليف عطورك.' 
                  : 'Seringues, pipettes, atomiseurs et tout le nécessaire pour conditionner vos fragrances.'}
              </p>
              <Link 
                href="/shop/accessoires"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-400 to-amber-600 text-white px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all w-fit active:scale-95 group/btn border border-orange-300/20"
              >
                {isAr ? 'مشاهدة المزيد' : 'Voir les accessoires'}
                <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Info Bar */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-emerald-100 pt-16">
          <div className="text-center md:text-left">
            <h4 className="text-emerald-950 font-serif text-lg mb-2">{isAr ? 'جودة فاخرة' : 'Qualité Premium'}</h4>
            <p className="text-emerald-900/40 text-sm leading-relaxed">
              {isAr ? 'زيوت أصلية مختارة بعناية من أفضل المصادر العالمية.' : 'Des huiles authentiques sélectionnées auprès des meilleurs producteurs.'}
            </p>
          </div>
          <div className="text-center md:text-left">
            <h4 className="text-emerald-950 font-serif text-lg mb-2">{isAr ? 'توصيل سريع' : 'Livraison Rapide'}</h4>
            <p className="text-emerald-900/40 text-sm leading-relaxed">
              {isAr ? 'نقوم بالتوصيل إلى جميع ولايات الوطن في وقت قياسي.' : 'Nous livrons dans toutes les wilayas d’Algérie en temps record.'}
            </p>
          </div>
          <div className="text-center md:text-left">
            <h4 className="text-emerald-950 font-serif text-lg mb-2">{isAr ? 'خدمة B2B' : 'Service B2B'}</h4>
            <p className="text-emerald-900/40 text-sm leading-relaxed">
              {isAr ? 'أسعار تنافسية مصممة خصيصاً لأصحاب محلات العطور.' : 'Des tarifs compétitifs conçus spécifiquement pour les parfumeries.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
