'use client'
import { useI18n } from '@/i18n/i18n-context'
import { motion } from 'framer-motion'
import { PackageSearch, CreditCard, Truck } from 'lucide-react'

export function HowItWorks() {
  const { t } = useI18n()

  const steps = [
    {
      icon: PackageSearch,
      title: t('home.step1_title'),
      desc: t('home.step1_desc'),
      number: '01'
    },
    {
      icon: CreditCard,
      title: t('home.step2_title'),
      desc: t('home.step2_desc'),
      number: '02'
    },
    {
      icon: Truck,
      title: t('home.step3_title'),
      desc: t('home.step3_desc'),
      number: '03'
    }
  ]

  return (
    <section className="py-32 relative overflow-hidden bg-emerald-950">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-900/20 skew-x-[-12deg] translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-4xl md:text-5xl text-white mb-6"
          >
            {t('home.how_title')}
          </motion.h2>
          <div className="w-12 h-1 bg-amber-400 mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-emerald-800 -translate-y-1/2 z-0" />

          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="relative group text-center"
            >
              <div className="relative z-10">
                <div className="w-24 h-24 bg-emerald-900 border-2 border-emerald-800 rounded-[2rem] flex items-center justify-center mx-auto mb-8 transition-all duration-500 group-hover:bg-amber-500 group-hover:border-amber-400 group-hover:-rotate-12 group-hover:scale-110 shadow-2xl">
                    <step.icon size={40} className="text-amber-500 group-hover:text-emerald-950 transition-colors" />
                    
                    {/* Number Badge */}
                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-white text-emerald-950 rounded-xl flex items-center justify-center font-bold text-sm shadow-xl rotate-12 group-hover:rotate-0 transition-transform">
                        {step.number}
                    </div>
                </div>
                <h3 className="text-2xl font-serif text-white mb-4 transition-colors group-hover:text-amber-400">{step.title}</h3>
                <p className="text-emerald-100/40 leading-relaxed text-sm max-w-[250px] mx-auto px-4">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
