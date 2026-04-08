'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Brand {
  id: string
  name: string
  name_ar: string
  logo_url: string | null
  description_fr: string
}

interface BrandsStore {
  brands: Brand[]
  _seeded: boolean
  seed: (data: Brand[]) => void
  add: (b: Omit<Brand, 'id'>) => void
  update: (id: string, updates: Partial<Brand>) => void
  remove: (id: string) => void
}

export const useBrandsStore = create<BrandsStore>()(
  persist(
    (set, get) => ({
      brands: [],
      _seeded: false,
      seed: (data) => { if (!get()._seeded) set({ brands: data, _seeded: true }) },
      add: (b) => set(s => ({ brands: [...s.brands, { ...b, id: `br_${Date.now()}` }] })),
      update: (id, u) => set(s => ({ brands: s.brands.map(b => b.id === id ? { ...b, ...u } : b) })),
      remove: (id) => set(s => ({ brands: s.brands.filter(b => b.id !== id) })),
    }),
    { name: 'amouris_brands' }
  )
)
