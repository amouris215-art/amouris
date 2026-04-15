"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/i18n/i18n-context';
import { useAdminStore } from '@/store/admin-ui.store';
import { 
  LayoutDashboard, Package, Tag, Users, ShoppingCart, 
  FileText, TrendingUp, Settings, Inbox, Menu, Store, Layers, Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AdminSidebar() {
  const pathname = usePathname();
  const { language, dir, t } = useI18n();
  const { sidebarOpen, setSidebarOpen } = useAdminStore();

  const navGroups = [
    {
      title: t('admin.sidebar.catalogue'),
      items: [
        { name: t('admin.sidebar.all_products'), href: '/admin/products', icon: Package },
        { name: t('admin.sidebar.categories'), href: '/admin/categories', icon: Tag },
        { name: t('admin.sidebar.collections'), href: '/admin/collections', icon: Layers },
        { name: t('admin.sidebar.brands'), href: '/admin/brands', icon: Store },
      ]
    },
    {
      title: t('admin.sidebar.ventes'),
      items: [
        { name: t('admin.sidebar.orders'), href: '/admin/orders', icon: ShoppingCart },
        { name: t('admin.sidebar.invoices'), href: '/admin/invoices', icon: FileText },
        { name: t('admin.sidebar.customers'), href: '/admin/customers', icon: Users },
      ]
    },
    {
      title: t('admin.sidebar.inventory'),
      items: [
        { name: t('admin.sidebar.inventory_mgmt'), href: '/admin/inventory', icon: Inbox },
      ]
    },
    {
      title: t('admin.sidebar.system'),
      items: [
        { name: t('admin.sidebar.notifications'), href: '/admin/notifications', icon: Bell },
        { name: t('admin.sidebar.analytics'), href: '/admin/analytics', icon: TrendingUp },
        { name: t('admin.sidebar.reports'), href: '/admin/reports', icon: FileText },
        { name: t('admin.sidebar.settings'), href: '/admin/settings', icon: Settings },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div 
        className={`
          fixed inset-y-0 z-50 w-72 bg-white border-emerald-950/5 shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0
          ${dir === 'rtl' ? 'right-0 border-l' : 'left-0 border-r'}
          ${sidebarOpen 
            ? 'translate-x-0' 
            : dir === 'rtl' ? 'translate-x-[105%]' : '-translate-x-[105%]'
          }
        `}
      >
        <div className="flex h-16 items-center border-b border-emerald-950/5 px-6 justify-between">
          <Link href="/admin" className="font-serif text-2xl font-bold text-emerald-950">
            Amouris<span className="text-amber-500 ml-1">Admin</span>
          </Link>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
             <Menu className="w-5 h-5" />
          </Button>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-64px)] p-4 no-scrollbar">
          <Link href="/admin" className="block mb-6">
                <Button 
                    variant={pathname === '/admin' ? 'secondary' : 'ghost'} 
                    className={`w-full justify-start min-h-[44px] ${pathname === '/admin' ? 'font-bold text-emerald-900 bg-emerald-50' : 'text-gray-700'}`}
                  >
                <LayoutDashboard className="mr-3 w-5 h-5 rtl:mr-0 rtl:ml-3" />
                {t('admin.sidebar.overview')}
            </Button>
          </Link>
          
          <div className="space-y-8">
            {navGroups.map((group, i) => (
              <div key={i}>
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-4">
                  {group.title}
                </div>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                      <Link key={item.name} href={item.href}>
                        <Button 
                          variant={isActive ? 'secondary' : 'ghost'} 
                          className={`w-full justify-start min-h-[44px] ${isActive ? 'font-bold text-emerald-900 bg-emerald-50' : 'text-gray-600 hover:text-emerald-900'}`}
                        >
                          <item.icon className="mr-3 w-5 h-5 rtl:mr-0 rtl:ml-3" />
                          {item.name}
                        </Button>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 border-t pt-4">
             <Link href="/">
                <Button variant="outline" className="w-full truncate text-ellipsis">
                  {t('admin.sidebar.back_to_shop')}
                </Button>
             </Link>
          </div>
        </div>
      </div>
    </>
  );
}
