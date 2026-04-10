import { 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Package, 
  AlertTriangle, 
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // 1. Check Auth & Admin Role
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/')

  // 2. Fetch Aggregates & Data in Parallel
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const [
    { count: productsCount },
    { count: ordersCount },
    { count: customersCount },
    { data: recentOrders },
    { data: newestCustomers },
    { data: monthlyOrders },
    { data: settings },
    { data: allProducts }
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
    supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('profiles').select('*').eq('role', 'customer').order('created_at', { ascending: false }).limit(3),
    supabase.from('orders').select('total_amount').gte('created_at', firstDayOfMonth),
    supabase.from('settings').select('*').limit(1).maybeSingle(),
    supabase.from('products').select('*, flacon_variants(*)').eq('status', 'active')
  ])

  // 3. Process Logic
  const monthlyRevenue = monthlyOrders?.reduce((acc, o) => acc + (o.total_amount || 0), 0) || 0
  const thresholdPerfume = settings?.free_shipping_threshold || 1000 // use correct column name from DB if different, but instructions say alertStockPerfume in store. 
  // Wait, let's check settings columns in previous scripts. 
  // In initial-data.ts it was alert_stock_perfume.
  const alertPerfume = settings?.alert_stock_perfume || 1000
  const alertFlacon = settings?.alert_stock_flacon || 20

  const lowStockProducts = (allProducts || []).filter(p => {
    if (p.product_type === 'perfume') {
      return (p.stock_grams || 0) < alertPerfume
    } else {
      return p.flacon_variants?.some((v: any) => v.stock_units < alertFlacon)
    }
  }).slice(0, 5)

  const stats = [
    { label: 'Produits actifs', value: productsCount || 0, icon: Package, color: 'bg-emerald-50 text-emerald-700' },
    { label: 'Commandes totales', value: ordersCount || 0, icon: ShoppingBag, color: 'bg-blue-50 text-blue-700' },
    { label: 'Clients inscrits', value: customersCount || 0, icon: Users, color: 'bg-purple-50 text-purple-700' },
    { label: 'Revenu du mois', value: `${monthlyRevenue.toLocaleString()} DZD`, icon: TrendingUp, color: 'bg-amber-50 text-amber-700' },
  ]

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 font-serif tracking-tight">Vue d&apos;ensemble</h1>
          <p className="text-gray-500 text-sm mt-2 font-medium">B2B Dashboard — {user.email}</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
            <Link href="/admin/orders" className="flex-1 md:flex-none text-center text-[10px] font-black bg-white px-6 py-4 border border-emerald-50 rounded-2xl shadow-sm hover:bg-emerald-50 transition-all uppercase tracking-widest">Commandes</Link>
            <Link href="/admin/products" className="flex-1 md:flex-none text-center text-[10px] font-black bg-emerald-950 text-white px-6 py-4 rounded-2xl shadow-xl shadow-emerald-900/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest">Produits</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-[2.5rem] border border-emerald-50 p-8 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all group overflow-hidden relative">
            <div className={`absolute -right-4 -top-4 p-12 opacity-[0.03] group-hover:scale-110 transition-transform ${color.split(' ')[1]}`}>
                <Icon size={120} />
            </div>
            <div className={`inline-flex p-4 rounded-2xl ${color} mb-6 transition-transform group-hover:scale-110 relative z-10`}>
              <Icon size={24} />
            </div>
            <div className="text-2xl font-semibold text-gray-900 font-sans tracking-tight relative z-10">{value}</div>
            <div className="text-sm font-medium text-gray-500 mt-2 relative z-10">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-emerald-50 overflow-hidden shadow-sm">
              <div className="p-8 border-b border-emerald-50 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-emerald-950 font-serif">Dernières commandes</h2>
                  <Link href="/admin/orders" className="text-xs font-black text-amber-600 hover:text-amber-500 flex items-center gap-2 uppercase tracking-widest">
                      Tout voir <ArrowRight size={14} />
                  </Link>
              </div>
              <div className="divide-y divide-emerald-50">
                  {recentOrders && recentOrders.length > 0 ? (
                      recentOrders.map(order => {
                          const name = order.guest_first_name
                            ? `${order.guest_first_name} ${order.guest_last_name}`
                            : (order.customer_id ? `Client #${order.customer_id.slice(0, 6)}` : 'Client');
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
                                        <p className="text-sm font-black text-emerald-900">{order.total_amount.toLocaleString()} <span className="text-[10px] font-normal">DZD</span></p>
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

          <div className="bg-white rounded-[2.5rem] border border-rose-50 overflow-hidden shadow-sm">
            <div className="p-8 border-b border-rose-50 flex items-center justify-between bg-rose-50/30">
                <div className="flex items-center gap-3">
                  <AlertTriangle size={20} className="text-rose-600" />
                  <h2 className="text-xl font-bold text-rose-950 font-serif">Alertes Stock Bas</h2>
                </div>
                <Link href="/admin/inventory" className="text-xs font-black text-rose-600 hover:text-rose-500 flex items-center gap-2 uppercase tracking-widest">
                    Gérer Inventaire <ArrowRight size={14} />
                </Link>
            </div>
            <div className="divide-y divide-rose-50">
                {lowStockProducts.length > 0 ? (
                  lowStockProducts.map(product => (
                    <div key={product.id} className="flex items-center justify-between p-8 hover:bg-rose-50/20 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-900 font-bold group-hover:bg-rose-900 group-hover:text-white transition-colors overflow-hidden">
                          {product.images?.[0] ? <img src={product.images[0]} alt="" className="w-full h-full object-cover" /> : <Package size={20} />}
                        </div>
                        <div>
                          <p className="font-bold text-emerald-950 text-sm">{product.name_fr}</p>
                          <p className="text-[10px] uppercase font-black text-rose-600 tracking-widest">
                            {product.product_type === 'perfume' 
                              ? `${product.stock_grams}g restants` 
                              : `Variantes en rupture`}
                          </p>
                        </div>
                      </div>
                      <Link href={`/admin/products?edit=${product.id}`} className="p-3 bg-white border border-rose-100 rounded-xl text-rose-400 hover:text-rose-700 hover:border-rose-300 transition-all">
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center text-emerald-950/20 font-serif text-lg italic bg-emerald-50/10">Tous les stocks sont OK</div>
                )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-emerald-50 p-8 shadow-sm">
              <h2 className="text-xl font-bold text-emerald-950 font-serif mb-8 flex items-center justify-between">
                <span>Nouveaux Clients</span>
                <span className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-900 text-[10px] flex items-center justify-center font-black">{customersCount || 0}</span>
              </h2>
              <div className="space-y-6">
                  {newestCustomers?.map(customer => (
                      <div key={customer.id} className="flex items-center gap-4 group">
                          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-700 font-bold group-hover:bg-amber-950 group-hover:text-white group-hover:rotate-6 transition-all">
                              {(customer.first_name || customer.phone || '?').charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                               <p className="text-sm font-bold text-emerald-950 truncate">{customer.first_name} {customer.last_name}</p>
                              <p className="text-[10px] text-emerald-950/30 uppercase tracking-widest font-black">{customer.wilaya}</p>
                          </div>
                          <Link href={`/admin/customers/${customer.id}`} className="text-emerald-900/10 hover:text-emerald-900 transition-colors">
                              <ArrowRight size={16} />
                          </Link>
                      </div>
                  ))}
                  {(!newestCustomers || newestCustomers.length === 0) && (
                    <p className="text-center text-emerald-950/20 py-10 italic">Aucun client inscrit</p>
                  )}
              </div>
              {(customersCount || 0) > 3 && (
                <Link href="/admin/customers" className="mt-8 block text-center py-4 border-t border-emerald-50 text-[10px] font-black uppercase tracking-widest text-emerald-950/40 hover:text-emerald-950 transition-colors">
                  Voir tous les clients
                </Link>
              )}
          </div>
          
          <div className="bg-[#0a3d2e] rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-120 transition-transform duration-1000">
              <TrendingUp size={240} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-2">Total Revenu</p>
            <h3 className="text-4xl font-black font-sans tracking-tighter mb-6">{monthlyRevenue.toLocaleString()} <span className="text-sm opacity-50">DZD (Ce mois)</span></h3>
            <div className="h-1 w-12 bg-emerald-400 mb-6 rounded-full" />
            <p className="text-xs text-white/50 leading-relaxed">Revenu cumulé sur le mois en cours.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

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
