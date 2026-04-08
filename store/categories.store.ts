'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Category {
  id: string
  name_fr: string
  name_ar: string
  slug: string
}

interface CategoriesStore {
  categories: Category[]
  _seeded: boolean
  seed: (data: Category[]) => void
  add: (c: Omit<Category, 'id'>) => void
  update: (id: string, updates: Partial<Category>) => void
  remove: (id: string) => void
}

export const useCategoriesStore = create<CategoriesStore>()(
  persist(
    (set, get) => ({
      categories: [],
      _seeded: false,
      seed: (data) => { if (!get()._seeded) set({ categories: data, _seeded: true }) },
      add: (c) => set(s => ({
        categories: [...s.categories, { ...c, id: `cat_${Date.now()}` }]
      })),
      update: (id, u) => set(s => ({
        categories: s.categories.map(c => c.id === id ? { ...c, ...u } : c)
      })),
      remove: (id) => set(s => ({ categories: s.categories.filter(c => c.id !== id) })),
    }),
    { name: 'amouris_categories' }
  )
)
