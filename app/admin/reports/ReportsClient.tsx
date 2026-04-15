'use client'

import { useState } from 'react'
import { FileSpreadsheet, Download, Activity, Users, Package, Loader2 } from 'lucide-react'
import * as XLSX from 'xlsx'

import { useI18n } from '@/i18n/i18n-context'

interface ReportsClientProps {
  orders: any[]
  customers: any[]
  products: any[]
}

export default function ReportsClient({ orders, customers, products }: ReportsClientProps) {
  const { t, dir, language } = useI18n();
  const [loading, setLoading] = useState<string | null>(null)

  const downloadExcel = (data: any[], filename: string) => {
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, t('admin.reports.sheet_name'))
    
    // Auto-size columns (simple approach)
    const max_width = data.reduce((w, r) => Math.max(w, Object.keys(r).length), 10);
    worksheet["!cols"] = Array(max_width).fill({ wch: 20 });

    XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  const handleDownloadSales = () => {
    setLoading('sales')
    setTimeout(() => {
        const data = orders.map(o => ({
            [t('admin.reports.excel_headers.order_no')]: o.order_number,
            [t('admin.reports.excel_headers.date')]: new Date(o.created_at).toLocaleString(language === 'ar' ? 'ar-DZ' : 'fr-FR'),
            [t('admin.reports.excel_headers.customer')]: o.guest_first_name ? `${o.guest_first_name} ${o.guest_last_name}` : (o.customer?.first_name ? `${o.customer.first_name} ${o.customer.last_name}` : t('admin.reports.excel_values.registered_customer')),
            [t('admin.reports.excel_headers.phone')]: o.guest_phone || '-',
            [t('admin.reports.excel_headers.wilaya')]: o.guest_wilaya || '-',
            [t('admin.reports.excel_headers.total_amount')]: o.total_amount,
            [t('admin.reports.excel_headers.amount_paid')]: o.amount_paid,
            [t('admin.reports.excel_headers.order_status')]: o.order_status,
            [t('admin.reports.excel_headers.payment_status')]: o.payment_status,
            [t('admin.reports.excel_headers.items')]: o.items.map((i: any) => `${language === 'ar' ? (i.product_name_ar || i.product_name_fr) : i.product_name_fr} (${i.quantity_grams || i.quantity_units})`).join(', ')
        }))
        downloadExcel(data, t('admin.reports.filenames.sales'))
        setLoading(null)
    }, 500)
  }

  const handleDownloadInventory = () => {
    setLoading('inventory')
    setTimeout(() => {
        const data: any[] = []
        products.forEach(p => {
            if (p.product_type === 'perfume') {
                data.push({
                    [t('admin.reports.excel_headers.product')]: language === 'ar' ? (p.name_ar || p.name_fr) : p.name_fr,
                    [t('admin.reports.excel_headers.type')]: t('admin.reports.excel_values.type_perfume'),
                    [t('admin.reports.excel_headers.variant')]: "N/A",
                    [t('admin.reports.excel_headers.stock')]: `${p.stock_grams}g`,
                    [t('admin.reports.excel_headers.base_price')]: p.price_per_gram ? `${p.price_per_gram} DZD/g` : '-',
                    [t('admin.reports.excel_headers.status')]: p.status
                })
            } else {
                p.variants?.forEach((v: any) => {
                    data.push({
                        [t('admin.reports.excel_headers.product')]: language === 'ar' ? (p.name_ar || p.name_fr) : p.name_fr,
                        [t('admin.reports.excel_headers.type')]: t('admin.reports.excel_values.type_flacon'),
                        [t('admin.reports.excel_headers.variant')]: `${v.size_ml}ml - ${v.color_name}`,
                        [t('admin.reports.excel_headers.stock')]: `${v.stock_units} ${t('admin.reports.excel_values.units')}`,
                        [t('admin.reports.excel_headers.base_price')]: `${v.price} DZD`,
                        [t('admin.reports.excel_headers.status')]: p.status
                    })
                })
            }
        })
        downloadExcel(data, t('admin.reports.filenames.inventory'))
        setLoading(null)
    }, 500)
  }

  const handleDownloadCustomers = () => {
    setLoading('customers')
    setTimeout(() => {
        const data = customers.map(c => ({
            [t('admin.reports.excel_headers.last_name')]: c.last_name,
            [t('admin.reports.excel_headers.first_name')]: c.first_name,
            [t('admin.reports.excel_headers.phone')]: c.phone,
            [t('admin.reports.excel_headers.email')]: c.email || '-',
            [t('admin.reports.excel_headers.shop')]: c.shop_name || '-',
            [t('admin.reports.excel_headers.wilaya')]: c.wilaya,
            [t('admin.reports.excel_headers.commune')]: c.commune || '-',
            [t('admin.reports.excel_headers.registered_at')]: new Date(c.created_at || '').toLocaleDateString(language === 'ar' ? 'ar-DZ' : 'fr-FR'),
            [t('admin.reports.excel_headers.status')]: c.is_frozen ? t('admin.reports.excel_values.status_suspended') : t('admin.reports.excel_values.status_active')
        }))
        downloadExcel(data, t('admin.reports.filenames.customers'))
        setLoading(null)
    }, 500)
  }

  const reports = [
    {
      id: 'sales',
      title: t('admin.reports.cards.sales_title'),
      description: t('admin.reports.cards.sales_desc'),
      icon: Activity,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      action: handleDownloadSales
    },
    {
      id: 'inventory',
      title: t('admin.reports.cards.inventory_title'),
      description: t('admin.reports.cards.inventory_desc'),
      icon: Package,
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      action: handleDownloadInventory
    },
    {
      id: 'customers',
      title: t('admin.reports.cards.customers_title'),
      description: t('admin.reports.cards.customers_desc'),
      icon: Users,
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      action: handleDownloadCustomers
    }
  ]

  return (
    <div className="space-y-12 pb-20 font-sans" dir={dir}>
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className={dir === 'rtl' ? 'text-right' : ''}>
           <h1 className="font-serif text-4xl text-emerald-950 mb-2 font-bold italic">{t('admin.reports.title')}</h1>
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C9A84C]">{t('admin.reports.subtitle')}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reports.map((report) => (
          <div key={report.id} className="bg-white p-10 rounded-[3rem] border border-emerald-950/5 shadow-2xl shadow-emerald-950/5 flex flex-col justify-between group hover:-translate-y-2 transition-all duration-500">
             <div className={dir === 'rtl' ? 'text-right' : ''}>
                <div className={`w-16 h-16 ${report.bgColor} ${report.color} rounded-[1.5rem] flex items-center justify-center mb-8 shadow-inner group-hover:rotate-6 transition-all ${dir === 'rtl' ? 'mr-0 ml-auto' : ''}`}>
                   <report.icon size={32} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-emerald-950 mb-4 italic">{report.title}</h3>
                <p className="text-xs text-emerald-950/40 leading-relaxed font-medium min-h-[4rem]">
                  {report.description}
                </p>
             </div>
             
             <div className="pt-10 mt-6 border-t border-emerald-950/5">
                <button
                  onClick={report.action}
                  disabled={loading !== null}
                  className={`w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all
                    ${loading === report.id 
                      ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed' 
                      : 'bg-emerald-950 text-white hover:bg-emerald-900 shadow-2xl shadow-emerald-900/20 active:scale-95'
                    }
                    ${dir === 'rtl' ? 'flex-row-reverse' : ''}
                  `}
                >
                  {loading === report.id ? (
                    <><Loader2 size={16} className="animate-spin" /> {t('admin.reports.buttons.preparing')}</>
                  ) : (
                    <><Download size={16} /> {t('admin.reports.buttons.download')}</>
                  )}
                </button>
             </div>
          </div>
        ))}
      </div>

      <section className="bg-neutral-900 rounded-[3rem] p-12 text-white/40 flex flex-col md:flex-row items-center gap-8 border border-white/5 shadow-2xl overflow-hidden relative group">
         <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
         <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white/20">
            <Activity size={32} />
         </div>
         <div className={`flex-1 text-center ${dir === 'rtl' ? 'md:text-right' : 'md:text-left'}`}>
            <p className="text-white text-lg font-serif mb-1 font-bold italic">{t('admin.reports.footer.title')}</p>
            <p className="text-xs font-medium max-w-lg">
               {t('admin.reports.footer.desc')}
            </p>
         </div>
      </section>
    </div>
  )
}
