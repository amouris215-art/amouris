'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useI18n } from '@/i18n/i18n-context'
import { logout as apiLogout } from '@/lib/api/auth'
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Settings, 
  LogOut, 
  Heart,
  Menu,
  X
} from 'lucide-react'

interface AccountSidebarClientProps {
  customer: any
}

export default function AccountSidebarClient({ customer }: AccountSidebarClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { t, language } = useI18n()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const firstName = customer.first_name || ''
  const lastName = customer.last_name || ''
  const isAr = language === 'ar'

  const handleLogout = async () => {
    await apiLogout()
    router.push('/')
    router.refresh()
  }

  const navItems = [
    { href: '/account', label: isAr ? 'نظرة عامة' : 'Aperçu', icon: LayoutDashboard },
    { href: '/account/orders', label: isAr ? 'طلباتي' : 'Commandes', icon: ShoppingBag },
    { href: '/account/favorites', label: isAr ? 'المفضلة' : 'Favoris', icon: Heart },
    { href: '/account/settings', label: isAr ? 'الإعدادات' : 'Paramètres', icon: Settings },
  ]

  return (
    <>
      {/* Mobile Header (Dashboard only) */}
      <div className="md:hidden sticky top-0 z-50 bg-white border-b border-emerald-950/5 p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-100 text-emerald-900 rounded-lg flex items-center justify-center text-sm font-bold">
            {firstName.charAt(0)}
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#C9A84C] leading-none mb-1">Amouris Client</p>
            <p className="font-bold text-sm text-emerald-950 leading-none">{customer.shop_name || `${firstName} ${lastName}`}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="p-2 text-rose-500 bg-rose-50 rounded-lg active:scale-95 transition-transform">
          <LogOut size={18} />
        </button>
      </div>

      {/* Desktop Sidebar (Hidden on Mobile) */}
      <aside className="hidden md:flex sticky top-0 h-screen w-72 bg-white border-r border-emerald-950/5 flex-col overflow-hidden">
        <div className="p-8 border-b border-emerald-950/5 bg-neutral-50/30">
          <div className="w-20 h-20 bg-[#0a3d2e] text-white rounded-[2rem] flex items-center justify-center text-3xl font-serif mb-4 shadow-xl shadow-emerald-900/10">
            {firstName.charAt(0) || '?'}
          </div>
          <h2 className="font-serif text-xl text-emerald-950 font-bold leading-tight">
            {firstName} {lastName}
          </h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#C9A84C] mt-1 opacity-80">
            {customer.shop_name || t('common.partner')}
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/account');
            
            return (
              <Link key={item.href} href={item.href}>
                <button className={`
                  w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all
                  ${isActive 
                    ? 'bg-[#0a3d2e] text-white shadow-lg shadow-emerald-900/10' 
                    : 'text-emerald-950/40 hover:text-emerald-950 hover:bg-emerald-50'}
                `}>
                  <Icon size={18} strokeWidth={2.5} />
                  {item.label}
                </button>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-emerald-950/5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 transition-all font-bold"
          >
            <LogOut size={18} strokeWidth={2.5} />
            {isAr ? 'تسجيل الخروج' : 'Déconnexion'}
          </button>
        </div>
      </aside>

      {/* MOBILE: Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-emerald-950/5 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe">
        <nav className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/account');
            
            return (
              <Link key={item.href} href={item.href} className="flex-1 flex flex-col items-center justify-center gap-1">
                <div className={`p-2 rounded-xl transition-all ${isActive ? 'text-emerald-900 bg-emerald-50' : 'text-gray-400'}`}>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={`text-[8px] font-black uppercase tracking-wider ${isActive ? 'text-emerald-950' : 'text-gray-400'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
