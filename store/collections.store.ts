'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Collection {
  id: string
  name_fr: string
  name_ar: string
  description_fr: string
  cover_url: string | null
}

interface CollectionsStore {
  collections: Collection[]
  _seeded: boolean
  seed: (data: Collection[]) => void
  add: (c: Omit<Collection, 'id'>) => void
  update: (id: string, updates: Partial<Collection>) => void
  remove: (id: string) => void
}

export const useCollectionsStore = create<CollectionsStore>()(
  persist(
    (set, get) => ({
      collections: [],
      _seeded: false,
      seed: (data) => { if (!get()._seeded) set({ collections: data, _seeded: true }) },
      add: (c) => set(s => ({ collections: [...s.collections, { ...c, id: `col_${Date.now()}` }] })),
      update: (id, u) => set(s => ({ collections: s.collections.map(c => c.id === id ? { ...c, ...u } : c) })),
      remove: (id) => set(s => ({ collections: s.collections.filter(c => c.id !== id) })),
    }),
    { name: 'amouris_collections' }
  )
)
