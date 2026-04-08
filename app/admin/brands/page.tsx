'use client'

import { useState, useEffect } from 'react'
import { getBrands, deleteBrand } from '@/lib/actions/brands'
import { Plus, Search, Edit2, Trash2, Store } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { BrandModal } from '@/components/admin/BrandModal'
import { Brand } from '@/lib/types'

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)

  const loadData = async () => {
    setIsLoading(true)
    try {
      const b = await getBrands()
      setBrands(b)
    } catch (error) {
      console.error('Failed to load admin brands:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleAdd = () => {
    setEditingBrand(null)
    setModalOpen(true)
  }

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand)
    setModalOpen(true)
  }

  const handleDelete = async (id: string, logoUrl?: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette marque ? Cela peut affecter les produits qui y sont liés.')) {
      try {
        await deleteBrand(id) // If you need to delete image from storage it could be done inside server action
        loadData()
      } catch (error) {
        alert('Erreur lors de la suppression')
      }
    }
  }

  const filtered = brands.filter(b => {
    return (b.nameFR?.toLowerCase().includes(search.toLowerCase()) || false) || (b.nameAR?.includes(search) || false)
  })

  return (
    <div className="space-y-8 p-4 md:p-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
            <h1 className="text-3xl font-bold font-serif text-emerald-950 flex items-center gap-3">
              <Store size={32} />
              Marques
            </h1>
            <p className="text-emerald-950/40 text-sm mt-1">Gérez les marques disponibles sur votre boutique</p>
        </div>
        <Button onClick={handleAdd} className="bg-emerald-900 text-white px-8 py-6 rounded-2xl hover:bg-emerald-800 shadow-xl shadow-emerald-900/10 transition-all font-bold flex items-center gap-3">
          <Plus size={20} /> Ajouter une marque
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-900/20" />
          <input
            type="text"
            placeholder="Rechercher une marque..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white border border-emerald-50 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-emerald-900/5 transition-all shadow-sm"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-900 mx-auto"></div>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-emerald-50 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
              <table className="w-full text-left">
              <thead>
                  <tr className="bg-emerald-50/30">
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/40">Logo</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/40">Nom (FR)</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/40 text-right">Nom (AR)</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/40 text-right">Actions</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50">
                  <AnimatePresence mode="popLayout">
                  {filtered.map(brand => (
                      <motion.tr 
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          key={brand.id} 
                          className="hover:bg-emerald-50/20 transition-all group"
                      >
                      <td className="px-8 py-6">
                        {brand.logo ? (
                          <div className="w-16 h-16 rounded-full border border-gray-100 overflow-hidden shadow-sm">
                            <img src={brand.logo} alt={brand.nameFR} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
                             <Store className="text-emerald-900/20" size={24} />
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-6 font-bold text-emerald-950 font-sans">
                         {brand.nameFR}
                      </td>
                      <td className="px-8 py-6">
                          <div className="text-emerald-950 text-right font-bold font-arabic" dir="rtl">{brand.nameAR}</div>
                      </td>
                      <td className="px-8 py-6">
                          <div className="flex justify-end gap-3">
                          <button onClick={() => handleEdit(brand)} className="w-10 h-10 flex items-center justify-center text-emerald-900/20 hover:text-emerald-900 hover:bg-emerald-50 rounded-xl transition-all">
                              <Edit2 size={16} />
                          </button>
                          <button 
                              onClick={() => handleDelete(brand.id, brand.logo)}
                              className="w-10 h-10 flex items-center justify-center text-rose-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                          >
                              <Trash2 size={16} />
                          </button>
                          </div>
                      </td>
                      </motion.tr>
                  ))}
                  </AnimatePresence>
              </tbody>
              </table>
          </div>
          {filtered.length === 0 && (
            <div className="p-24 text-center">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Store size={32} className="text-emerald-950/10" />
                </div>
                <p className="text-emerald-950/20 font-serif text-xl">Aucune marque trouvée</p>
            </div>
          )}
        </div>
      )}

      <BrandModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        brand={editingBrand}
        onSuccess={loadData}
      />
    </div>
  )
}
