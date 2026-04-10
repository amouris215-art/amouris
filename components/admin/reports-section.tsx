'use client'

import { useState } from 'react'
import * as XLSX from 'xlsx-js-style'
import { Download, FileSpreadsheet, Loader2 } from 'lucide-react'
import { useOrdersStore } from '@/store/orders.store'
import { useCustomersStore } from '@/store/customers.store'
import { useProductsStore } from '@/store/products.store'
import { useCategoriesStore } from '@/store/categories.store'
import { useBrandsStore } from '@/store/brands.store'

export function ReportsSection() {
  const { orders, fetchOrders } = useOrdersStore()
  const { customers, fetchCustomers } = useCustomersStore()
  const { products, fetchProducts } = useProductsStore()
  const { categories, fetchCategories } = useCategoriesStore()
  const { brands, fetchBrands } = useBrandsStore()

  const [loading, setLoading] = useState<string | null>(null)

  // Utilitaire pour formater la date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Styles de base proposés
  const headerStyle = {
    font: { bold: true, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "064E3B" } }, // Emerald 900
    alignment: { horizontal: "center", vertical: "center" }
  }

  const altRowStyle = {
    fill: { fgColor: { rgb: "F9FAFB" } } // light gray/emerald
  }

  const numberFormat = '#,##0'

  const downloadFile = (wb: XLSX.WorkBook, filename: string) => {
    // Note: Standard SheetJS community edition might strip advanced styles.
    // However, the `z` property (number format) often works!
    const today = new Date().toISOString().split('T')[0]
    XLSX.writeFile(wb, `amouris-${filename}-${today}.xlsx`)
  }

  const generateSales = async () => {
    setLoading('sales')
    if (orders.length === 0) await fetchOrders()
    const currentOrders = useOrdersStore.getState().orders

    // 1. Feuille Ventes
    const ventesData = currentOrders.map((o, idx) => {
      const isAlt = idx % 2 === 1
      const defaultStyle = isAlt ? altRowStyle : {}

      let clientName = 'Invité'
      let clientPhone = o.guest_phone || ''
      let clientWilaya = o.guest_wilaya || ''

      if (o.customer_id) {
        const c = customers.find(x => x.id === o.customer_id)
        if (c) {
          clientName = `${c.first_name} ${c.last_name}`
          clientPhone = c.phone
          clientWilaya = c.wilaya
        }
      } else if (o.guest_first_name) {
        clientName = `${o.guest_first_name} ${o.guest_last_name}`
      }

      const productsDesc = o.items.map(i => {
        if (i.quantity_grams) return `${i.product_name_fr} (${i.quantity_grams}g)`
        return `${i.product_name_fr} (${i.quantity_units}x)`
      }).join(', ')

      return {
        'N° Commande': { v: o.order_number, s: defaultStyle },
        'Date': { v: formatDate(o.created_at), s: defaultStyle },
        'Client': { v: clientName, s: defaultStyle },
        'Téléphone': { v: clientPhone, s: defaultStyle },
        'Wilaya': { v: clientWilaya, s: defaultStyle },
        'Produits': { v: productsDesc, s: defaultStyle },
        'Total DZD': { v: o.total_amount, t: 'n', z: numberFormat, s: defaultStyle },
        'Montant Payé': { v: o.amount_paid, t: 'n', z: numberFormat, s: defaultStyle },
        'Reste': { v: o.total_amount - o.amount_paid, t: 'n', z: numberFormat, s: defaultStyle },
        'Statut Commande': { v: o.order_status, s: defaultStyle },
        'Statut Paiement': { v: o.payment_status, s: defaultStyle }
      }
    })

    const wsVentes = XLSX.utils.json_to_sheet(ventesData.map(row => {
      const flatRow: any = {}
      Object.keys(row).forEach(k => flatRow[k] = (row as any)[k].v)
      return flatRow
    }))

    // Apply basic styles hack if supported by the engine
    const range = XLSX.utils.decode_range(wsVentes['!ref'] || 'A1:A1')
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellRef = XLSX.utils.encode_cell({ c: C, r: R })
        if (!wsVentes[cellRef]) continue
        if (R === 0) {
          wsVentes[cellRef].s = headerStyle
        } else {
          // Find original data
          const colName = Object.keys(ventesData[0])[C]
          const originalCell = (ventesData[R - 1] as any)[colName]
          if (originalCell?.t === 'n') {
            wsVentes[cellRef].z = originalCell.z
            wsVentes[cellRef].t = 'n'
          }
          if (originalCell?.s) {
             wsVentes[cellRef].s = { ...wsVentes[cellRef].s, ...originalCell.s }
          }
        }
      }
    }
    
    // Auto-size columns
    wsVentes['!cols'] = [
      { wch: 15 }, { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 15 },
      { wch: 40 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 15 }, { wch: 15 }
    ]

    // 2. Feuille Résumé
    const totalOrders = currentOrders.length
    const caTotal = currentOrders.reduce((sum, o) => sum + o.total_amount, 0)
    const caPaye = currentOrders.reduce((sum, o) => sum + o.amount_paid, 0)
    const caEnAttente = caTotal - caPaye

    const wsResume = XLSX.utils.json_to_sheet([
      { Métrique: 'Total Commandes', Valeur: totalOrders },
      { Métrique: 'Chiffre d\'Affaires Total (DZD)', Valeur: caTotal },
      { Métrique: 'CA Encassé (DZD)', Valeur: caPaye },
      { Métrique: 'CA En Attente (DZD)', Valeur: caEnAttente }
    ])

    // Format Résumé
    const resRange = XLSX.utils.decode_range(wsResume['!ref'] || 'A1:A1')
    for (let R = resRange.s.r; R <= resRange.e.r; ++R) {
      for (let C = resRange.s.c; C <= resRange.e.c; ++C) {
        const cellRef = XLSX.utils.encode_cell({ c: C, r: R })
        if (!wsResume[cellRef]) continue
        if (R === 0) {
          wsResume[cellRef].s = headerStyle
        } else if (C === 1 && R > 0) {
          wsResume[cellRef].t = 'n'
          wsResume[cellRef].z = numberFormat
        }
      }
    }
    wsResume['!cols'] = [{ wch: 35 }, { wch: 20 }]

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, wsVentes, 'Ventes Détails')
    XLSX.utils.book_append_sheet(wb, wsResume, 'Résumé')

    downloadFile(wb, 'ventes')
    setLoading(null)
  }

  const generateCustomers = async () => {
    setLoading('customers')
    if (customers.length === 0) await fetchCustomers()
    if (orders.length === 0) await fetchOrders()
    
    const customersList = useCustomersStore.getState().customers
    const allOrders = useOrdersStore.getState().orders

    const clientsData = customersList.map((c, idx) => {
      const clientOrders = allOrders.filter(o => o.customer_id === c.id)
      const totalSpent = clientOrders.reduce((sum, o) => sum + o.total_amount, 0)
      const statut = c.is_frozen ? 'Suspendu' : 'Actif'
      
      const isAlt = idx % 2 === 1
      const defaultStyle = isAlt ? altRowStyle : {}

      return {
        'Nom': { v: c.last_name, s: defaultStyle },
        'Prénom': { v: c.first_name, s: defaultStyle },
        'Nom Magasin': { v: c.shop_name || '-', s: defaultStyle },
        'Téléphone': { v: c.phone, s: defaultStyle },
        'Wilaya': { v: c.wilaya, s: defaultStyle },
        'Commune': { v: c.commune || '-', s: defaultStyle },
        'Date Inscription': { v: formatDate(c.created_at), s: defaultStyle },
        'Nombre Commandes': { v: clientOrders.length, t: 'n', s: defaultStyle },
        'Total Dépensé DZD': { v: totalSpent, t: 'n', z: numberFormat, s: defaultStyle },
        'Statut Compte': { v: statut, s: defaultStyle }
      }
    })

    const wsClients = XLSX.utils.json_to_sheet(clientsData.map(row => {
      const flatRow: any = {}
      Object.keys(row).forEach(k => flatRow[k] = (row as any)[k].v)
      return flatRow
    }))

     // Apply formatting
     const range = XLSX.utils.decode_range(wsClients['!ref'] || 'A1:A1')
     for (let R = range.s.r; R <= range.e.r; ++R) {
       for (let C = range.s.c; C <= range.e.c; ++C) {
         const cellRef = XLSX.utils.encode_cell({ c: C, r: R })
         if (!wsClients[cellRef]) continue
         if (R === 0) {
           wsClients[cellRef].s = headerStyle
         } else {
           const colName = Object.keys(clientsData[0])[C]
           const originalCell = (clientsData[R - 1] as any)[colName]
           if (originalCell?.t === 'n') {
             wsClients[cellRef].z = originalCell.z || '0'
             wsClients[cellRef].t = 'n'
           }
           if (originalCell?.s) {
             wsClients[cellRef].s = { ...wsClients[cellRef].s, ...originalCell.s }
           }
         }
       }
     }
     
    wsClients['!cols'] = [
      { wch: 15 }, { wch: 15 }, { wch: 20 }, { wch: 15 }, { wch: 15 },
      { wch: 15 }, { wch: 20 }, { wch: 18 }, { wch: 18 }, { wch: 15 }
    ]

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, wsClients, 'Clients')

    downloadFile(wb, 'clients')
    setLoading(null)
  }

  const generateInventory = async () => {
    setLoading('inventory')
    if (products.length === 0) await fetchProducts()
    if (categories.length === 0) await fetchCategories()
    if (brands.length === 0) await fetchBrands()
    
    const allProducts = useProductsStore.getState().products
    const allCats = useCategoriesStore.getState().categories
    const allBrands = useBrandsStore.getState().brands

    const parfums = allProducts.filter(p => p.product_type === 'perfume')
    const flacons = allProducts.filter(p => p.product_type === 'flacon')

    // 1. Feuille Parfums
    const parfumsData = parfums.map((p, idx) => {
      const isAlt = idx % 2 === 1
      const defaultStyle = isAlt ? altRowStyle : {}
      
      const cat = allCats.find(c => c.id === p.category_id)
      const brand = allBrands.find(b => b.id === p.brand_id)

      let statusStr = 'En Stock'
      if (p.stock_grams === 0) statusStr = 'Rupture'
      else if ((p.stock_grams || 0) < 500) statusStr = 'Stock Faible'

      return {
        'Nom FR': { v: p.name_fr, s: defaultStyle },
        'Nom AR': { v: p.name_ar, s: defaultStyle },
        'Catégorie': { v: cat?.name_fr || '-', s: defaultStyle },
        'Marque': { v: brand?.name || '-', s: defaultStyle },
        'Prix/g DZD': { v: p.price_per_gram || 0, t: 'n', z: numberFormat, s: defaultStyle },
        'Stock Grammes': { v: p.stock_grams || 0, t: 'n', z: numberFormat, s: defaultStyle },
        'Statut Stock': { v: statusStr, s: defaultStyle }
      }
    })

    const wsParfums = XLSX.utils.json_to_sheet(parfumsData.map(r => {
      const flat: any = {}
      Object.keys(r).forEach(k => {
        flat[k] = typeof (r as any)[k] === 'object' ? (r as any)[k].v : (r as any)[k]
      })
      return flat
    }))

     // Apply number formatting for Parfums
     const rangeP = XLSX.utils.decode_range(wsParfums['!ref'] || 'A1:A1')
     for (let R = rangeP.s.r; R <= rangeP.e.r; ++R) {
       for (let C = rangeP.s.c; C <= rangeP.e.c; ++C) {
         const cellRef = XLSX.utils.encode_cell({ c: C, r: R })
         if (!wsParfums[cellRef]) continue
         if (R === 0) wsParfums[cellRef].s = headerStyle
         else {
           const colName = Object.keys(parfumsData[0])[C]
           const originalCell = (parfumsData[R - 1] as any)[colName]
           if (originalCell?.t === 'n') {
             wsParfums[cellRef].z = originalCell.z
             wsParfums[cellRef].t = 'n'
           }
           if (originalCell?.s) {
             wsParfums[cellRef].s = { ...wsParfums[cellRef].s, ...originalCell.s }
           }
         }
       }
     }

    wsParfums['!cols'] = [
      { wch: 30 }, { wch: 30 }, { wch: 20 }, { wch: 15 },
      { wch: 15 }, { wch: 15 }, { wch: 15 }
    ]

    // 2. Feuille Flacons
    const flaconsData: any[] = []
    let globalIdx = 0
    flacons.forEach(p => {
      if (!p.variants || p.variants.length === 0) {
        const isAlt = globalIdx % 2 === 1
        const defaultStyle = isAlt ? altRowStyle : {}
        globalIdx++

        let statusStr = 'En Stock'
        if ((p.stock_grams || 0) === 0) statusStr = 'Rupture'

        flaconsData.push({
          'Nom FR': { v: p.name_fr, s: defaultStyle },
          'Variante': { v: '-', s: defaultStyle },
          'Prix DZD': { v: p.base_price || 0, t: 'n', z: numberFormat, s: defaultStyle },
          'Stock Unités': { v: 0, t: 'n', z: numberFormat, s: defaultStyle },
          'Statut Stock': { v: statusStr, s: defaultStyle }
        })
      } else {
        p.variants.forEach(v => {
          const isAlt = globalIdx % 2 === 1
          const defaultStyle = isAlt ? altRowStyle : {}
          globalIdx++

          let statusStr = 'En Stock'
          if (v.stock_units === 0) statusStr = 'Rupture'
          else if (v.stock_units < 50) statusStr = 'Stock Faible'

          flaconsData.push({
            'Nom FR': { v: p.name_fr, s: defaultStyle },
            'Variante': { v: `${v.size_ml}ml - ${v.color_name} - ${v.shape}`, s: defaultStyle },
            'Prix DZD': { v: v.price || 0, t: 'n', z: numberFormat, s: defaultStyle },
            'Stock Unités': { v: v.stock_units || 0, t: 'n', z: numberFormat, s: defaultStyle },
            'Statut Stock': { v: statusStr, s: defaultStyle }
          })
        })
      }
    })

    const wsFlacons = XLSX.utils.json_to_sheet(flaconsData.map(r => {
      const flat: any = {}
      Object.keys(r).forEach(k => {
        flat[k] = typeof r[k] === 'object' ? r[k].v : r[k]
      })
      return flat
    }))

     // Apply number formatting for Flacons
     const rangeF = XLSX.utils.decode_range(wsFlacons['!ref'] || 'A1:A1')
     for (let R = rangeF.s.r; R <= rangeF.e.r; ++R) {
       for (let C = rangeF.s.c; C <= rangeF.e.c; ++C) {
         const cellRef = XLSX.utils.encode_cell({ c: C, r: R })
         if (!wsFlacons[cellRef]) continue
         if (R === 0) wsFlacons[cellRef].s = headerStyle
         else {
           const colName = Object.keys(flaconsData[0])[C]
           const originalCell = flaconsData[R - 1][colName]
           if (originalCell?.t === 'n') {
             wsFlacons[cellRef].z = originalCell.z
             wsFlacons[cellRef].t = 'n'
           }
           if (originalCell?.s) {
             wsFlacons[cellRef].s = { ...wsFlacons[cellRef].s, ...originalCell.s }
           }
         }
       }
     }

    wsFlacons['!cols'] = [
      { wch: 30 }, { wch: 40 }, { wch: 15 }, { wch: 15 }, { wch: 15 }
    ]

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, wsParfums, 'Parfums')
    XLSX.utils.book_append_sheet(wb, wsFlacons, 'Flacons')

    downloadFile(wb, 'inventaire')
    setLoading(null)
  }

  const reports = [
    {
      id: 'sales',
      title: 'Rapport Ventes',
      desc: 'Export détaillé des commandes, montants et paiements',
      action: generateSales
    },
    {
      id: 'customers',
      title: 'Rapport Clients',
      desc: 'Base de données clients complète avec métriques',
      action: generateCustomers
    },
    {
      id: 'inventory',
      title: 'Rapport Inventaire',
      desc: 'État des stocks (Parfums et Flacons), alertes et tarifs',
      action: generateInventory
    }
  ]

  return (
    <div className="bg-white p-8 rounded-[3rem] border border-emerald-950/5 shadow-sm mt-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-emerald-50 text-emerald-900 rounded-2xl">
          <FileSpreadsheet size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-emerald-950 font-serif">Rapports Exportables</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-950/30 mt-1">
            Générer des fichiers Excel (XLSX) complets
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reports.map(report => (
          <div key={report.id} className="p-6 rounded-3xl border border-emerald-950/5 hover:border-emerald-900/20 bg-neutral-50 flex flex-col justify-between group transition-colors">
            <div>
              <h3 className="text-lg font-bold text-emerald-950 mb-2">{report.title}</h3>
              <p className="text-xs text-emerald-950/60 leading-relaxed">
                {report.desc}
              </p>
            </div>
            <button
              onClick={report.action}
              disabled={loading !== null}
              className="mt-6 flex flex-1 items-center justify-center gap-2 bg-emerald-950 text-white px-4 py-3 rounded-xl font-bold text-sm tracking-wide disabled:opacity-50 hover:bg-[#C9A84C] transition-colors"
            >
              {loading === report.id ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Génération...
                </>
              ) : (
                <>
                  <Download size={16} />
                  Télécharger
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
