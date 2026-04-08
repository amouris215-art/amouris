import Link from 'next/link';
import { useI18n } from '@/i18n/i18n-context';
import { Order, Customer } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, CheckCircle2, Clock } from 'lucide-react';
import { getOrderStatusLabel } from '@/lib/status-helpers';

interface AccountOverviewClientProps {
  user: Customer;
  orders: Order[];
}

export default function AccountOverviewClient({ user, orders }: AccountOverviewClientProps) {
  const { t, language } = useI18n();

  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const activeOrdersCount = orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-heading font-bold mb-8">
        {t('account.welcome')}{user.firstName}
      </h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">{t('account.stats.total_orders')}</CardTitle>
             <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">{t('account.stats.total_spent')}</CardTitle>
             <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalSpent.toLocaleString()} {t('common.dzd')}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">{t('account.stats.active_orders')}</CardTitle>
             <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold">{activeOrdersCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-card border rounded-xl overflow-hidden mt-8">
        <div className="flex items-center justify-between p-6 border-b">
           <h2 className="text-xl font-bold">{t('account.recent_orders')}</h2>
           <Link href="/account/orders">
             <Button variant="outline" size="sm">{t('home.view_all')}</Button>
           </Link>
        </div>
        
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right">
            <thead className="text-[10px] uppercase font-black tracking-widest text-muted-foreground bg-secondary/50 border-b">
              <tr>
                <th className="px-6 py-4">{t('account.order_id')}</th>
                <th className="px-6 py-4">{t('account.order_date')}</th>
                <th className="px-6 py-4">{t('account.order_status')}</th>
                <th className="px-6 py-4">{t('account.order_total')}</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map(order => (
                <tr key={order.id} className="border-b last:border-0 hover:bg-muted/50">
                   <td className="px-6 py-4 font-bold font-mono text-emerald-950">{order.orderNumber}</td>
                   <td className="px-6 py-4 text-muted-foreground">{new Date(order.createdAt).toLocaleDateString(language === 'ar' ? 'ar-DZ' : 'fr-FR')}</td>
                   <td className="px-6 py-4">
                     <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                       order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                       order.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                     }`}>
                        {getOrderStatusLabel(order.status, language)}
                     </span>
                   </td>
                   <td className="px-6 py-4 font-bold">{order.total.toLocaleString()} {t('common.dzd')}</td>
                   <td className="px-6 py-4 text-right">
                     <Link href={`/account/orders/${order.id}`}>
                       <Button variant="ghost" size="sm" className="font-bold uppercase tracking-widest text-[10px]">{t('account.view_details')}</Button>
                     </Link>
                   </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                   <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground italic">
                    {t('account.no_orders')}
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
r>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
