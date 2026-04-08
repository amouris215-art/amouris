"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/i18n/i18n-context';
import { useCustomerAuthStore } from '@/store/customer-auth.store';
import { useOrdersStore } from '@/store/orders.store';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, User, MapPin, ShoppingBag, LogOut, 
  Phone, Building2, CreditCard, ChevronRight, 
  Settings, Clock, CheckCircle2, AlertCircle 
} from 'lucide-react';

export default function AccountClient() {
  const { language, t } = useI18n();
  const router = useRouter();
  const { customer, isAuthenticated, logout } = useCustomerAuthStore();
  const { getByCustomer } = useOrdersStore();
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');

  const isAr = language === 'ar';

  // Route Protection
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !customer) return null;

  const orders = getByCustomer(customer.id);
  const totalSpent = orders.reduce((sum, o) => sum + o.total_amount, 0);

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 pt-12 pb-32">
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* Header Hero */}
        <header className="mb-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-[2rem] bg-[#0a3d2e] shadow-2xl shadow-emerald-900/20 flex items-center justify-center text-white font-serif text-4xl border border-emerald-400/10">
                {customer.first_name.charAt(0)}
              </div>
              <div>
                <h1 className="font-serif text-4xl md:text-5xl text-emerald-950 mb-2 tracking-tight">
                  {isAr ? `مرحباً بك، ${customer.first_name}` : `Espace ${customer.first_name}`}
                </h1>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C9A84C]">
                  {isAr ? 'عضو في برنامج أموريس للمحترفين' : 'Membre Amouris Premium B2B'}
                </p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="px-8 py-4 bg-white border border-emerald-950/5 text-emerald-950 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all flex items-center gap-3 shadow-sm"
            >
              <LogOut size={16} />
              {isAr ? 'تسجيل الخروج' : 'Déconnexion'}
            </button>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-12 bg-white p-2 rounded-3xl border border-emerald-950/5 w-fit">
           <button 
             onClick={() => setActiveTab('orders')}
             className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-[#0a3d2e] text-white shadow-xl shadow-emerald-900/10' : 'text-emerald-950/40 hover:text-emerald-950'}`}
           >
             {isAr ? 'طلباتي' : 'Mes Commandes'}
           </button>
           <button 
             onClick={() => setActiveTab('profile')}
             className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'profile' ? 'bg-[#0a3d2e] text-white shadow-xl shadow-emerald-900/10' : 'text-emerald-950/40 hover:text-emerald-950'}`}
           >
             {isAr ? 'ملفي الشخصي' : 'Mon Profil'}
           </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {activeTab === 'orders' ? (
                <motion.div 
                  key="orders"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  {orders.length === 0 ? (
                    <div className="bg-white p-16 rounded-[3rem] text-center border border-emerald-950/5 shadow-2xl shadow-emerald-950/5">
                       <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-200">
                          <ShoppingBag size={32} />
                       </div>
                       <h3 className="font-serif text-2xl text-emerald-950 mb-4">Aucune commande encore</h3>
                       <p className="text-emerald-950/40 text-sm max-w-sm mx-auto leading-relaxed mb-8">
                          Commencez à explorer nos essences d'exception pour remplir votre historique.
                       </p>
                       <Link href="/shop" className="inline-flex bg-[#0a3d2e] text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest">
                          Découvrir la boutique
                       </Link>
                    </div>
                  ) : (
                    orders.map(order => (
                      <div key={order.id} className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-emerald-950/5 hover:border-emerald-950/10 transition-all shadow-sm shadow-emerald-900/5 group flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-6 w-full md:w-auto">
                           <div className="w-16 h-16 rounded-2xl bg-neutral-50 flex items-center justify-center text-emerald-950/20 group-hover:scale-110 group-hover:bg-emerald-50 group-hover:text-[#0a3d2e] transition-all">
                              <Package size={24} />
                           </div>
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-[#C9A84C] mb-1">{order.order_number}</p>
                              <h4 className="font-serif text-xl text-emerald-950">
                                {new Date(order.created_at).toLocaleDateString(isAr ? 'ar-DZ' : 'fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                              </h4>
                           </div>
                        </div>

                        <div className="flex items-center gap-8 w-full md:w-auto justify-between border-t md:border-t-0 border-emerald-950/5 pt-6 md:pt-0">
                           <div className="text-right">
                              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-950/20 mb-1">Montant Total</p>
                              <p className="font-serif text-2xl text-emerald-950">{order.total_amount.toLocaleString()} <span className="text-xs font-normal">DZD</span></p>
                           </div>
                           <div className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${
                             order.order_status === 'delivered' ? 'bg-emerald-50 text-emerald-600' : 
                             order.order_status === 'cancelled' ? 'bg-rose-50 text-rose-600' :
                             'bg-amber-50 text-amber-700'
                           }`}>
                             {order.order_status === 'pending' && <Clock size={12} />}
                             {order.order_status === 'delivered' && <CheckCircle2 size={12} />}
                             {order.order_status === 'cancelled' && <AlertCircle size={12} />}
                             {order.order_status}
                           </div>
                        </div>
                      </div>
                    ))
                  )}
                </motion.div>
              ) : (
                <motion.div 
                  key="profile"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white p-8 md:p-12 rounded-[3rem] border border-emerald-950/5 shadow-2xl shadow-emerald-950/5"
                >
                  <h3 className="font-serif text-3xl text-emerald-950 mb-10 pb-6 border-b border-emerald-950/5">Mes Coordonnées</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                     <ProfileField icon={User} label="Nom Complet" value={`${customer.first_name} ${customer.last_name}`} />
                     <ProfileField icon={Building2} label="Nom de la Boutique" value={customer.shop_name || 'Particulier'} />
                     <ProfileField icon={Phone} label="Contact Téléphonique" value={customer.phone} />
                     <ProfileField icon={MapPin} label="Localisation" value={`${customer.wilaya}${customer.commune ? `, ${customer.commune}` : ''}`} />
                  </div>
                  
                  <div className="mt-16 p-8 bg-emerald-50 rounded-[2rem] border border-emerald-100 flex items-start gap-4">
                     <Settings className="text-[#0a3d2e] shrink-0" size={24} />
                     <div>
                        <h4 className="font-bold text-emerald-950 text-sm mb-1">Demande de modification</h4>
                        <p className="text-emerald-950/40 text-xs leading-relaxed">
                          Pour modifier vos informations professionnelles, contactez le support Amouris sur WhatsApp. Les modifications sont validées par un administrateur sous 24h.
                        </p>
                     </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar Stats */}
          <div className="lg:col-span-4 space-y-8">
             <div className="bg-[#0a3d2e] p-10 rounded-[2.5rem] text-white shadow-2xl shadow-emerald-900/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-400/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                   <CreditCard className="text-amber-400 mb-6" size={32} />
                   <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-100/40 mb-2">Total des achats</h3>
                   <p className="font-serif text-5xl text-white mb-2 tracking-tighter">{totalSpent.toLocaleString()}</p>
                   <p className="text-sm font-bold text-amber-500 italic">Dinar Algérien</p>
                </div>
             </div>

             <div className="bg-white p-10 rounded-[2.5rem] border border-emerald-950/5 shadow-sm">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-950/20 mb-8 border-b border-emerald-950/5 pb-4">Activité Récente</h3>
                <div className="space-y-6">
                   <div className="flex gap-4">
                      <div className="w-1 h-auto bg-amber-400 rounded-full" />
                      <div>
                         <p className="text-xs font-bold text-emerald-950">Dernière commande</p>
                         <p className="text-[10px] text-emerald-950/40 font-medium">Il y a quelques instants</p>
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <div className="w-1 h-auto bg-emerald-100 rounded-full" />
                      <div>
                         <p className="text-xs font-bold text-emerald-950">Inscription validée</p>
                         <p className="text-[10px] text-emerald-950/40 font-medium">{new Date(customer.joined_at).toLocaleDateString()}</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function ProfileField({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center text-emerald-950/20">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-[#C9A84C] mb-1">{label}</p>
        <p className="text-lg font-serif text-emerald-950">{value}</p>
      </div>
    </div>
  );
}
