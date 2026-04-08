'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/i18n/i18n-context'
import { useCartStore } from '@/store/cart-store'
import { useCustomerAuthStore } from '@/store/customer-auth.store'
import { useOrdersStore } from '@/store/orders.store'
import { useProductsStore } from '@/store/products.store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { WilayaSelector } from '@/components/store/WilayaSelector'
import { ShieldCheck, Truck, CreditCard, MapPin, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function CheckoutPage() {
  const router = useRouter()
  const { t, language } = useI18n()
  const { items, getTotal, clear } = useCartStore()
  const { currentCustomer: user } = useCustomerAuthStore()
  const createOrderInstance = useOrdersStore(s => s.createOrder)
  const updateStockGrams = useProductsStore(s => s.updateStockGrams)
  const updateVariantStock = useProductsStore(s => s.updateVariantStock)

  const [formData, setFormData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    phone: user?.phone || '',
    wilaya: user?.wilaya || '',
  })

  // Sync with user changes
  useEffect(() => {
    if (user) {
        setFormData({
            firstName: user.first_name,
            lastName: user.last_name,
            phone: user.phone,
            wilaya: user.wilaya
        })
    }
  }, [user])

  const [isSubmitting, setIsSubmitting] = useState(false)

  if (items.length === 0) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <h1 className="text-2xl font-serif mb-4">Votre panier est vide</h1>
            <Button onClick={() => router.push('/shop')}>Explorer la boutique</Button>
        </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.wilaya) {
      toast.error(language === 'ar' ? 'يرجى اختيار الولاية' : 'Veuillez choisir la wilaya')
      return
    }

    setIsSubmitting(true)
    
    try {
      const shippingFee = 800
      const orderTotal = getTotal() + shippingFee
      
      const order = createOrderInstance({
        customer_id: user?.id || null,
        guest_first_name: !user ? formData.firstName : undefined,
        guest_last_name: !user ? formData.lastName : undefined,
        guest_phone: !user ? formData.phone : undefined,
        guest_wilaya: !user ? formData.wilaya : undefined,
        items: items.map(item => ({
          product_id: item.product_id,
          flacon_variant_id: item.flacon_variant_id,
          product_name_fr: item.name_fr,
          product_name_ar: item.name_ar,
          quantity_grams: item.quantity_grams,
          quantity_units: item.quantity_units,
          unit_price: item.unit_price,
          total_price: item.total_price,
        })),
        total_amount: orderTotal,
        order_status: 'pending',
      })

      // Update Stocks
      items.forEach(item => {
        if (item.product_type === 'perfume') {
          updateStockGrams(item.product_id, -(item.quantity_grams || 0))
        } else if (item.flacon_variant_id) {
          updateVariantStock(item.product_id, item.flacon_variant_id, -(item.quantity_units || 0))
        }
      })

      clear()
      toast.success(language === 'ar' ? 'تم تقديم طلبك بنجاح' : 'Votre commande a été passée avec succès')
      router.push(`/checkout/success?order=${order.order_number}`)
      
    } catch (error) {
      console.error('Order submission error:', error)
      toast.error(language === 'ar' ? 'فشل تقديم الطلب' : 'Une erreur est survenue lors de la validation')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-neutral-50 min-h-screen pt-12 pb-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center gap-4 mb-12">
          <Link href="/cart" className="w-10 h-10 bg-white border border-emerald-100 rounded-xl flex items-center justify-center text-emerald-900 hover:bg-emerald-50 transition-colors shadow-sm">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-3xl font-serif text-emerald-950">{t('checkout.title')}</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
                {/* User Info */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2rem] border border-emerald-50 shadow-sm p-8 md:p-12 overflow-hidden relative"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[4rem] -mr-12 -mt-12 group-hover:scale-110 transition-transform" />
                    <h2 className="text-2xl font-serif text-emerald-950 mb-8 flex items-center gap-4 relative z-10">
                        <MapPin className="text-amber-500" size={24} />
                        {language === 'ar' ? 'معلومات التوصيل' : 'Informations de livraison'}
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase tracking-[0.2em] text-emerald-900/30 font-black ml-1">
                                {t('checkout.first_name')} *
                            </Label>
                            <Input 
                                required 
                                disabled={!!user}
                                className="rounded-2xl border-emerald-50 h-16 focus-visible:ring-emerald-800 bg-neutral-50/30 px-6 font-bold"
                                value={formData.firstName}
                                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase tracking-[0.2em] text-emerald-900/30 font-black ml-1">
                                {t('checkout.last_name')} *
                            </Label>
                            <Input 
                                required 
                                disabled={!!user}
                                className="rounded-2xl border-emerald-50 h-16 focus-visible:ring-emerald-800 bg-neutral-50/30 px-6 font-bold"
                                value={formData.lastName}
                                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase tracking-[0.2em] text-emerald-900/30 font-black ml-1">
                                {t('checkout.phone')} *
                            </Label>
                            <Input 
                                type="tel"
                                required 
                                disabled={!!user}
                                className="rounded-2xl border-emerald-50 h-16 focus-visible:ring-emerald-800 bg-neutral-50/30 px-6 font-bold font-mono tracking-widest"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase tracking-[0.2em] text-emerald-900/30 font-black ml-1">
                                {t('checkout.wilaya')} *
                            </Label>
                            <WilayaSelector 
                                value={formData.wilaya}
                                onValueChange={(val) => setFormData({...formData, wilaya: val})}
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Payment */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-[2rem] border border-emerald-50 shadow-sm p-8 md:p-12"
                >
                    <h2 className="text-2xl font-serif text-emerald-950 mb-8 flex items-center gap-4">
                        <CreditCard className="text-amber-500" size={24} />
                        {t('checkout.payment_method')}
                    </h2>
                    <div className="p-8 border-2 border-emerald-800 bg-emerald-50/50 rounded-3xl flex items-center justify-between ring-8 ring-emerald-50/20">
                        <div className="flex items-center gap-5">
                            <div className="w-6 h-6 rounded-full border-4 border-emerald-800 bg-white" />
                            <div>
                                <span className="block font-black text-xl text-emerald-950 uppercase tracking-tighter">{t('common.payment_cod')}</span>
                                <span className="text-xs text-emerald-900/40 uppercase tracking-widest font-medium">Payer à la réception</span>
                            </div>
                        </div>
                        <ShieldCheck className="text-emerald-800" size={32} />
                    </div>
                </motion.div>
            </form>
          </div>

          {/* Sticky Summary */}
          <div className="lg:col-span-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-950 text-white rounded-[2.5rem] p-8 md:p-10 sticky top-24 shadow-2xl shadow-emerald-950/20 overflow-hidden"
            >
              {/* Decor */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
              
              <h2 className="text-2xl font-serif text-amber-400 mb-10 pb-6 border-b border-white/10 flex items-center justify-between">
                {t('checkout.order_summary')}
                <span className="text-[10px] bg-white/10 px-3 py-1 rounded-full text-white uppercase tracking-[0.2em] font-black">
                    {items.length} {t('account.total_orders')}
                </span>
              </h2>
              
              <div className="space-y-6 mb-12 max-h-[30vh] overflow-y-auto pr-4 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between gap-6 group">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm group-hover:text-amber-200 transition-colors">
                        {item.quantity_grams || item.quantity_units}{item.product_type === 'flacon' ? 'x' : 'g'} {language === 'ar' ? item.name_ar : item.name_fr}
                      </span>
                      {item.variant_label && (
                        <span className="text-[9px] text-white/30 uppercase tracking-widest mt-1 font-black">
                          {item.variant_label}
                        </span>
                      )}
                    </div>
                    <span className="shrink-0 text-amber-200/60 font-mono text-sm group-hover:text-amber-200 transition-colors">
                      {item.total_price.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="pt-8 border-t border-white/10 space-y-5 mb-12">
                <div className="flex justify-between text-xs text-white/40 uppercase tracking-[0.2em] font-black">
                  <span>{t('cart.subtotal')}</span>
                  <span>{getTotal().toLocaleString()} DZD</span>
                </div>
                <div className="flex justify-between text-xs text-white/40 uppercase tracking-[0.2em] font-black">
                  <span className="flex items-center gap-3">
                    <Truck size={14} className="text-amber-400" />
                    Livraison (Yalidine)
                  </span>
                  <span>{formData.wilaya ? `800 DZD` : '---'}</span>
                </div>
                <div className="flex justify-between text-3xl font-serif text-white pt-6 border-t border-white/20">
                  <span className="text-white/40 text-xs self-center tracking-widest font-sans font-black">TOTAL</span>
                  <span className="text-amber-400">
                    {(getTotal() + (formData.wilaya ? 800 : 0)).toLocaleString()} <span className="text-xs">DZD</span>
                  </span>
                </div>
              </div>

              <Button 
                type="submit" 
                form="checkout-form" 
                className="w-full h-20 rounded-2xl bg-amber-400 text-emerald-950 font-black uppercase tracking-[0.3em] hover:bg-amber-300 hover:scale-[1.02] transition-all active:scale-[0.98] disabled:bg-white/20 shadow-xl shadow-amber-400/20"
                disabled={isSubmitting}
              >
                {isSubmitting ? t('common.loading') : t('checkout.confirm_order')}
              </Button>
              
              <div className="mt-8 flex items-center justify-center gap-3 opacity-20">
                <ShieldCheck size={16} />
                <p className="text-[10px] uppercase tracking-[0.2em] font-black">
                    Données 100% sécurisées
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
