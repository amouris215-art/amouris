'use client'

import { useMemo, useState } from 'react'
import { TrendingUp, Pipette, Loader2, Package, Users, ShoppingBag, CreditCard, AlertTriangle, Clock } from 'lucide-react'
import { 
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart as RePieChart, 
  Pie, 
  Cell 
} from 'recharts'
import { useI18n } from '@/i18n/i18n-context'

type TimeFilter = 'today' | '7d' | '30d' | '90d' | 'all'

interface AnalyticsClientProps {
  initialOrders: any[]
  initialCustomers: any[]
  initialProducts: any[]
}

export default function AnalyticsClient({ initialOrders, initialCustomers, initialProducts }: AnalyticsClientProps) {
  const { t, dir } = useI18n()
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('30d')

  // Computed Stats
  const stats = useMemo(() => {
    const orders = initialOrders || []
    const products = initialProducts || []
    const customers = initialCustomers || []

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Filter helper
    const filterByDate = (dateStr: string, filter: TimeFilter) => {
      const date = new Date(dateStr);
      if (filter === 'all') return true;
      if (filter === 'today') return date >= startOfToday;
      
      const days = filter === '7d' ? 7 : filter === '30d' ? 30 : 90;
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      return date >= cutoff;
    };

    const filteredOrders = orders.filter(o => filterByDate(o.created_at, timeFilter));

    // 1. SALES STATS
    const totalRevenue = filteredOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    const totalOrdersCount = filteredOrders.length;
    const averageOrderValue = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;

    // Specific period revenues
    const revenueToday = orders
      .filter(o => filterByDate(o.created_at, 'today'))
      .reduce((sum, o) => sum + (o.total_amount || 0), 0);
    
    const revenue7d = orders
      .filter(o => filterByDate(o.created_at, '7d'))
      .reduce((sum, o) => sum + (o.total_amount || 0), 0);

    const revenue30d = orders
      .filter(o => filterByDate(o.created_at, '30d'))
      .reduce((sum, o) => sum + (o.total_amount || 0), 0);
    
    const revenueAll = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);

    // 30 Days Trend Chart
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      return {
        date: d.toISOString().split('T')[0],
        label: d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
        amount: 0
      };
    });

    orders.forEach(o => {
      const dateStr = o.created_at.split('T')[0];
      const entry = last30Days.find(d => d.date === dateStr);
      if (entry) entry.amount += (o.total_amount || 0);
    });

    // 2. PRODUCT STATS
    const productStatsMap = new Map<string, { units: number, revenue: number, name: string, type: 'perfume' | 'flacon' | 'accessory' }>();
    
    filteredOrders.forEach(o => {
      (o.items || []).forEach((item: any) => {
        const productId = item.product_id;
        const existing = productStatsMap.get(productId) || { units: 0, revenue: 0, name: item.product_name_fr || 'Produit', type: item.product_type };
        const quantity = item.quantity_grams || item.quantity_units || 0;
        productStatsMap.set(productId, {
          units: existing.units + quantity,
          revenue: existing.revenue + (item.total_price || 0),
          name: existing.name,
          type: existing.type
        });
      });
    });

    const productStatsList = Array.from(productStatsMap.values());
    const topProductsByVolume = [...productStatsList].sort((a, b) => b.units - a.units).slice(0, 10);
    const topProductsByRevenue = [...productStatsList].sort((a, b) => b.revenue - a.revenue).slice(0, 10);

    // Stock Alerts
    const lowStockProducts = products.filter((p: any) => {
      if (p.product_type === 'perfume') return (p.stock_grams || 0) < 500;
      return (p.variants || []).some((v: any) => (v.stock_units || 0) < 10);
    }).slice(0, 10);

    // Category Distribution (Revenue)
    let perfumeRevenue = 0;
    let otherRevenue = 0;
    productStatsList.forEach(p => {
      if (p.type === 'perfume') perfumeRevenue += p.revenue;
      else otherRevenue += p.revenue;
    });

    const salesByCategory = [
      { name: t('admin.analytics.perfumes'), value: perfumeRevenue },
      { name: t('admin.analytics.others'), value: otherRevenue }
    ];

    // 3. CUSTOMER STATS
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const newCustomersThisMonth = customers.filter(c => new Date(c.created_at) >= startOfThisMonth).length;

    const customerMap = new Map<string, any>();
    customers.forEach(c => {
      if (c.id) customerMap.set(c.id, c);
    });

    // Calculate actual spent per customer from orders
    const customerSpentMap = new Map<string, any>();
    orders.forEach(o => {
      const cid = o.customer_id || o.guest_email || o.guest_phone || `guest-${o.id}`;
      
      const realCustomer = o.customer_id ? customerMap.get(o.customer_id) : null;

      const firstName = realCustomer?.first_name || o.guest_first_name || 'Client';
      const lastName = realCustomer?.last_name || o.guest_last_name || '';
      const shopName = realCustomer?.shop_name || '';
      const wilaya = realCustomer?.wilaya || o.guest_wilaya || 'Inconnue';

      const fullName = `${firstName} ${lastName}`.trim();

      const existing = customerSpentMap.get(cid) || { 
        id: cid, 
        name: fullName,
        first_name: firstName,
        last_name: lastName,
        shop_name: shopName,
        wilaya: wilaya, 
        spent: 0, 
        count: 0
      };

      customerSpentMap.set(cid, {
        ...existing,
        spent: existing.spent + (o.total_amount || 0),
        count: existing.count + 1
      });
    });

    const enrichedCustomers = Array.from(customerSpentMap.values());
    const topCustomersBySpent = [...enrichedCustomers].sort((a, b) => b.spent - a.spent).slice(0, 5);
    const topCustomersByActivity = [...enrichedCustomers].sort((a, b) => b.count - a.count).slice(0, 5);

    // Wilaya Distribution
    const wilayaMap = new Map<string, number>();
    customers.forEach(c => {
      const w = c.wilaya || 'Inconnue';
      wilayaMap.set(w, (wilayaMap.get(w) || 0) + 1);
    });
    const wilayaData = Array.from(wilayaMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 15);

    // 4. ORDER STATS
    const statusMap = new Map<string, number>();
    const paymentMap = new Map<string, number>();
    
    filteredOrders.forEach(o => {
      statusMap.set(o.order_status, (statusMap.get(o.order_status) || 0) + 1);
      paymentMap.set(o.payment_status, (paymentMap.get(o.payment_status) || 0) + 1);
    });

    const statusData = Array.from(statusMap.entries()).map(([name, value]) => ({ name: t(`status.${name}`), value }));
    const paymentData = Array.from(paymentMap.entries()).map(([name, value]) => ({ name: t(`status.${name}`), value }));
    const pendingOrders = orders.filter(o => o.order_status === 'pending').slice(0, 5);

    return {
      sales: {
        totalRevenue,
        totalOrdersCount,
        averageOrderValue,
        revenueToday,
        revenue7d,
        revenue30d,
        revenueAll,
        trend: last30Days
      },
      products: {
        topByVolume: topProductsByVolume,
        topByRevenue: topProductsByRevenue,
        lowStock: lowStockProducts,
        categoryDist: salesByCategory
      },
      customers: {
        newThisMonth: newCustomersThisMonth,
        topSpent: topCustomersBySpent,
        topActivity: topCustomersByActivity,
        wilayaDist: wilayaData
      },
      orders: {
        statusDist: statusData,
        paymentDist: paymentData,
        pending: pendingOrders
      }
    };
  }, [initialOrders, initialProducts, initialCustomers, timeFilter, t]);

  const COLORS = ['#064e3b', '#C9A84C', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

  const formatDZD = (val: number) => `${Math.round(val).toLocaleString()} ${t('common.dzd')}`;

  return (
    <div className="space-y-12 pb-20 font-sans" dir={dir}>
      {/* Header & Filters */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className={dir === 'rtl' ? 'text-right' : ''}>
          <h1 className="text-4xl font-black font-serif text-emerald-950 flex items-center gap-4 italic font-bold">
            <TrendingUp size={36} className="text-[#C9A84C]" />
            {t('admin.analytics.title')}
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-950/40 mt-2">{t('admin.analytics.subtitle')}</p>
        </div>

        <div className="flex flex-wrap gap-2 p-1.5 bg-emerald-950/5 rounded-2xl w-fit" dir="ltr">
          {(['today', '7d', '30d', '90d', 'all'] as TimeFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setTimeFilter(f)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                timeFilter === f 
                  ? 'bg-emerald-900 text-white shadow-lg shadow-emerald-900/20' 
                  : 'text-emerald-900/40 hover:text-emerald-900 hover:bg-white'
              }`}
            >
              {t(`admin.analytics.filter_${f}`)}
            </button>
          ))}
        </div>
      </header>

      {/* 1. VENTES SECTION */}
      <section className="space-y-8">
        <div className={`flex items-center gap-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-900">
            <ShoppingBag size={24} />
          </div>
          <div className={dir === 'rtl' ? 'text-right' : ''}>
            <h2 className="text-2xl font-bold text-emerald-950 font-serif mb-1">{t('admin.analytics.sales_title')}</h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-950/30">{t('admin.analytics.sales_subtitle')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: t('admin.analytics.kpi_revenue_period'), value: formatDZD(stats.sales.totalRevenue), sub: t('admin.analytics.kpi_revenue_period_sub', { count: stats.sales.totalOrdersCount }) },
            { label: t('admin.analytics.kpi_avg_order'), value: formatDZD(stats.sales.averageOrderValue), sub: t('admin.analytics.kpi_avg_order_sub') },
            { label: t('admin.analytics.kpi_revenue_today'), value: formatDZD(stats.sales.revenueToday), sub: t('admin.analytics.kpi_revenue_today_sub') },
            { label: t('admin.analytics.kpi_revenue_total'), value: formatDZD(stats.sales.revenueAll), sub: t('admin.analytics.kpi_revenue_total_sub') },
          ].map((kpi, idx) => (
            <div key={idx} className={`bg-white p-6 rounded-[2rem] border border-emerald-950/5 shadow-sm ${dir === 'rtl' ? 'text-right' : ''}`}>
              <div className="text-[10px] uppercase font-black tracking-widest text-emerald-950/30 mb-2">{kpi.label}</div>
              <div className="text-2xl font-black text-emerald-950 mb-1">{kpi.value}</div>
              <div className="text-[10px] font-bold text-emerald-900/60">{kpi.sub}</div>
            </div>
          ))}
        </div>

        <div className="bg-white p-8 rounded-[3rem] border border-emerald-950/5 shadow-sm">
          <div className={`flex items-center justify-between mb-8 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <h3 className="text-lg font-bold text-emerald-950 font-serif">{t('admin.analytics.revenue_evolution')}</h3>
            <div className={`flex items-center gap-2 text-[10px] font-black text-emerald-900/40 uppercase ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <div className="w-3 h-3 rounded-full bg-emerald-900" /> {t('admin.analytics.sales_in_dzd')}
            </div>
          </div>
          <div className="h-[350px] w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.sales.trend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ecfdf5" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: '#064e3b', opacity: 0.4 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: '#064e3b', opacity: 0.4 }} dx={-10} tickFormatter={(val) => `${val / 1000}k`} orientation={dir === 'rtl' ? 'right' : 'left'} />
                <Tooltip 
                  contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  formatter={(val: any) => [formatDZD(Number(val)), t('admin.analytics.sales_in_dzd')]}
                />
                <Line type="monotone" dataKey="amount" stroke="#064e3b" strokeWidth={4} dot={{ r: 4, fill: '#C9A84C', strokeWidth: 0 }} activeDot={{ r: 8, fill: '#064e3b' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* 2. PRODUITS SECTION */}
      <section className="space-y-8">
        <div className={`flex items-center gap-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Package size={24} />
          </div>
          <div className={dir === 'rtl' ? 'text-right' : ''}>
            <h2 className="text-2xl font-bold text-emerald-950 font-serif mb-1">{t('admin.analytics.products_title')}</h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-950/30">{t('admin.analytics.products_subtitle')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top 10 Lists */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[3rem] border border-emerald-950/5 shadow-sm">
              <h3 className={`text-lg font-bold text-emerald-950 font-serif mb-6 flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse justify-start' : ''}`}>
                <TrendingUp size={18} className="text-emerald-600" /> {t('admin.analytics.top_volume')}
              </h3>
              <div className="space-y-4">
                {stats.products.topByVolume.map((p, i) => (
                  <div key={i} className={`flex items-center justify-between group ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <span className="w-6 text-[10px] font-black text-emerald-950/20">{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-sm font-bold text-emerald-950 group-hover:text-emerald-700 transition-colors uppercase">{p.name}</span>
                    </div>
                    <span className="text-[10px] font-black bg-emerald-50 text-emerald-900 px-3 py-1 rounded-lg">
                      {p.units.toLocaleString()} {p.type === 'perfume' ? 'g' : t('common.units').toLowerCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-[3rem] border border-emerald-950/5 shadow-sm">
              <h3 className={`text-lg font-bold text-emerald-950 font-serif mb-6 flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse justify-start' : ''}`}>
                <CreditCard size={18} className="text-emerald-600" /> {t('admin.analytics.top_revenue')}
              </h3>
              <div className="space-y-4">
                {stats.products.topByRevenue.map((p, i) => (
                  <div key={i} className={`flex items-center justify-between group ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <span className="w-6 text-[10px] font-black text-emerald-950/20">{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-sm font-bold text-emerald-950 group-hover:text-emerald-700 transition-colors uppercase">{p.name}</span>
                    </div>
                    <span className="text-[10px] font-black bg-emerald-950 text-white px-3 py-1 rounded-lg">
                      {formatDZD(p.revenue)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
             {/* Category Distribution Chart */}
             <div className="bg-white p-8 rounded-[3rem] border border-emerald-950/5 shadow-sm">
                <h3 className={`text-lg font-bold text-emerald-950 font-serif mb-2 ${dir === 'rtl' ? 'text-right' : ''}`}>{t('admin.analytics.sales_split')}</h3>
                <p className={`text-[10px] font-black uppercase text-emerald-950/30 mb-8 ${dir === 'rtl' ? 'text-right' : ''}`}>{t('admin.analytics.sales_split_sub')}</p>
                <div className="h-[250px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie data={stats.products.categoryDist} innerRadius={60} outerRadius={80} paddingAngle={10} dataKey="value" stroke="none">
                        {stats.products.categoryDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(val: any) => formatDZD(Number(val))} />
                    </RePieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                     <span className="text-2xl font-black text-emerald-950 font-serif">
                       {stats.products.categoryDist[0].value + stats.products.categoryDist[1].value > 0 
                         ? Math.round((stats.products.categoryDist[0].value / (stats.products.categoryDist[0].value + stats.products.categoryDist[1].value)) * 100)
                         : 0}%
                     </span>
                     <span className="text-[8px] font-black uppercase text-emerald-950/30">{t('admin.analytics.perfumes')}</span>
                  </div>
                </div>
                <div className={`flex justify-center gap-8 mt-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                   {stats.products.categoryDist.map((c, i) => (
                     <div key={i} className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                        <span className="text-[10px] font-black text-emerald-950/60 uppercase">{c.name}</span>
                     </div>
                   ))}
                </div>
             </div>

             {/* Low Stock Alerts */}
             <div className="bg-rose-50 p-8 rounded-[3rem] border border-rose-200 shadow-sm">
                <h3 className={`text-lg font-bold text-rose-950 font-serif mb-6 flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse justify-start' : ''}`}>
                  <AlertTriangle size={18} className="text-rose-600" /> {t('admin.analytics.low_stock_alerts')}
                </h3>
                <div className="space-y-3">
                  {stats.products.lowStock.length > 0 ? stats.products.lowStock.map((p, i) => (
                    <div key={i} className={`bg-white/50 p-3 rounded-xl flex items-center justify-between border border-rose-100 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                       <span className={`text-[10px] font-bold text-rose-950 uppercase truncate max-w-[200px] ${dir === 'rtl' ? 'text-right' : ''}`}>{p.name_fr}</span>
                       <span className="text-[10px] font-black text-rose-600">
                         {p.product_type === 'perfume' ? t('admin.analytics.remaining_g', { count: p.stock_grams }) : t('admin.analytics.multi_variant_low')}
                       </span>
                    </div>
                  )) : (
                    <p className="text-[10px] font-black text-emerald-900/40 uppercase text-center py-4">{t('admin.analytics.no_alerts')}</p>
                  )}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 3. CLIENTS SECTION */}
      <section className="space-y-8">
        <div className={`flex items-center gap-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Users size={24} />
          </div>
          <div className={dir === 'rtl' ? 'text-right' : ''}>
            <h2 className="text-2xl font-bold text-emerald-950 font-serif mb-1">{t('admin.analytics.customers_insights')}</h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-950/30">{t('admin.analytics.customers_subtitle')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* New Clients KPI */}
           <div className="lg:col-span-1 space-y-6">
              <div className="bg-emerald-900 text-white p-8 rounded-[3rem] shadow-xl shadow-emerald-900/20 relative overflow-hidden">
                <Users className={`absolute ${dir === 'rtl' ? '-left-8' : '-right-8'} -bottom-8 w-40 h-40 opacity-10`} />
                <div className={`relative z-10 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  <h3 className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-4">{t('admin.analytics.new_this_month')}</h3>
                  <div className="text-6xl font-black mb-2">{stats.customers.newThisMonth}</div>
                  <p className="text-emerald-200 text-[10px] font-bold italic">{t('admin.analytics.new_this_month_sub')}</p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[3rem] border border-emerald-950/5 shadow-sm">
                <h3 className={`text-lg font-bold text-emerald-950 font-serif mb-6 ${dir === 'rtl' ? 'text-right' : ''}`}>{t('admin.analytics.active_customers')}</h3>
                <div className="space-y-4">
                   {stats.customers.topActivity.map((c, i) => (
                     <div key={i} className={`flex items-center justify-between ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                        <div className={`flex flex-col ${dir === 'rtl' ? 'items-end' : ''}`}>
                           <span className={`text-xs font-bold text-emerald-950 uppercase ${dir === 'rtl' ? 'text-right' : ''}`}>{c.name}</span>
                           <span className={`text-[8px] font-black text-emerald-950/30 uppercase ${dir === 'rtl' ? 'text-right' : ''}`}>{c.shop_name || t('admin.analytics.no_shop')}</span>
                        </div>
                        <div className="bg-emerald-50 text-emerald-900 px-3 py-1 rounded-lg text-[10px] font-black">
                           {t('admin.analytics.orders_count', { count: c.count || 0 })}
                        </div>
                     </div>
                   ))}
                </div>
              </div>
           </div>

           {/* Wilaya & VIPs */}
           <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-8 rounded-[3rem] border border-emerald-950/5 shadow-sm">
                 <h3 className={`text-lg font-bold text-emerald-950 font-serif mb-8 flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse justify-start' : ''}`}>
                   <TrendingUp size={18} className="text-emerald-600" /> {t('admin.analytics.wilaya_split')}
                 </h3>
                 <div className="h-[250px] w-full" dir="ltr">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.customers.wilayaDist}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 8, fontWeight: 900, fill: '#064e3b', opacity: 0.5 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 8, fontWeight: 900, fill: '#064e3b', opacity: 0.5 }} orientation={dir === 'rtl' ? 'right' : 'left'} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#064e3b" radius={[4, 4, 0, 0]} barSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                 </div>
              </div>

              <div className="bg-[#C9A84C] text-emerald-950 p-8 rounded-[3rem] shadow-lg shadow-amber-900/10">
                <h3 className={`text-emerald-950/60 text-[10px] font-black uppercase tracking-widest mb-6 ${dir === 'rtl' ? 'text-right' : ''}`}>{t('admin.analytics.vip_customers')}</h3>
                <div className="space-y-4">
                   {stats.customers.topSpent.map((c, i) => {
                     const initials = c.name ? c.name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'CL';
                     return (
                       <div key={i} className={`flex items-center justify-between bg-white/30 p-4 rounded-2xl border border-white/40 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                          <div className={`flex items-center gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                             <div className="w-8 h-8 rounded-full bg-emerald-900 text-[#C9A84C] flex items-center justify-center font-black text-xs">
                               {initials.toUpperCase()}
                             </div>
                             <div className={`flex flex-col ${dir === 'rtl' ? 'items-end' : ''}`}>
                                <span className={`text-sm font-black uppercase text-emerald-950 ${dir === 'rtl' ? 'text-right' : ''}`}>{c.name}</span>
                                <span className={`text-[8px] font-black opacity-80 text-emerald-900 ${dir === 'rtl' ? 'text-right' : ''}`}>{c.wilaya || 'Inconnue'}</span>
                             </div>
                          </div>
                          <span className="text-xs font-black text-emerald-950">{formatDZD(c.spent || 0)}</span>
                       </div>
                     );
                   })}
                </div>
              </div>
           </div>
        </div>
      </section>

      {/* 4. COMMANDES SECTION */}
      <section className="space-y-8">
        <div className={`flex items-center gap-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600">
            <Clock size={24} />
          </div>
          <div className={dir === 'rtl' ? 'text-right' : ''}>
            <h2 className="text-2xl font-bold text-emerald-950 font-serif mb-1">{t('admin.analytics.order_flow')}</h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-950/30">{t('admin.analytics.order_flow_subtitle')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-[3rem] border border-emerald-950/5 shadow-sm">
             <h3 className={`text-lg font-bold text-emerald-950 font-serif mb-8 ${dir === 'rtl' ? 'text-right' : ''}`}>{t('admin.analytics.order_status_dist')}</h3>
             <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie data={stats.orders.statusDist} dataKey="value" nameKey="name" outerRadius={100} paddingAngle={5} stroke="none">
                      {stats.orders.statusDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </RePieChart>
                </ResponsiveContainer>
             </div>
             <div className={`flex flex-wrap gap-4 justify-center mt-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                {stats.orders.statusDist.map((s, i) => (
                  <div key={i} className={`flex items-center gap-1.5 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                     <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                     <span className="text-[8px] font-black uppercase text-emerald-950/40">{s.name} ({s.value})</span>
                  </div>
                ))}
             </div>
          </div>

          <div className="bg-white p-8 rounded-[3rem] border border-emerald-950/5 shadow-sm">
             <h3 className={`text-lg font-bold text-emerald-950 font-serif mb-8 ${dir === 'rtl' ? 'text-right' : ''}`}>{t('admin.analytics.payment_status_dist')}</h3>
             <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie data={stats.orders.paymentDist} dataKey="value" nameKey="name" outerRadius={100} label={({name, percent}) => `${name} ${((percent || 0) * 100).toFixed(0)}%`} stroke="none">
                       <Cell fill="#064e3b" />
                       <Cell fill="#C9A84C" />
                       <Cell fill="#ef4444" />
                    </Pie>
                    <Tooltip />
                  </RePieChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="bg-amber-50 p-8 rounded-[3rem] border border-amber-200 shadow-sm font-sans">
             <h3 className={`text-lg font-bold text-amber-950 font-serif mb-6 flex items-center justify-between italic ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
               {t('admin.analytics.pending_list')}
               <span className="bg-amber-500 text-white px-2 py-0.5 rounded text-[8px] font-black uppercase">{stats.orders.pending.length}</span>
             </h3>
             <div className="space-y-4">
                {stats.orders.pending.map((o, i) => (
                  <div key={i} className={`bg-white p-4 rounded-2xl border border-amber-200 shadow-sm flex flex-col gap-1 ${dir === 'rtl' ? 'text-right' : ''}`}>
                     <div className={`flex justify-between items-center text-[10px] font-black text-emerald-950 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                        <span>CMD #{o.order_number}</span>
                        <span>{formatDZD(o.total_amount)}</span>
                     </div>
                     <span className="text-[8px] font-bold text-emerald-900/60 uppercase">
                        {o.guest_first_name} {o.guest_last_name} • {new Date(o.created_at).toLocaleDateString()}
                     </span>
                  </div>
                ))}
                {stats.orders.pending.length === 0 && (
                  <p className="text-[10px] font-black text-emerald-900/40 uppercase text-center py-8">{t('admin.analytics.all_up_to_date')}</p>
                )}
             </div>
          </div>
        </div>
      </section>
    </div>
  )
}
