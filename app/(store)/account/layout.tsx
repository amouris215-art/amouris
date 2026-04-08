"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useI18n } from '@/i18n/i18n-context';
import { useCustomerAuth } from '@/store/customer-auth.store';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, ShoppingBag, Settings, LogOut } from 'lucide-react';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { language } = useI18n();
  const { customer: user, logout } = useCustomerAuth();

  useEffect(() => {
    if (user === null) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Safe access: user comes from customers.store.ts which uses first_name/last_name
  const displayFirstName = user.first_name || '';
  const displayLastName = user.last_name || '';
  const displayShopName = user.shop_name || '';
  const initial = displayFirstName.charAt(0) || '?';

  const navItems = [
    { href: '/account', label: language === 'ar' ? 'لوحة التحكم' : 'Tableau de bord', icon: LayoutDashboard },
    { href: '/account/orders', label: language === 'ar' ? 'طلباتي' : 'Mes commandes', icon: ShoppingBag },
    { href: '/account/settings', label: language === 'ar' ? 'إعدادات الحساب' : 'Paramètres', icon: Settings },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white border border-emerald-950/5 rounded-[2rem] overflow-hidden shadow-sm">
            <div className="p-6 border-b border-emerald-950/5 bg-neutral-50/50 text-center">
              <div className="w-16 h-16 bg-[#0a3d2e] text-white rounded-full flex items-center justify-center text-2xl font-serif mx-auto mb-3">
                {initial}
              </div>
              <h2 className="font-bold text-emerald-950">{displayFirstName} {displayLastName}</h2>
              <p className="text-sm text-emerald-950/40">{displayShopName}</p>
            </div>
            
            <nav className="flex flex-col p-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/account');
                
                return (
                  <Link key={item.href} href={item.href}>
                    <Button 
                      variant={isActive ? 'secondary' : 'ghost'} 
                      className={`w-full justify-start ${isActive ? 'font-bold text-emerald-900' : 'text-emerald-950/60'}`}
                    >
                      <Icon className="w-4 h-4 mr-3 rtl:ml-3 rtl:mr-0" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
              
              <div className="border-t border-emerald-950/5 mt-2 pt-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-3 rtl:ml-3 rtl:mr-0" />
                  {language === 'ar' ? 'تسجيل الخروج' : 'Déconnexion'}
                </Button>
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
