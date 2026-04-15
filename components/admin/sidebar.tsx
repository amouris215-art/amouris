"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/i18n/i18n-context';
import { useAdminStore } from '@/store/admin-ui.store';
import { 
  LayoutDashboard, Package, Tag, Users, ShoppingCart, 
  FileText, TrendingUp, Settings, Inbox, Menu, Store, Layers 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AdminSidebar() {
  const pathname = usePathname();
  const { language, dir } = useI18n();
  const { sidebarOpen, setSidebarOpen } = useAdminStore();

  const navGroups = [
    {
      title: language === 'ar' ? 'الكتالوج' : 'Catalogue',
      items: [
        { name: language === 'ar' ? 'المنتجات' : 'Produits', href: '/admin/products', icon: Package },
        { name: language === 'ar' ? 'الأصناف' : 'Catégories', href: '/admin/categories', icon: Tag },
        { name: language === 'ar' ? 'المجموعات' : 'Collections', href: '/admin/collections', icon: Layers },
        { name: language === 'ar' ? 'العلامات' : 'Marques', href: '/admin/brands', icon: Store },
      ]
    },
    {
      title: language === 'ar' ? 'المبيعات' : 'Ventes',
      items: [
        { name: language === 'ar' ? 'الطلبات' : 'Commandes', href: '/admin/orders', icon: ShoppingCart },
        { name: language === 'ar' ? 'الفواتير' : 'Factures', href: '/admin/invoices', icon: FileText },
        { name: language === 'ar' ? 'العملاء' : 'Clients', href: '/admin/customers', icon: Users },
      ]
    },
    {
      title: language === 'ar' ? 'المخزون' : 'Inventaire',
      items: [
        { name: language === 'ar' ? 'إدارة المخزون' : 'Gestion des stocks', href: '/admin/inventory', icon: Inbox },
      ]
    },
    {
      title: language === 'ar' ? 'نظام الإدارة' : 'Système',
      items: [
        { name: language === 'ar' ? 'الإشعارات' : 'Notifications', href: '/admin/notifications', icon: Bell },
        { name: language === 'ar' ? 'التحليلات' : 'Analytiques', href: '/admin/analytics', icon: TrendingUp },
        { name: language === 'ar' ? 'تقارير إكسل' : 'Rapports Excel', href: '/admin/reports', icon: FileText },
        { name: language === 'ar' ? 'الإعدادات' : 'Paramètres', href: '/admin/settings', icon: Settings },
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
                {language === 'ar' ? 'نظرة عامة' : 'Vue d\'ensemble'}
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
                  {language === 'ar' ? 'العودة للمتجر' : 'Retour à la boutique'}
                </Button>
             </Link>
          </div>
        </div>
      </div>
    </>
  );
}
