'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Brand } from '@/lib/types'
import { createBrand, updateBrand } from '@/lib/actions/brands'
import { uploadImage, deleteImage } from '@/lib/actions/storage'
import { Upload, X, Loader2, Store } from 'lucide-react'

interface BrandModalProps {
  brand?: Brand | null
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function BrandModal({ brand, isOpen, onClose, onSuccess }: BrandModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const [formData, setFormData] = useState<Partial<Brand>>({
    nameFR: '',
    nameAR: '',
    logo: ''
  })

  useEffect(() => {
    if (brand) {
      setFormData({
        nameFR: brand.nameFR || '',
        nameAR: brand.nameAR || '',
        logo: brand.logo || ''
      })
    } else {
      setFormData({
        nameFR: '',
        nameAR: '',
        logo: ''
      })
    }
  }, [brand, isOpen])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsUploading(true)
      try {
        const buffer = await file.arrayBuffer()
        const url = await uploadImage({
            name: file.name,
            type: file.type,
            buffer: buffer as any
        }, 'brands')
        setFormData(prev => ({ ...prev, logo: url }))
      } catch (err) {
        console.error(err);
        alert("Erreur upload");
      } finally {
        setIsUploading(false);
      }
    }
  }

  const removeImage = async () => {
    const url = formData.logo
    if (url && url.includes('supabase')) {
        try {
            await deleteImage(url, 'brands')
        } catch(e) {
            console.error(e)
        }
    }
    setFormData(prev => ({ ...prev, logo: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
        if (brand?.id) {
          await updateBrand(brand.id, formData)
        } else {
          await createBrand(formData)
        }
        if (onSuccess) onSuccess()
        onClose()
    } catch (err) {
        alert('Erreur: ' + (err as Error).message)
    } finally {
        setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-white rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-emerald-950 flex items-center gap-2">
            <Store size={24} className="text-emerald-900" />
            {brand ? 'Modifier la marque' : 'Nouvelle marque'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2 text-center">
            <label className="text-xs font-bold uppercase tracking-widest text-emerald-900/50 mb-2 block">Logo</label>
            <div className="flex justify-center">
              {formData.logo ? (
                <div className="relative w-32 h-32 border-2 border-transparent hover:border-rose-500 rounded-full overflow-hidden group shadow-sm transition-all">
                  <img src={formData.logo} alt="Logo Preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={removeImage} className="absolute inset-0 m-auto w-10 h-10 flex items-center justify-center bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity scale-75 group-hover:scale-100"><X size={18}/></button>
                </div>
              ) : (
                <label className="w-32 h-32 border-2 border-dashed border-emerald-900/20 rounded-full flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-50 transition-colors bg-gray-50/50">
                  {isUploading ? <Loader2 size={24} className="animate-spin text-emerald-900/40" /> : <Upload size={24} className="text-emerald-900/40 mb-1" />}
                  <span className="text-[9px] font-bold uppercase text-emerald-900/40">{isUploading ? 'Uploading...' : 'Upload Logo'}</span>
                  <input type="file" accept="image/*" className="hidden" disabled={isUploading} onChange={handleImageUpload} />
                </label>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-emerald-900/50">Nom (FR)</label>
              <input required value={formData.nameFR} onChange={e => setFormData({ ...formData, nameFR: e.target.value })} className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-emerald-900/50">Nom (AR)</label>
              <input required value={formData.nameAR} onChange={e => setFormData({ ...formData, nameAR: e.target.value })} dir="rtl" className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white text-right font-arabic" />
            </div>
          </div>

          <div className="pt-6 border-t">
           <Button type="submit" disabled={isLoading || isUploading} className="w-full bg-emerald-900 hover:bg-emerald-800 text-white py-6 rounded-xl font-black text-lg shadow-xl shadow-emerald-900/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
             {isLoading ? <Loader2 className="animate-spin" size={24} /> : (brand ? 'Enregistrer' : 'Créer')}
           </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
