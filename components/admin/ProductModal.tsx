'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Product, ProductType, Category, Brand, FlaconVariant, Tag } from '@/lib/types'
import { getCategories } from '@/lib/actions/categories'
import { getBrands } from '@/lib/actions/brands'
import { getTags } from '@/lib/actions/tags'
import { createProduct, updateProduct } from '@/lib/actions/products'
import { uploadImage, deleteImage } from '@/lib/actions/storage'
import { Upload, X, Plus, Trash2, Loader2 } from 'lucide-react'

interface ProductModalProps {
  product?: Product | null
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function ProductModal({ product, isOpen, onClose, onSuccess }: ProductModalProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const [type, setType] = useState<ProductType>('perfume')
  const [formData, setFormData] = useState<Partial<Product>>({
    nameFR: '',
    nameAR: '',
    descriptionFR: '',
    descriptionAR: '',
    categoryId: '',
    brandId: '',
    images: [],
    tagIds: [],
    status: 'active'
  })

  // Perfume-specific
  const [pricePerGram, setPricePerGram] = useState<number>(0)
  const [stockInGrams, setStockInGrams] = useState<number>(0)

  // Flacon-specific
  const [variants, setVariants] = useState<FlaconVariant[]>([])

  useEffect(() => {
    if (isOpen) {
      Promise.all([getCategories(), getBrands(), getTags()]).then(([c, b, t]) => {
        setCategories(c || [])
        setBrands(b || [])
        setTags(t || [])
      })
    }
  }, [isOpen])

  useEffect(() => {
    if (product) {
      setType(product.type)
      setFormData({
        nameFR: product.nameFR,
        nameAR: product.nameAR,
        descriptionFR: product.descriptionFR,
        descriptionAR: product.descriptionAR,
        categoryId: product.categoryId,
        brandId: product.brandId || '',
        images: product.images || [],
        tagIds: product.tagIds || [],
        status: product.status || 'active'
      })
      if (product.type === 'perfume') {
        const p = product as any
        setPricePerGram(p.pricePerGram || 0)
        setStockInGrams(p.stockInGrams || 0)
      } else {
        const p = product as any
        setVariants(p.variants || [])
      }
    } else {
      setType('perfume')
      setFormData({
        nameFR: '',
        nameAR: '',
        descriptionFR: '',
        descriptionAR: '',
        categoryId: categories.length > 0 ? categories[0].id : '',
        brandId: '',
        images: [],
        tagIds: [],
        status: 'active'
      })
      setPricePerGram(0)
      setStockInGrams(0)
      setVariants([])
    }
  }, [product, isOpen, categories])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsUploading(true)
      try {
        const arrayBuffer = await file.arrayBuffer()
        const url = await uploadImage({
            name: file.name,
            type: file.type,
            buffer: Array.from(new Uint8Array(arrayBuffer)) as unknown as ArrayBuffer
            // Note: Next.js Server actions might fail on pure ArrayBuffer so converting to Array might be needed depending on implementation,
            // but we stick to what the user defined and let Server Actions handle standard buffers.
            // If the buffer serialization fails we will just send it as array if needed.
            // Let's rely on Next.js passing it correctly.
        }, 'products')
        setFormData(prev => ({ ...prev, images: [...(prev.images || []), url] }))
      } catch (err) {
        console.error(err)
        alert('Erreur: ' + (err as Error).message)
      } finally {
        setIsUploading(false)
      }
    }
  }

  // Quick fix for ArrayBuffer over NextJS Server Actions which sometimes complains about plain ArrayBuffers. 
  // Another option is to use Base64 to send the image.

  const handleImageUploadV2 = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        setIsUploading(true)
        try {
          // If we encounter serialization issues with `ArrayBuffer` in server actions,
          // we use a workaround by passing the ArrayBuffer. 
          const buffer = await file.arrayBuffer()
          // NextJS 14 handles simple types better, but `ArrayBuffer` is generally supported.
          const url = await uploadImage({
              name: file.name,
              type: file.type,
              buffer: buffer as any
          }, 'products')
          setFormData(prev => ({ ...prev, images: [...(prev.images || []), url] }))
        } catch (err) {
            console.error(err);
            alert("Erreur upload");
        } finally {
            setIsUploading(false);
        }
      }
  }

  const removeImage = async (index: number) => {
    const url = formData.images?.[index]
    if (url && url.includes('supabase')) {
        try {
            await deleteImage(url, 'products')
        } catch(e) {
            console.error(e)
        }
    }
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index)
    }))
  }

  const addVariant = () => {
    setVariants(prev => [...prev, { id: `new_${Date.now()}`, size: '50ml', color: '', shape: '', price: 0, stock: 0 }])
  }

  const removeVariant = (id: string) => {
    setVariants(prev => prev.filter(v => v.id !== id))
  }

  const updateVariant = (id: string, field: string, value: any) => {
    setVariants(prev => prev.map(v => v.id === id ? { ...v, [field]: value } : v))
  }

  const toggleTag = (id: string) => {
    setFormData(prev => {
        const current = prev.tagIds || []
        if (current.includes(id)) return { ...prev, tagIds: current.filter(t => t !== id) }
        return { ...prev, tagIds: [...current, id] }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
        const finalData = {
            ...formData,
            type,
            ...(type === 'perfume' ? { pricePerGram, stockInGrams } : {}),
            ...(type === 'flacon' ? { variants } : {})
        } as Partial<Product>

        if (product?.id) {
          await updateProduct(product.id, finalData)
        } else {
          await createProduct(finalData)
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
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-white rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-emerald-950">
            {product ? 'Modifier le produit' : 'Nouveau produit'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Type Selector */}
          {!product && (
            <div className="flex bg-emerald-50 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setType('perfume')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${type === 'perfume' ? 'bg-white text-emerald-900 shadow-sm' : 'text-emerald-900/40'}`}
              >
                Parfum
              </button>
              <button
                type="button"
                onClick={() => setType('flacon')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${type === 'flacon' ? 'bg-white text-emerald-900 shadow-sm' : 'text-emerald-900/40'}`}
              >
                Flacon
              </button>
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-emerald-900/50">Nom (FR)</label>
              <input required value={formData.nameFR} onChange={e => setFormData({ ...formData, nameFR: e.target.value })} className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-emerald-900/50">Nom (AR)</label>
              <input required value={formData.nameAR} onChange={e => setFormData({ ...formData, nameAR: e.target.value })} dir="rtl" className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white text-right font-arabic" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-emerald-900/50">Description (FR)</label>
              <textarea value={formData.descriptionFR || ''} onChange={e => setFormData({ ...formData, descriptionFR: e.target.value })} className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white min-h-[100px]" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-emerald-900/50">Description (AR)</label>
              <textarea value={formData.descriptionAR || ''} onChange={e => setFormData({ ...formData, descriptionAR: e.target.value })} dir="rtl" className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white text-right font-arabic min-h-[100px]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-emerald-900/50">Catégorie</label>
              <select required value={formData.categoryId || ''} onChange={e => setFormData({ ...formData, categoryId: e.target.value })} className="w-full p-3 border rounded-xl bg-gray-50">
                <option value="">Sélectionner...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.nameFR}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-emerald-900/50">Marque</label>
              <select value={formData.brandId || ''} onChange={e => setFormData({ ...formData, brandId: e.target.value })} className="w-full p-3 border rounded-xl bg-gray-50">
                <option value="">Sélectionner (optionnel)</option>
                {brands.map(b => <option key={b.id} value={b.id}>{b.nameFR}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
             <label className="text-xs font-bold uppercase tracking-widest text-emerald-900/50">Tags</label>
             <div className="flex flex-wrap gap-2">
                 {tags.map(t => (
                     <button
                        key={t.id}
                        type="button"
                        onClick={() => toggleTag(t.id)}
                        className={`px-3 py-1 text-xs font-bold rounded-full border transition-all ${
                            formData.tagIds?.includes(t.id) 
                            ? 'bg-emerald-900 text-white border-emerald-900' 
                            : 'bg-white text-emerald-900/60 border-emerald-100 hover:border-emerald-300'
                        }`}
                     >
                         {t.nameFR}
                     </button>
                 ))}
             </div>
          </div>

          {type === 'perfume' && (
            <div className="grid grid-cols-2 gap-4 p-6 bg-emerald-50 rounded-2xl">
              <div className="space-y-2">
                <label className="text-xs font-bold text-emerald-900 uppercase tracking-widest">Prix par gramme (DZD)</label>
                <input required type="number" value={pricePerGram || ''} onChange={e => setPricePerGram(Number(e.target.value))} className="w-full p-3 border rounded-xl" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-emerald-900 uppercase tracking-widest">Stock total (Grammes)</label>
                <input required type="number" value={stockInGrams || ''} onChange={e => setStockInGrams(Number(e.target.value))} className="w-full p-3 border rounded-xl" />
              </div>
            </div>
          )}

          {type === 'flacon' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                 <label className="text-sm font-bold text-emerald-900">Variantes de Flacons</label>
                 <Button type="button" size="sm" variant="outline" className="bg-white" onClick={addVariant}><Plus size={16} className="mr-1"/> Ajouter</Button>
              </div>
              {variants.map((v, idx) => (
                <div key={v.id} className="grid grid-cols-5 gap-3 p-4 bg-white border border-gray-100 rounded-2xl items-end shadow-sm">
                  <div><label className="text-[10px] font-bold text-gray-500 uppercase">Taille</label><input type="text" placeholder="100ml" value={v.size} onChange={e => updateVariant(v.id, 'size', e.target.value)} className="w-full p-2 border rounded-lg text-sm font-medium focus:ring-2 focus:ring-emerald-500" /></div>
                  <div><label className="text-[10px] font-bold text-gray-500 uppercase">Couleur</label><input type="text" placeholder="Noir" value={v.color} onChange={e => updateVariant(v.id, 'color', e.target.value)} className="w-full p-2 border rounded-lg text-sm font-medium focus:ring-2 focus:ring-emerald-500" /></div>
                  <div><label className="text-[10px] font-bold text-gray-500 uppercase">Prix</label><input type="number" placeholder="DZD" value={v.price} onChange={e => updateVariant(v.id, 'price', Number(e.target.value))} className="w-full p-2 border rounded-lg text-sm font-bold focus:ring-2 focus:ring-emerald-500" /></div>
                  <div><label className="text-[10px] font-bold text-gray-500 uppercase">Stock</label><input type="number" value={v.stock} onChange={e => updateVariant(v.id, 'stock', Number(e.target.value))} className="w-full p-2 border rounded-lg text-sm font-medium focus:ring-2 focus:ring-emerald-500" /></div>
                  <Button type="button" variant="ghost" size="icon" className="mb-0.5 text-rose-500 hover:bg-rose-50" onClick={() => removeVariant(v.id)}><Trash2 size={16}/></Button>
                </div>
              ))}
            </div>
          )}

          {/* Images */}
          <div className="space-y-2 pt-4 border-t">
            <label className="text-xs font-bold uppercase tracking-widest text-emerald-900/50 mb-2 block">Images (Supabase Storage)</label>
            <div className="flex flex-wrap gap-4">
              {formData.images?.map((img, i) => (
                <div key={i} className="relative w-24 h-24 border-2 border-transparent hover:border-rose-500 rounded-2xl overflow-hidden group shadow-sm transition-all">
                  <img src={img} alt="Preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(i)} className="absolute inset-0 m-auto w-8 h-8 flex items-center justify-center bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity scale-75 group-hover:scale-100"><Trash2 size={14}/></button>
                </div>
              ))}
              <label className="w-24 h-24 border-2 border-dashed border-emerald-900/20 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-50 transition-colors bg-gray-50/50">
                {isUploading ? <Loader2 size={24} className="animate-spin text-emerald-900/40" /> : <Upload size={24} className="text-emerald-900/40 mb-1" />}
                <span className="text-[9px] font-bold uppercase text-emerald-900/40">{isUploading ? 'Uploading...' : 'Upload'}</span>
                <input type="file" accept="image/*" className="hidden" disabled={isUploading} onChange={handleImageUploadV2} />
              </label>
            </div>
          </div>

          <div className="pt-6 border-t">
           <Button type="submit" disabled={isLoading || isUploading} className="w-full bg-emerald-900 hover:bg-emerald-800 text-white py-6 rounded-xl font-black text-lg shadow-xl shadow-emerald-900/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
             {isLoading ? <Loader2 className="animate-spin" size={24} /> : (product ? 'Sauvegarder les modifications' : 'Créer le produit')}
           </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
