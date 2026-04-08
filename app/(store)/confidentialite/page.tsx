'use client'

import { useState } from 'react'
import { useSettingsStore } from '@/store/settings.store'
import { Lock, FileText, Globe, Mail, Phone, MapPin, Database, UserCheck, Shield, Eye, HelpCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ConfidentialitePage() {
  const settings = useSettingsStore()
  const [lang, setLang] = useState<'FR' | 'AR'>('FR')

  const content = {
    FR: {
      title: "Politique de Confidentialité",
      lastUpdate: "Dernière mise à jour",
      sections: [
        {
          id: "responsable",
          title: "1. Responsable du Traitement",
          icon: Shield,
          text: `La marque ${settings.storeNameFR}, située à ${settings.address}, ${settings.wilaya}, est responsable du traitement des données personnelles collectées sur cette plateforme.`
        },
        {
          id: "collecte",
          title: "2. Données Collectées",
          icon: FileText,
          text: "Nous collectons uniquement les données strictement nécessaires au traitement de vos commandes professionnelles :",
          list: [
            "Nom et Prénom (ou Raison Sociale)",
            "Numéro de téléphone (obligatoire pour la confirmation)",
            "Wilaya et Adresse de livraison",
            "L'adresse email n'est pas obligatoire pour passer commande."
          ]
        },
        {
          id: "utilisation",
          title: "3. Utilisation des Données",
          icon: Eye,
          text: "Vos informations sont utilisées exclusivement pour :",
          list: [
            "La validation et le suivi de vos commandes",
            "La livraison de vos produits par nos transporteurs",
            "Le contact direct par nos conseillers commerciaux",
            "L'établissement des bons de livraison et factures"
          ]
        },
        {
          id: "stockage",
          title: "4. Stockage des Données",
          icon: Database,
          text: "Dans la version actuelle de la plateforme, la plupart de vos préférences et votre panier sont stockés localement sur votre navigateur (LocalStorage). Nos bases de données sécurisées ne conservent que les informations liées aux commandes validées et à votre compte client."
        },
        {
          id: "droits",
          title: "5. Droits des Utilisateurs",
          icon: UserCheck,
          text: "Conformément aux principes de protection des données, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Vous pouvez modifier vos informations directement depuis votre espace client ou en nous contactant."
        },
        {
          id: "contact",
          title: "6. Contact",
          icon: HelpCircle,
          text: "Pour toute question concernant vos données personnelles, vous pouvez nous contacter via les canaux officiels affichés ci-dessous."
        }
      ],
      contactTitle: "Nous Contacter",
      email: "Email :",
      phone: "Téléphone :",
      address: "Adresse :"
    },
    AR: {
      title: "سياسة الخصوصية",
      lastUpdate: "آخر تحديث",
      sections: [
        {
          id: "responsable",
          title: "1. المسؤول عن معالجة البيانات",
          icon: Shield,
          text: `العلامة التجارية ${settings.storeNameAR}، المقر في ${settings.address}، ${settings.wilaya}، هي المسؤولة عن معالجة البيانات الشخصية التي يتم جمعها على هذه المنصة.`
        },
        {
          id: "collecte",
          title: "2. البيانات التي يتم جمعها",
          icon: FileText,
          text: "نحن نجمع فقط البيانات الضرورية جداً لمعالجة طلباتكم المهنية:",
          list: [
            "الاسم واللقب (أو الاسم التجاري)",
            "رقم الهاتف (إجباري لتأكيد الطلب)",
            "الولاية وعنوان التوصيل",
            "البريد الإلكتروني ليس إجبارياً لإجراء الطلب."
          ]
        },
        {
          id: "utilisation",
          title: "3. استخدام البيانات",
          icon: Eye,
          text: "تستخدم معلوماتكم حصرياً لـ:",
          list: [
            "تأكيد ومتابعة طلباتكم",
            "توصيل منتجاتكم عبر عمال التوصيل لدينا",
            "الاتصال المباشر من قبل مستشاري المبيعات لدينا",
            "إعداد وصولات التسليم والفواتير"
          ]
        },
        {
          id: "stockage",
          title: "4. تخزين البيانات",
          icon: Database,
          text: "في النسخة الحالية من المنصة، يتم تخزين معظم تفضيلاتكم وسلة تسوقكم محلياً على متصفحكم (LocalStorage). قواعد بياناتنا المؤمنة تحتفظ فقط بالمعلومات المتعلقة بالطلبات المؤكدة وحسابكم الخاص."
        },
        {
          id: "droits",
          title: "5. حقوق المستخدمين",
          icon: UserCheck,
          text: "وفقاً لمبادئ حماية البيانات، لديكم الحق في الوصول إلى بياناتكم وتصحيحها وحذفها. يمكنكم تعديل معلوماتكم مباشرة من فضاء الزبون الخاص بكم أو عبر الاتصال بنا."
        },
        {
          id: "contact",
          title: "6. الاتصال",
          icon: HelpCircle,
          text: "لأي استفسار بخصوص بياناتكم الشخصية، يمكنكم التواصل معنا عبر القنوات الرسمية الموضحة أدناه."
        }
      ],
      contactTitle: "اتصل بنا",
      email: "البريد الإلكتروني:",
      phone: "الهاتف:",
      address: "العنوان:"
    }
  }

  const current = content[lang]
  const isRTL = lang === 'AR'

  return (
    <div className={`min-h-screen bg-neutral-50/50 py-24 ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Language Switcher */}
        <div className="flex justify-end mb-8">
           <button 
             onClick={() => setLang(lang === 'FR' ? 'AR' : 'FR')}
             className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-emerald-950/10 text-emerald-950 font-medium hover:bg-emerald-50 transition-colors"
           >
             <Globe size={16} className="text-amber-500" />
             {lang === 'FR' ? 'Afficher en Arabe' : 'Afficher en Français'}
           </button>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 md:p-16 rounded-[2.5rem] md:rounded-[4rem] shadow-2xl shadow-emerald-950/5 border border-emerald-950/5"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-12 pb-10 border-b border-emerald-950/5">
            <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-900 shrink-0">
               <Lock size={40} />
            </div>
            <div>
               <h1 className="text-3xl md:text-4xl font-serif text-emerald-950 leading-tight">{current.title}</h1>
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-950/40 mt-3">
                 {current.lastUpdate} : {new Date().toLocaleDateString(lang === 'FR' ? 'fr-FR' : 'ar-DZ')}
               </p>
            </div>
          </div>

          <div className="space-y-10">
            {current.sections.map((section, index) => (
              <motion.section 
                key={section.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-emerald-900 shadow-inner">
                    <section.icon size={20} />
                  </div>
                  <h2 className="text-xl font-serif text-emerald-950 font-bold">{section.title}</h2>
                </div>
                
                <div className="text-emerald-950/70 font-light leading-relaxed text-lg pl-14 rtl:pr-14 rtl:pl-0">
                  <p>{section.text}</p>
                  {section.list && (
                    <ul className="mt-4 space-y-3">
                      {section.list.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.section>
            ))}

            <section className="bg-emerald-50 p-8 md:p-12 rounded-[2rem] border border-emerald-950/5 mt-16 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5 text-emerald-950 pointer-events-none">
                  <Shield size={120} />
               </div>
               
               <h3 className="text-2xl font-serif text-emerald-950 mb-8 relative z-10">{current.contactTitle}</h3>
               <div className="grid md:grid-cols-2 gap-8 relative z-10">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-emerald-950 shadow-sm border border-emerald-950/5">
                        <Mail size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-emerald-950/40">{current.email.replace(' :', '')}</p>
                        <p className="font-serif text-lg text-emerald-950">{settings.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-emerald-950 shadow-sm border border-emerald-950/5">
                        <Phone size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-emerald-950/40">{current.phone.replace(' :', '')}</p>
                        <p className="font-serif text-lg text-emerald-950">{settings.phone}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-emerald-950 shadow-sm border border-emerald-950/5 shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-emerald-950/40">{current.address.replace(' :', '')}</p>
                      <p className="font-serif text-lg text-emerald-950 leading-snug">{settings.address}, {settings.wilaya}</p>
                    </div>
                  </div>
               </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
