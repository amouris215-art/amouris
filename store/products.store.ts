'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface FlaconVariant {
  id: string
  size_ml: number
  color: string
  color_name: string
  shape: string
  price: number
  stock_units: number
}

export interface Product {
  id: string
  product_type: 'perfume' | 'flacon'
  name_fr: string
  name_ar: string
  slug: string
  description_fr: string
  description_ar: string
  category_id: string
  brand_id: string | null
  collection_id: string | null
  tag_ids: string[]
  price_per_gram?: number
  stock_grams?: number
  base_price?: number
  variants?: FlaconVariant[]
  images: string[]
  status: 'active' | 'draft'
  created_at: string
}

interface ProductsStore {
  products: Product[]
  _seeded: boolean
  seed: (data: Product[]) => void
  addProduct: (p: Omit<Product, 'id' | 'created_at'>) => Product
  updateProduct: (id: string, updates: Partial<Product>) => void
  deleteProduct: (id: string) => void
  getBySlug: (slug: string) => Product | undefined
  getActiveByTag: (tagId: string) => Product[]
  getActiveByType: (type: 'perfume' | 'flacon') => Product[]
  updateStockGrams: (id: string, delta: number) => void
  updateVariantStock: (productId: string, variantId: string, delta: number) => void
}

export const useProductsStore = create<ProductsStore>()(
  persist(
    (set, get) => ({
      products: [],
      _seeded: false,

      seed: (data) => {
        if (!get()._seeded) set({ products: data, _seeded: true })
      },

      addProduct: (data) => {
        const slug = data.name_fr
          .toLowerCase()
          .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '')
          + '-' + Date.now()
        const p: Product = {
          ...data,
          id: `p_${Date.now()}`,
          slug: data.slug || slug,
          created_at: new Date().toISOString(),
        }
        set(s => ({ products: [...s.products, p] }))
        return p
      },

      updateProduct: (id, updates) =>
        set(s => ({ products: s.products.map(p => p.id === id ? { ...p, ...updates } : p) })),

      deleteProduct: (id) =>
        set(s => ({ products: s.products.filter(p => p.id !== id) })),

      getBySlug: (slug) => get().products.find(p => p.slug === slug),

      getActiveByTag: (tagId) =>
        get().products.filter(p => p.status === 'active' && p.tag_ids.includes(tagId)),

      getActiveByType: (type) =>
        get().products.filter(p => p.status === 'active' && p.product_type === type),

      updateStockGrams: (id, delta) =>
        set(s => ({
          products: s.products.map(p =>
            p.id === id ? { ...p, stock_grams: Math.max(0, (p.stock_grams || 0) + delta) } : p
          ),
        })),

      updateVariantStock: (productId, variantId, delta) =>
        set(s => ({
          products: s.products.map(p =>
            p.id === productId
              ? {
                  ...p,
                  variants: p.variants?.map(v =>
                    v.id === variantId
                      ? { ...v, stock_units: Math.max(0, v.stock_units + delta) }
                      : v
                  ),
                }
              : p
          ),
        })),
    }),
    { name: 'amouris_products' }
  )
)
