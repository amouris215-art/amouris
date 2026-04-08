'use client'
import Link from 'next/link'
import { useI18n } from '@/i18n/i18n-context'
import { motion } from 'framer-motion'
import { ArrowRight, Star, Globe, ShieldCheck } from 'lucide-react'

export function HeroSection() {
  const { t } = useI18n()

  const stats = [
    { icon: Star, label: '500+', sub: t('home.stats_references') },
    { icon: Globe, label: '48', sub: t('home.stats_wilayas') },
    { icon: ShieldCheck, label: 'B2B', sub: t('home.stats_b2b') },
  ]

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-emerald-950">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.1),transparent)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(217,119,6,0.1),transparent)]" />
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-900/50 border border-emerald-400/20 text-emerald-400 text-xs font-bold uppercase tracking-[0.3em] mb-8">
            Expert Parfumeur & Grossiste
          </span>

          <h1 className="text-5xl md:text-8xl font-serif text-white mb-8 leading-[1.1]">
            {t('home.hero_title_1')}{' '}
            <span className="text-amber-400 italic">{t('home.hero_title_2')}</span>{' '}
            <br />
            {t('home.hero_title_3')}
          </h1>

          <p className="max-w-2xl mx-auto text-emerald-100/60 text-lg md:text-xl mb-12 leading-relaxed">
            {t('home.hero_subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link 
              href="/shop"
              className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 group"
            >
              {t('home.hero_cta_primary')}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/register"
              className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all backdrop-blur-sm"
            >
              {t('home.hero_cta_secondary')}
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 md:gap-12 max-w-4xl mx-auto border-t border-white/5 pt-12">
            {stats.map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="flex justify-center mb-3">
                    <stat.icon className="w-5 h-5 text-amber-500/50 group-hover:text-amber-500 transition-colors" />
                </div>
                <div className="text-2xl md:text-4xl font-serif text-white mb-1">{stat.label}</div>
                <div className="text-[10px] md:text-xs text-emerald-100/40 uppercase tracking-widest font-medium">
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Ornament */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px]" />
    </section>
  )
}
