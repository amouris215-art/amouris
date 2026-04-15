import { ShoppingBag, Users, TrendingUp, Package, AlertTriangle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    preparing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }
  const labels: Record<string, string> = {
    pending: 'En attente', confirmed: 'Confirmé', preparing: 'En préparation',
    shipped: 'Expédié', delivered: 'Livré', cancelled: 'Annulé',
  }
  return (
    <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest ${map[status] || 'bg-gray-100 text-gray-800'}`}>
      {labels[status] || status}
    </span>
  )
}

export default function AdminDashboardClient({ stats, recentOrders }: { stats: any, recentOrders: any[] }) {
  const statsList = [
    { label: 'Produits actifs', value: stats.totalProducts, icon: Package, color: 'bg-emerald-50 text-emerald-700' },
    { label: 'Commandes totales', value: stats.totalOrders, icon: ShoppingBag, color: 'bg-blue-50 text-blue-700' },
    { label: 'Clients inscrits', value: stats.totalCustomers, icon: Users, color: 'bg-purple-50 text-purple-700' },
    { label: 'Revenu du mois', value: `${stats.totalRevenue.toLocaleString()} DZD`, icon: TrendingUp, color: 'bg-amber-50 text-amber-700' },
  ]

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 md:mb-12">
        <div className="px-1">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 font-serif tracking-tight leading-none leading-tight">{language === 'ar' ? 'نظرة عامة' : 'Vue d\'ensemble'}</h1>
          <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-amber-600 mt-2">{language === 'ar' ? 'بوابة المسؤول' : 'Portail Administrateur'}</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
            <Link href="/admin/orders" className="flex-1 md:flex-none text-center text-[10px] font-black bg-white px-6 py-4 border border-emerald-950/5 rounded-2xl shadow-sm hover:bg-emerald-50 transition-all uppercase tracking-widest">{language === 'ar' ? 'الطلبات' : 'Commandes'}</Link>
            <Link href="/admin/products" className="flex-1 md:flex-none text-center text-[10px] font-black bg-emerald-950 text-white px-6 py-4 rounded-2xl shadow-xl shadow-emerald-900/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest">{language === 'ar' ? 'المنتجات' : 'Produits'}</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statsList.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-emerald-950/5 p-6 md:p-8 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all group overflow-hidden relative">
            <div className={`absolute -right-4 -top-4 p-12 opacity-[0.03] group-hover:scale-110 transition-transform ${color.split(' ')[1]}`}>
                <Icon size={120} />
            </div>
            <div className={`inline-flex p-3 md:p-4 rounded-xl md:rounded-2xl ${color} mb-4 md:mb-6 transition-transform group-hover:scale-110 relative z-10`}>
              <Icon size={20} className="md:w-6 md:h-6" />
            </div>
            <div className="text-xl md:text-2xl font-semibold text-gray-900 font-sans tracking-tight relative z-10">{value}</div>
            <div className="text-[10px] md:text-sm font-medium text-gray-500 mt-1 md:mt-2 relative z-10 uppercase tracking-widest">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-emerald-950/5 overflow-hidden shadow-sm">
              <div className="p-6 md:p-8 border-b border-emerald-950/5 flex items-center justify-between">
                  <h2 className="text-lg md:text-xl font-bold text-emerald-950 font-serif">
                    {language === 'ar' ? 'أحدث الطلبات' : 'Dernières commandes'}
                  </h2>
                  <Link href="/admin/orders" className="text-[10px] font-black text-amber-600 hover:text-amber-500 flex items-center gap-2 uppercase tracking-widest">
                    {language === 'ar' ? 'عرض الكل' : 'Tout voir'} <ArrowRight size={14} className={language === 'ar' ? 'rotate-180' : ''} />
                  </Link>
              </div>
              <div className="divide-y divide-emerald-50">
                  {recentOrders && recentOrders.length > 0 ? (
                      recentOrders.map(order => {
                          const name = order.guest_first_name
                            ? `${order.guest_first_name} ${order.guest_last_name}`
                            : (order.profiles ? `${order.profiles.first_name} ${order.profiles.last_name}` : 'Client Web');
                          return (
                            <div key={order.id} className="flex items-center justify-between p-8 hover:bg-emerald-50/20 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-900 font-bold group-hover:bg-emerald-900 group-hover:text-white transition-colors">
                                        <ShoppingBag size={20} />
                                    </div>
                                    <div>
                                        <p className="font-black text-emerald-950 font-mono text-sm tracking-tight">{order.order_number}</p>
                                        <p className="text-xs text-emerald-950/30 font-medium">{name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-sm font-black text-emerald-900">{order.total_amount?.toLocaleString() || 0} <span className="text-[10px] font-normal">DZD</span></p>
                                        <p className="text-[10px] text-emerald-950/20 font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <StatusBadge status={order.order_status} />
                                </div>
                            </div>
                          );
                      })
                  ) : (
                      <div className="p-12 text-center text-emerald-950/20 font-serif text-lg">Aucune commande pour le moment</div>
                  )}
              </div>
          </div>
        </div>
        <div>
          <div className="bg-[#0a3d2e] rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-120 transition-transform duration-1000">
              <TrendingUp size={240} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-2">Total Revenu Global</p>
            <h3 className="text-4xl font-black font-sans tracking-tighter mb-6">{stats.totalRevenue.toLocaleString()} <span className="text-sm opacity-50">DZD</span></h3>
            <div className="h-1 w-12 bg-emerald-400 mb-6 rounded-full" />
            <p className="text-xs text-white/50 leading-relaxed">Revenu cumulé de toutes les commandes.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
