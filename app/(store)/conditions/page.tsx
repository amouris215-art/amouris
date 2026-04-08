'use client'

import { useState } from 'react'
import { useSettingsStore } from '@/store/settings.store'
import { Scale, ChevronRight, Globe, Mail, Phone, MapPin, Info, DollarSign, ShoppingBag, Truck, RotateCcw, ShieldCheck, Lock, Gavel } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export default function ConditionsPage() {
  const settings = useSettingsStore()
  const [lang, setLang] = useState<'FR' | 'AR'>('FR')

  const content = {
    FR: {
      title: "Conditions Générales de Vente et d'Utilisation",
      lastUpdate: "Dernière mise à jour",
      sections: [
        {
          id: "presentation",
          title: "1. Présentation de la Plateforme",
          icon: Info,
          text: `La plateforme B2B ${settings.storeNameFR} est un espace réservé aux professionnels de la parfumerie. Elle permet de commander des huiles parfumées (vendues au gramme) et des flacons (vendus à l'unité) pour la revente ou la création de produits finis.`
        },
        {
          id: "acces",
          title: "2. Conditions d'Accès et d'Utilisation",
          icon: Lock,
          text: "L'accès à la plateforme est strictement réservé aux clients professionnels. L'utilisation du site implique l'acceptation intégrale des présentes conditions. Chaque utilisateur est responsable de la confidentialité de ses identifiants de connexion."
        },
        {
          id: "produits",
          title: "3. Produits et Prix",
          icon: DollarSign,
          text: `Tous nos prix sont indiqués en Dinars Algériens (DZD). ${settings.storeNameFR} se réserve le droit de modifier les prix à tout moment en fonction des fluctuations du marché. Les produits sont facturés sur la base des tarifs en vigueur au moment de la validation de la commande.`
        },
        {
          id: "commandes",
          title: "4. Processus de Commande",
          icon: ShoppingBag,
          text: "Le client sélectionne ses produits et valide sa commande sur le site. Une commande est considérée comme définitive après confirmation téléphonique par l'un de nos conseillers commerciaux."
        },
        {
          id: "paiement",
          title: "5. Paiement",
          icon: ShieldCheck,
          text: "Le paiement s'effectue exclusivement en espèces à la livraison (Cash on Delivery). Aucune transaction bancaire en ligne n'est effectuée sur cette plateforme."
        },
        {
          id: "livraison",
          title: "6. Livraison",
          icon: Truck,
          text: `Les livraisons sont effectuées sur tout le territoire national algérien. Les délais de livraison varient selon la zone (généralement 24h à 72h). La livraison est gratuite pour toute commande dépassant ${settings.freeDeliveryThreshold.toLocaleString()} DZD.`
        },
        {
          id: "retours",
          title: "7. Retours et Réclamations",
          icon: RotateCcw,
          text: "Toute réclamation concernant la qualité ou la conformité des produits doit être formulée dans les 48 heures suivant la réception de la marchandise. Les retours ne sont acceptés que pour les flacons non utilisés ou les huiles non entamées."
        },
        {
          id: "responsabilite",
          title: "8. Responsabilité",
          icon: ShieldCheck,
          text: `${settings.storeNameFR} ne saurait être tenu responsable des dommages indirects résultant de l'utilisation des produits vendus. L'utilisation finale des huiles et flacons relève de la responsabilité exclusive du client professionnel.`
        },
        {
          id: "propriete",
          title: "9. Propriété Intellectuelle",
          icon: Info,
          text: `Tous les éléments du site ${settings.storeNameFR} (textes, logos, images) sont la propriété exclusive de la marque. Toute reproduction est strictement interdite sans notre accord préalable.`
        },
        {
          id: "donnees",
          title: "10. Données Personnelles",
          icon: Lock,
          text: "Pour plus d'informations sur la gestion de vos données, veuillez consulter notre ",
          link: { text: "Politique de Confidentialité", href: "/confidentialite" }
        },
        {
          id: "droit",
          title: "11. Droit Applicable",
          icon: Gavel,
          text: "Les présentes conditions sont régies par le droit algérien. En cas de litige, les tribunaux d'Alger sont seuls compétents."
        }
      ],
      contactTitle: "Nous Contacter",
      email: "Email :",
      phone: "Téléphone :",
      address: "Adresse :"
    },
    AR: {
      title: "الشروط العامة للبيع والاستخدام",
      lastUpdate: "آخر تحديث",
      sections: [
        {
          id: "presentation",
          title: "1. عرض المنصة",
          icon: Info,
          text: `منصة ${settings.storeNameAR} المخصصة للبيع بالجملة (B2B) هي مساحة محجوزة لمحترفي العطور. تتيح طلب زيوت عطرية (تباع بالغرام) وقوارير (تباع بالوحدة) لإعادة البيع أو ابتكار منتجات نهائية.`
        },
        {
          id: "acces",
          title: "2. شروط الوصول والاستخدام",
          icon: Lock,
          text: "الوصول إلى المنصة مخصص حصرياً للعملاء المحترفين. استخدام الموقع يعني القبول الكامل لهذه الشروط. كل مستخدم مسؤول عن سرية بيانات دخوله."
        },
        {
          id: "produits",
          title: "3. المنتجات والأسعار",
          icon: DollarSign,
          text: `جميع أسعارنا موضحة بالدينار الجزائري (DZD). تحتفظ ${settings.storeNameAR} بالحق في تعديل الأسعار في أي وقت بناءً على تقلبات السوق. يتم فوترة المنتجات على أساس الأسعار المعمول بها وقت تأكيد الطلب.`
        },
        {
          id: "commandes",
          title: "4. عملية الطلب",
          icon: ShoppingBag,
          text: "يختار العميل منتجاته ويؤكد طلبه عبر الموقع. يعتبر الطلب نهائياً بعد التأكيد الهاتفي من أحد مستشاري المبيعات لدينا."
        },
        {
          id: "paiement",
          title: "5. الدفع",
          icon: ShieldCheck,
          text: "يتم الدفع حصرياً نقداً عند التسليم (Paiement à la livraison). لا تتم أي معاملات مصرفية عبر الإنترنت على هذه المنصة."
        },
        {
          id: "livraison",
          title: "6. التوصيل",
          icon: Truck,
          text: `يتم التوصيل عبر كامل التراب الوطني الجزائري. تختلف آجال التسليم حسب المنطقة (عادة بين 24 إلى 72 ساعة). التوصيل مجاني لكل طلب يتجاوز ${settings.freeDeliveryThreshold.toLocaleString()} دج.`
        },
        {
          id: "retours",
          title: "7. الإرجاع والشكاوى",
          icon: RotateCcw,
          text: "يجب تقديم أي شكوى تتعلق بجودة أو مطابقة المنتجات في غضون 48 ساعة من استلام البضاعة. لا تُقبل المرتجعات إلا للقوارير غير المستخدمة أو الزيوت غير المفتوحة."
        },
        {
          id: "responsabilite",
          title: "8. المسؤولية",
          icon: ShieldCheck,
          text: `لا يمكن تحميل ${settings.storeNameAR} المسؤولية عن الأضرار غير المباشرة الناتجة عن استخدام المنتجات المباعة. الاستخدام النهائي للزيوت والقوارير يقع تحت المسؤولية الحصرية للعميل المحترف.`
        },
        {
          id: "propriete",
          title: "9. الملكية الفكرية",
          icon: Info,
          text: `جميع عناصر موقع ${settings.storeNameAR} (نصوص، شعارات، صور) هي ملكية حصرية للعلامة التجارية. يمنع منعاً باتاً أي استنساخ دون موافقتنا المسبقة.`
        },
        {
          id: "donnees",
          title: "10. البيانات الشخصية",
          icon: Lock,
          text: "لمزيد من المعلومات حول إدارة بياناتكم، يرجى مراجعة ",
          link: { text: "سياسة الخصوصية", href: "/confidentialite" }
        },
        {
          id: "droit",
          title: "11. القانون المعمول به",
          icon: Gavel,
          text: "تخضع هذه الشروط للقانون الجزائري. في حالة حدوث نزاع، تختص محاكم الجزائر العاصمة وحدها بالنظر فيه."
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 md:p-16 rounded-[2.5rem] md:rounded-[4rem] shadow-2xl shadow-emerald-950/5 border border-emerald-950/5"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-12 pb-10 border-b border-emerald-950/5">
            <div className="w-20 h-20 bg-[#0a3d2e] rounded-3xl flex items-center justify-center text-[#C9A84C] shrink-0 shadow-lg shadow-emerald-950/20">
               <Scale size={40} />
            </div>
            <div>
               <h1 className="text-3xl md:text-4xl font-serif text-emerald-950 leading-tight">{current.title}</h1>
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-950/40 mt-3">
                 {current.lastUpdate} : {new Date().toLocaleDateString(lang === 'FR' ? 'fr-FR' : 'ar-DZ')}
               </p>
            </div>
          </div>

          <div className="space-y-12">
            {current.sections.map((section, index) => (
              <motion.section 
                key={section.id}
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                    <section.icon size={18} />
                  </div>
                  <h2 className="text-xl font-serif text-emerald-950 font-bold">{section.title}</h2>
                </div>
                <div className="text-emerald-950/70 font-light leading-relaxed text-lg pl-11 rtl:pr-11 rtl:pl-0">
                  {section.text}
                  {section.link && (
                    <Link href={section.link.href} className="text-amber-600 font-medium hover:underline inline-flex items-center gap-1 group">
                      {section.link.text}
                      <ChevronRight size={14} className={`transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                    </Link>
                  )}
                </div>
              </motion.section>
            ))}

            <section className="bg-emerald-950/5 p-8 md:p-12 rounded-[2rem] border border-emerald-950/10 mt-16 group hover:bg-emerald-950 transition-all duration-500">
               <h3 className="text-2xl font-serif text-emerald-950 mb-6 group-hover:text-white transition-colors">{current.contactTitle}</h3>
               <div className="grid md:grid-cols-2 gap-8 text-emerald-950 group-hover:text-emerald-100/80 transition-colors">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-emerald-950 shadow-sm">
                        <Mail size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest opacity-50">{current.email.replace(' :', '')}</p>
                        <p className="font-medium group-hover:text-amber-400">{settings.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-emerald-950 shadow-sm">
                        <Phone size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest opacity-50">{current.phone.replace(' :', '')}</p>
                        <p className="font-medium group-hover:text-amber-400">{settings.phone}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-emerald-950 shadow-sm shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest opacity-50">{current.address.replace(' :', '')}</p>
                      <p className="font-medium group-hover:text-amber-400">{settings.address}, {settings.wilaya}</p>
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
