"use client";

import Link from 'next/link';
import { useI18n } from '@/i18n/i18n-context';
import { getOrderStatusLabel } from '@/lib/status-helpers';
import { motion } from 'framer-motion';
import { 
  Package, 
  ShoppingBag, 
  CreditCard, 
  Clock, 
  ChevronRight
} from 'lucide-react';

interface AccountOverviewClientProps {
  customer: any;
  orders: any[];
}

export default function AccountOverviewClient({ customer, orders }: AccountOverviewClientProps) {
  const { language } = useI18n();
  const isAr = language === 'ar';

  const totalSpent = orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
  const lastOrder = orders[0]; // Assuming sorted by date

  const stats = [
    {
      label: isAr ? 'عدد الطلبات' : 'Nombre de commandes',
      value: orders.length,
      icon: Package,
      color: 'bg-emerald-50 text-emerald-600'
    },
    {
      label: isAr ? 'إجمالي المنفق' : 'Total dépensé',
      value: `${totalSpent.toLocaleString()} DZD`,
      icon: CreditCard,
      color: 'bg-amber-50 text-amber-600'
    },
    {
      label: isAr ? 'حالة آخر طلب' : 'Statut dernière commande',
      value: lastOrder ? getOrderStatusLabel(lastOrder.order_status, language) : (isAr ? 'لا يوجد' : 'Aucune'),
      icon: Clock,
      color: 'bg-blue-50 text-blue-600'
    }
  ];

  const recentOrders = orders.slice(0, 3);

  return (
    <div className="space-y-12 font-sans">
      {/* Greeting */}
      <header>
        <h1 className="font-serif text-4xl md:text-5xl text-gray-900 mb-2 font-bold italic">
          {isAr ? `مرحباً بك، ${customer.first_name}` : `Bonjour, ${customer.first_name}`}
        </h1>
        <p className="text-gray-500 font-medium flex items-center gap-2">
          {customer.shop_name}
          <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full" />
          {isAr ? 'عضو بريميوم' : 'Membre Premium B2B'}
        </p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-8 rounded-[2.5rem] border border-emerald-950/5 shadow-sm shadow-emerald-900/5 group"
            >
              <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <Icon size={24} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{stat.label}</p>
              <p className="font-serif text-2xl text-gray-900 capitalize font-bold italic">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="font-serif text-2xl text-gray-900 font-bold italic">{isAr ? 'أحدث الطلبات' : 'Dernières commandes'}</h2>
          <Link href="/account/orders" className="text-[10px] font-black uppercase tracking-widest text-[#C9A84C] hover:text-[#b09340] transition-colors flex items-center gap-2">
            {isAr ? 'عرض الكل' : 'Voir tout'}
            <ChevronRight size={14} />
          </Link>
        </div>

        <div className="space-y-4">
          {recentOrders.length === 0 ? (
            <div className="bg-white p-12 rounded-[3rem] text-center border border-emerald-950/5">
              <ShoppingBag className="mx-auto text-emerald-100 mb-4" size={48} />
              <p className="text-gray-500 font-medium">{isAr ? 'لا توجد طلبات بعد' : 'Aucune commande pour le moment'}</p>
            </div>
          ) : (
            recentOrders.map((order, idx) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-[2rem] border border-emerald-950/5 flex flex-wrap items-center justify-between gap-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-xl bg-neutral-50 flex items-center justify-center text-emerald-900/20">
                    <Package size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#C9A84C] mb-0.5">{order.order_number}</p>
                    <p className="font-serif text-lg text-gray-900 font-bold italic">
                      {new Date(order.created_at).toLocaleDateString(isAr ? 'ar-DZ' : 'fr-FR', { day: 'numeric', month: 'long' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{isAr ? 'المجموع' : 'Total'}</p>
                    <p className="font-bold text-gray-900">{(Number(order.total_amount) || 0).toLocaleString()} <span className="text-[10px] opacity-40">DZD</span></p>
                  </div>
                  <div className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${
                    order.order_status === 'delivered' ? 'bg-emerald-50 text-emerald-600' : 
                    order.order_status === 'cancelled' ? 'bg-rose-50 text-rose-600' :
                    'bg-amber-50 text-amber-700'
                  }`}>
                    {getOrderStatusLabel(order.order_status, language)}
                  </div>
                  <Link href={`/account/orders/${order.id}`}>
                    <button className="p-3 bg-neutral-50 rounded-xl text-emerald-950 hover:bg-emerald-950 hover:text-white transition-all">
                      <ChevronRight size={18} />
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
