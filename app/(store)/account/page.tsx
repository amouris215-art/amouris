'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/i18n/i18n-context'
import { useCustomerAuthStore } from '@/store/customer-auth.store'
import { useOrdersStore } from '@/store/orders.store'
import { Package, User, MapPin, ShoppingBag, LogOut, Phone, Building2, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'

export default function AccountPage() {
  const { language, t } = useI18n()
  const router = useRouter()
  const { currentCustomer, isAuthenticated, logout } = useCustomerAuthStore()
  const getByCustomer = useOrdersStore(s => s.getByCustomer)

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login')
    }
  }, [isAuthenticated, router])

  if (!currentCustomer) return null

  const myOrders = getByCustomer(currentCustomer.id)
  const totalSpent = myOrders.reduce((sum, o) => sum + o.total_amount, 0)

  const handleLogout = () => {
    logout()
    router.replace('/')
  }

  return (
    <div className="min-h-screen bg-neutral-50/50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 bg-white p-8 rounded-3xl border border-emerald-50 shadow-sm"
        >
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-emerald-900 rounded-2xl flex items-center justify-center text-white text-3xl font-serif shadow-xl shadow-emerald-900/20">
                {currentCustomer.first_name.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-serif text-emerald-950">
                {language === 'ar' ? `مرحباً، ${currentCustomer.first_name}` : `Bonjour, ${currentCustomer.first_name}`}
              </h1>
              <p className="text-emerald-900/40 font-medium mt-1">
                {language === 'ar' ? 'لوحة تحكم الحساب الخاص بك' : 'Tableau de bord de votre compte professionnel'}
              </p>
            </div>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline" 
            className="group w-full md:w-auto px-8 py-6 rounded-2xl border-emerald-100 text-emerald-900 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-100 transition-all font-bold"
          >
            <LogOut className="h-4 w-4 mx-2 transition-transform group-hover:-translate-x-1" />
            {t('nav.logout')}
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Stats & Profile */}
          <div className="lg:col-span-1 space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-900 p-6 rounded-3xl text-white shadow-xl shadow-emerald-900/10">
                    <ShoppingBag className="w-5 h-5 text-emerald-400 mb-3" />
                    <p className="text-2xl font-bold">{myOrders.length}</p>
                    <p className="text-[10px] uppercase tracking-widest text-emerald-300 font-black">{t('account.total_orders')}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-emerald-50 shadow-sm">
                    <CreditCard className="w-5 h-5 text-amber-500 mb-3" />
                    <p className="text-xl font-bold text-emerald-950">{totalSpent.toLocaleString()} <span className="text-[10px]">DZD</span></p>
                    <p className="text-[10px] uppercase tracking-widest text-emerald-900/30 font-black">{t('account.total_spent')}</p>
                </div>
            </div>

            {/* Profile Info */}
            <Card className="border-emerald-50 rounded-[2rem] shadow-sm overflow-hidden bg-white">
              <CardHeader className="bg-emerald-50/30 border-b border-emerald-50 px-8 py-6">
                <CardTitle className="text-lg font-serif flex items-center gap-3 text-emerald-900">
                  <User className="h-5 w-5" />
                  {t('account.profile_info')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-emerald-700" />
                    </div>
                    <div>
                        <label className="text-[10px] text-emerald-900/30 uppercase tracking-[0.2em] block mb-1 font-black">{t('account.full_name')}</label>
                        <p className="font-bold text-emerald-950 text-lg">{currentCustomer.first_name} {currentCustomer.last_name}</p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-4 h-4 text-emerald-700" />
                    </div>
                    <div>
                        <label className="text-[10px] text-emerald-900/30 uppercase tracking-[0.2em] block mb-1 font-black">{t('account.shop_name')}</label>
                        <p className="font-bold text-emerald-950">{currentCustomer.shop_name || '—'}</p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-4 h-4 text-emerald-700" />
                    </div>
                    <div>
                        <label className="text-[10px] text-emerald-900/30 uppercase tracking-[0.2em] block mb-1 font-black">{t('account.phone')}</label>
                        <p className="font-bold text-emerald-950 font-mono tracking-wider">{currentCustomer.phone}</p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 text-emerald-700" />
                    </div>
                    <div>
                        <label className="text-[10px] text-emerald-900/30 uppercase tracking-[0.2em] block mb-1 font-black">{t('account.address')}</label>
                        <p className="font-bold text-emerald-950">{currentCustomer.wilaya} {currentCustomer.commune ? `, ${currentCustomer.commune}` : ''}</p>
                    </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Orders List */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-emerald-50 rounded-[2rem] shadow-sm h-full overflow-hidden bg-white">
              <CardHeader className="bg-emerald-50/30 border-b border-emerald-50 px-8 py-6">
                <CardTitle className="text-lg font-serif flex items-center gap-3 text-emerald-900">
                  <ShoppingBag className="h-5 w-5" />
                  {t('account.my_orders')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {myOrders.length > 0 ? (
                  <div className="divide-y divide-emerald-50">
                    {myOrders.map(order => (
                      <div key={order.id} className="group p-8 flex flex-col md:flex-row items-start md:items-center justify-between hover:bg-emerald-50/30 transition-all duration-300">
                        <div className="flex items-center gap-6 mb-4 md:mb-0">
                            <div className="w-12 h-12 rounded-2xl bg-white border border-emerald-50 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                <Package className="w-5 h-5 text-emerald-800" />
                            </div>
                            <div>
                                <p className="font-black text-emerald-950 text-lg uppercase tracking-tight">{order.order_number}</p>
                                <p className="text-xs text-emerald-900/30 font-medium">{new Date(order.created_at).toLocaleDateString(language === 'ar' ? 'ar-DZ' : 'fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>
                        </div>
                        
                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4">
                          <p className="font-black text-emerald-900 text-xl">{order.total_amount.toLocaleString()} <span className="text-[10px] font-normal">DZD</span></p>
                          <span className={`text-[10px] uppercase font-black px-4 py-1.5 rounded-full ring-4 ring-black/5 ${
                            order.order_status === 'delivered' ? 'bg-emerald-500 text-white' : 
                            order.order_status === 'cancelled' ? 'bg-rose-500 text-white' :
                            'bg-amber-400 text-emerald-950'
                          }`}>
                            {t(`status.${order.order_status}`)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-32 px-10">
                    <div className="w-24 h-24 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                        <Package className="h-10 w-10 text-emerald-900/10" />
                    </div>
                    <p className="text-emerald-900/40 text-lg font-medium">{t('account.no_orders')}</p>
                    <Button 
                        onClick={() => router.push('/shop')}
                        className="mt-8 bg-emerald-900 text-white px-8 py-6 rounded-2xl font-bold hover:bg-emerald-800 transition-all"
                    >
                        {t('cart.browse_shop')}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
