'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { fetchBrands, createBrand, updateBrand as updateBrandApi, removeBrand } from '@/lib/api/catalogue'

export interface Brand {
  id: string
  name: string
  name_ar: string
  logo_url: string | null
  description_fr: string
}

interface BrandsStore {
  brands: Brand[]
  isLoading: boolean
  error: string | null
  lastUpdated: number | null
  fetchBrands: (force?: boolean) => Promise<void>
  addBrand: (b: Omit<Brand, 'id'>) => Promise<void>
  update: (id: string, updates: Partial<Brand>) => Promise<void>
  deleteBrand: (id: string) => Promise<void>
  seed: (brands: Brand[]) => void
}

const CACHE_DURATION = 5 * 60 * 1000

export const useBrandsStore = create<BrandsStore>()(
  persist(
    (set, get) => ({
      brands: [],
      isLoading: false,
      error: null,
      lastUpdated: null,

      fetchBrands: async (force = false) => {
        const { lastUpdated, brands } = get()
        const now = Date.now()

        if (!force && lastUpdated && now - lastUpdated < CACHE_DURATION && brands.length > 0) {
          return
        }

        set({ isLoading: true, error: null })
        try {
          const data = await fetchBrands()
          set({ brands: data || [], lastUpdated: now, isLoading: false })
        } catch (err: any) {
          set({ error: err.message, isLoading: false })
        }
      },

      addBrand: async (brand) => {
        set({ isLoading: true })
        try {
          const data = await createBrand(brand)
          set(s => ({ brands: [...s.brands, data], isLoading: false }))
        } catch (err: any) {
          set({ error: err.message, isLoading: false })
          throw err
        }
      },

      update: async (id, updates) => {
        set({ isLoading: true })
        try {
          const data = await updateBrandApi(id, updates)
          set(s => ({
            brands: s.brands.map(b => b.id === id ? { ...b, ...data } : b),
            isLoading: false
          }))
        } catch (err: any) {
          set({ error: err.message, isLoading: false })
          throw err
        }
      },

      deleteBrand: async (id) => {
        set({ isLoading: true })
        try {
          await removeBrand(id)
          set(s => ({ brands: s.brands.filter(b => b.id !== id), isLoading: false }))
        } catch (err: any) {
          set({ error: err.message, isLoading: false })
          throw err
        }
      },

      seed: (brands) => set({ brands, lastUpdated: Date.now() })
    }),
    { name: 'amouris_brands_cache' }
  )
)
