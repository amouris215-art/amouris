'use client'
import { create } from 'zustand'
import { fetchCollections, collectionApi } from '@/lib/api/catalogue'

export interface Collection {
  id: string
  name_fr: string
  name_ar: string
  description_fr: string
  cover_url: string | null
}

export interface CollectionsStore {
  collections: Collection[]
  isLoading: boolean
  error: string | null
  fetchCollections: () => Promise<void>
  addCollection: (c: Omit<Collection, 'id'>) => Promise<void>
  updateCollection: (id: string, updates: Partial<Collection>) => Promise<void>
  deleteCollection: (id: string) => Promise<void>
  
  // Aliases for compatibility
  add: (c: Omit<Collection, 'id'>) => Promise<void>
  update: (id: string, updates: Partial<Collection>) => Promise<void>
  remove: (id: string) => Promise<void>
  seed: (collections: Collection[]) => void
}

export const useCollectionsStore = create<CollectionsStore>((set, get) => ({
  collections: [],
  isLoading: false,
  error: null,

  fetchCollections: async () => {
    set({ isLoading: true })
    try {
      const data = await fetchCollections()
      set({ collections: data || [], isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  addCollection: async (collection) => {
    set({ isLoading: true })
    try {
      const data = await collectionApi.create(collection)
      set(s => ({ collections: [...s.collections, data], isLoading: false }))
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  updateCollection: async (id, updates) => {
    set({ isLoading: true })
    try {
      const data = await collectionApi.update(id, updates)
      set(s => ({
        collections: s.collections.map(c => c.id === id ? { ...c, ...data } : c),
        isLoading: false
      }))
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  deleteCollection: async (id) => {
    set({ isLoading: true })
    try {
      await collectionApi.remove(id)
      set(s => ({ collections: s.collections.filter(c => c.id !== id), isLoading: false }))
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  add: (c) => get().addCollection(c),
  update: (id, u) => get().updateCollection(id, u),
  remove: (id) => get().deleteCollection(id),
  seed: (collections) => set({ collections })
}))
