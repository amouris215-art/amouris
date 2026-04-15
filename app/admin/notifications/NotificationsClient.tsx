"use client";

import { useI18n } from '@/i18n/i18n-context';
import { ShoppingBag, Bell, Clock, Package, AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Badge } from '@/components/ui/badge';

interface NotificationsClientProps {
  initialOrders: any[];
  lowStockPerfumes: any[];
  lowStockVariants: any[];
}

export default function NotificationsClient({ initialOrders, lowStockPerfumes, lowStockVariants }: NotificationsClientProps) {
  const { t, dir, language } = useI18n();
  const [notifications, setNotifications] = useState<any[]>([]);
  const supabase = createClient();

  const processNotifications = (orders: any[], perfumes: any[], variants: any[]) => {
    const list: any[] = [];

    orders.forEach(o => list.push({
      type: 'order',
      id: o.id,
      title: o.guest_first_name ? `${o.guest_first_name} ${o.guest_last_name}` : t('admin.notifications.order_label', { number: o.order_number }),
      subtitle: `${o.order_number} • ${o.total_amount.toLocaleString()} DZD`,
      date: o.created_at,
      status: o.order_status,
      link: `/admin/orders/${o.id}`
    }));

    perfumes.forEach(p => list.push({
      type: 'stock',
      id: p.id,
      title: t('admin.notifications.stock_low_label', { name: p.name_fr }),
      subtitle: t('admin.notifications.grams_remaining', { count: p.stock_grams }),
      date: new Date().toISOString(),
      link: `/admin/products`
    }));

    variants.forEach(v => list.push({
      type: 'stock',
      id: v.id,
      title: t('admin.notifications.stock_low_label', { name: v.products?.name_fr }),
      subtitle: t('admin.notifications.variant_stock_info', { size: v.size_ml, color: v.color_name, count: v.stock_units }),
      date: new Date().toISOString(),
      link: `/admin/products`
    }));

    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  useEffect(() => {
    setNotifications(processNotifications(initialOrders, lowStockPerfumes, lowStockVariants));

    // Real-time subscription for orders
    const channel = supabase
      .channel('admin-notifications-page')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        async (payload) => {
          // Re-fetch all or update local state. For simplicity in notifications, we can re-fetch or just add new ones.
          // Here we'll just refresh to keep it simple and consistent.
          const { data: latestOrders } = await supabase
            .from('orders')
            .select('id, order_number, created_at, guest_first_name, guest_last_name, total_amount, order_status')
            .order('created_at', { ascending: false })
            .limit(20);
          
          if (latestOrders) {
            setNotifications(processNotifications(latestOrders, lowStockPerfumes, lowStockVariants));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [initialOrders, lowStockPerfumes, lowStockVariants]);

  return (
    <div className="space-y-8" dir={dir}>
      <div className={dir === 'rtl' ? 'text-right' : ''}>
        <h1 className="text-3xl font-black text-emerald-950 font-serif mb-2">
          {t('admin.notifications.title')}
        </h1>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600">
          {t('admin.notifications.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {notifications.length > 0 ? (
          notifications.map((notif, idx) => (
            <Link 
              key={`${notif.id}-${idx}`} 
              href={notif.link}
              className={`bg-white p-6 rounded-[2rem] border border-emerald-950/5 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all flex items-center justify-between group ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`flex items-center gap-6 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${notif.type === 'order' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                  {notif.type === 'order' ? <ShoppingBag size={24} /> : <AlertTriangle size={24} />}
                </div>
                <div className="space-y-1">
                  <div className={`flex items-center gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <h3 className="font-bold text-emerald-950">{notif.title}</h3>
                    {notif.status && (
                      <Badge variant="outline" className="text-[9px] uppercase tracking-widest font-black">
                        {notif.status}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-emerald-950/40">{notif.subtitle}</p>
                </div>
              </div>
              
              <div className={`flex items-center gap-8 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <div className={dir === 'rtl' ? 'text-left' : 'text-right'}>
                  <p className={`text-[10px] font-black uppercase tracking-widest text-emerald-950/20 flex items-center gap-1 ${dir === 'rtl' ? 'justify-start' : 'justify-end'}`}>
                    <Clock size={12} /> {new Date(notif.date).toLocaleDateString(language === 'ar' ? 'ar-DZ' : 'fr-FR')}
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-950/20 italic">
                    {new Date(notif.date).toLocaleTimeString(language === 'ar' ? 'ar-DZ' : 'fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full border border-emerald-950/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight size={18} className={`text-emerald-950 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="py-20 text-center bg-white rounded-[2rem] border border-emerald-950/5">
            <Bell size={48} className="mx-auto text-emerald-100 mb-4" />
            <p className="text-lg font-serif text-emerald-950/20 italic">
              {t('admin.notifications.no_notifications')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
