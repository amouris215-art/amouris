'use client'

import { useState, useMemo } from 'react'
import { Collection } from '@/store/collections.store'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Edit2, Trash2, Layers, Box } from 'lucide-react'
import { CollectionModal } from '@/components/admin/CollectionModal'
import { deleteCollectionAction } from '@/lib/actions/collections'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useI18n } from '@/i18n/i18n-context'

interface CollectionsClientProps {
  initialCollections: (Collection & { product_count: number })[]
}

export default function CollectionsClient({ initialCollections }: CollectionsClientProps) {
  const { t, dir, language } = useI18n();
  const router = useRouter()
  const collections = initialCollections
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  const filtered = useMemo(() => {
    return collections.filter(c => 
      c.name_fr.toLowerCase().includes(search.toLowerCase()) || 
      (c.name_ar && c.name_ar.includes(search))
    )
  }, [collections, search])

  const handleAdd = () => {
    setEditingCollection(null)
    setModalOpen(true)
  }

  const handleEdit = (c: Collection) => {
    setEditingCollection(c)
    setModalOpen(true)
  }

  const handleDelete = async (col: Collection & { product_count: number }) => {
    if (col.product_count > 0) {
      toast.error(t('admin.collections.delete_error_count', { count: col.product_count }))
      return
    }
    if (confirm(t('admin.collections.confirm_delete'))) {
      try {
        const result = await deleteCollectionAction(col.id)
        if (result.success) {
          router.refresh()
          toast.success(t('admin.collections.toast_success_delete'))
        } else {
          toast.error(t('admin.collections.toast_error') + ': ' + result.error)
        }
      } catch (err: any) {
        toast.error(t('admin.collections.toast_error') + ': ' + err.message)
      }
    }
  }

  return (
    <div className="space-y-12 pb-20 font-sans" dir={dir}>
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <motion.div 
          initial={{ opacity: 0, x: dir === 'rtl' ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={dir === 'rtl' ? 'text-right' : ''}
        >
           <h1 className="font-serif text-5xl text-emerald-950 mb-2 font-bold italic">{t('admin.collections.title')}</h1>
           <p className="text-[11px] font-black uppercase tracking-[0.5em] text-[#C9A84C]/80">{t('admin.collections.subtitle')}</p>
        </motion.div>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAdd}
          className="bg-amber-950 text-white px-8 py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-amber-900/30 hover:shadow-amber-900/40 transition-all flex items-center gap-3 font-sans"
        >
          <Plus size={18} /> {t('admin.collections.add_button')}
        </motion.button>
      </header>

      <section className="relative group">
        <Search size={18} className={`absolute ${dir === 'rtl' ? 'right-6' : 'left-6'} top-1/2 -translate-y-1/2 text-emerald-950/20 group-focus-within:text-[#C9A84C] transition-colors`} />
        <input 
          type="text"
          placeholder={t('admin.collections.search_placeholder')}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={`w-full h-16 ${dir === 'rtl' ? 'pr-16 pl-8 text-right' : 'pl-16 pr-8'} bg-white border border-emerald-950/5 rounded-2xl outline-none focus:border-[#C9A84C] shadow-sm font-medium text-emerald-950 transition-all font-sans`}
        />
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 font-sans">
        <AnimatePresence mode="popLayout">
          {filtered.map((collection) => {
             return (
              <motion.div 
                layout
                key={collection.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group luxury-card overflow-hidden"
              >
                <div className="aspect-[21/9] relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-700">
                  {collection.cover_image && !imageErrors[collection.id] ? (
                    <img 
                      src={collection.cover_image} 
                      alt={language === 'ar' ? (collection.name_ar || collection.name_fr) : collection.name_fr} 
                      className="w-full h-full object-cover" 
                      onError={() => setImageErrors(prev => ({ ...prev, [collection.id]: true }))}
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-100 flex items-center justify-center text-emerald-950/10">
                      <Layers size={64} />
                    </div>
                  )}
                  <div className={`absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent opacity-60`} />
                  <div className={`absolute bottom-6 ${dir === 'rtl' ? 'right-8 text-right' : 'left-8'}`}>
                     <h3 className="text-white font-serif text-3xl font-bold italic">{language === 'ar' ? (collection.name_ar || collection.name_fr) : collection.name_fr}</h3>
                     {language !== 'ar' && collection.name_ar && <p className="text-white/60 text-xl font-arabic">{collection.name_ar}</p>}
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  <p className={`text-sm text-emerald-950/70 leading-relaxed font-medium line-clamp-2 ${dir === 'rtl' ? 'text-right' : ''}`}>
                     {(language === 'ar' ? (collection.description_ar || collection.description_fr) : collection.description_fr) || t('admin.collections.default_desc')}
                  </p>
                  
                  <div className={`flex items-center justify-between pt-6 border-t border-emerald-950/5 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                     <div className={`px-5 py-2.5 bg-amber-50 rounded-[1rem] flex items-center gap-2 border border-amber-100/50 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                        <Box size={14} className="text-amber-600" />
                        <span className="text-[11px] font-black text-amber-900 uppercase tracking-widest">{collection.product_count} {t('admin.collections.refs_label')}</span>
                     </div>

                    <div className={`flex gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <button onClick={() => handleEdit(collection)} className="w-12 h-12 rounded-2xl bg-white border border-emerald-950/5 flex items-center justify-center text-emerald-950/40 hover:text-emerald-950 hover:border-emerald-950/20 transition-all shadow-sm">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(collection)} className="w-12 h-12 rounded-2xl bg-white border border-emerald-950/5 flex items-center justify-center text-rose-300 hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="py-32 text-center text-emerald-950/20 font-sans">
          <Layers size={48} className="mx-auto mb-4 opacity-20" />
          <p className="font-serif text-2xl italic">{t('admin.collections.no_results')}</p>
        </div>
      )}

      <CollectionModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        collection={editingCollection} 
        onSave={() => router.refresh()}
      />
    </div>
  )
}
