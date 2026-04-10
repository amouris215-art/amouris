'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Brand } from '@/store/brands.store'
import { Upload, X, Loader2, Store } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { createBrand, updateBrand } from '@/lib/api/brands'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface BrandModalProps {
  brand?: Brand | null
  isOpen: boolean
  onClose: () => void
}

const supabase = createClient()

export function BrandModal({ brand, isOpen, onClose }: BrandModalProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const [formData, setFormData] = useState<Partial<Brand>>({
    name: '',
    name_ar: '',
    logo_url: '',
    description_fr: ''
  })

  useEffect(() => {
    if (brand) {
      setFormData({
        name: brand.name || '',
        name_ar: brand.name_ar || '',
        logo_url: brand.logo_url || '',
        description_fr: brand.description_fr || ''
      })
    } else {
      setFormData({
        name: '',
        name_ar: '',
        logo_url: '',
        description_fr: ''
      })
    }
  }, [brand, isOpen])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `brands/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('brands')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('brands')
        .getPublicUrl(filePath)

      setFormData(prev => ({ ...prev, logo_url: publicUrl }))
      toast.success('Logo téléchargé')
    } catch (err: any) {
      toast.error("Erreur upload: " + err.message)
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
        if (brand?.id) {
          await updateBrand(brand.id, formData)
          toast.success('Maison mise à jour')
        } else {
          await createBrand(formData as any)
          toast.success('Nouvelle Maison créée')
        }
        router.refresh()
        onClose()
    } catch (err: any) {
        toast.error('Erreur: ' + err.message)
    } finally {
        setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white rounded-[2.5rem] p-0 border-none shadow-2xl overflow-hidden font-sans">
        <div className="bg-emerald-950 p-8 text-white relative">
           <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-[40px]" />
           <DialogHeader>
              <DialogTitle className="font-serif text-2xl flex items-center gap-3 relative z-10">
                <Store size={24} className="text-[#C9A84C]" />
                {brand ? 'Éditer la Maison' : 'Nouvelle Maison'}
              </DialogTitle>
              <p className="text-emerald-100/30 text-[9px] font-black uppercase tracking-[0.3em] mt-1 relative z-10">Gestion des Partenaires</p>
           </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="flex flex-col items-center gap-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-emerald-950/20">Identité Visuelle</label>
            <div className="relative group/logo">
              {formData.logo_url ? (
                <div className="w-28 h-28 rounded-[2rem] border border-emerald-950/5 overflow-hidden shadow-inner group-hover:scale-95 transition-transform">
                  <img src={formData.logo_url} alt="Logo" className="w-full h-full object-cover" />
                  <button 
                    type="button" 
                    onClick={() => setFormData({ ...formData, logo_url: '' })}
                    className="absolute inset-0 bg-rose-500/80 text-white flex items-center justify-center opacity-0 group-hover/logo:opacity-100 transition-opacity"
                  >
                    <X size={24}/>
                  </button>
                </div>
              ) : (
                <label className="w-28 h-28 rounded-[2rem] border-2 border-dashed border-emerald-950/10 flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-50 transition-all bg-neutral-50/50 hover:scale-105">
                  {isUploading ? <Loader2 size={24} className="animate-spin text-emerald-950/20" /> : <Upload size={24} className="text-emerald-950/20 mb-1" />}
                  <span className="text-[8px] font-black uppercase tracking-widest text-emerald-950/20">{isUploading ? 'Chargement' : 'Logo'}</span>
                  <input type="file" accept="image/*" className="hidden" disabled={isUploading} onChange={handleImageUpload} />
                </label>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-emerald-950/20 px-1">Nom Français</label>
              <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full h-12 px-5 rounded-2xl bg-neutral-50 border border-emerald-950/5 focus:border-[#C9A84C] outline-none font-bold text-emerald-950 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-emerald-950/20 px-1">Nom Arabe</label>
              <input required value={formData.name_ar} onChange={e => setFormData({ ...formData, name_ar: e.target.value })} dir="rtl" className="w-full h-12 px-5 rounded-2xl bg-neutral-50 border border-emerald-950/5 focus:border-[#C9A84C] outline-none font-bold text-emerald-950 transition-all font-arabic text-right" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-emerald-950/20 px-1">Description FR</label>
              <textarea value={formData.description_fr} onChange={e => setFormData({ ...formData, description_fr: e.target.value })} rows={2} className="w-full p-5 rounded-2xl bg-neutral-50 border border-emerald-950/5 focus:border-[#C9A84C] outline-none font-medium text-emerald-950 transition-all resize-none" />
            </div>
          </div>

          <div className="pt-6 flex gap-3">
             <button type="button" onClick={onClose} className="flex-1 h-14 rounded-2xl border border-emerald-950/5 text-[10px] font-black uppercase tracking-widest text-emerald-950/40 hover:bg-neutral-50 transition-colors">Annuler</button>
             <button type="submit" disabled={isLoading || isUploading} className="flex-[2] h-14 bg-emerald-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-950/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
               {isLoading ? <Loader2 className="animate-spin" size={16} /> : (brand ? 'Enregistrer' : 'Créer la Maison')}
             </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
