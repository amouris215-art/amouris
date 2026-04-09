'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { fetchTags, tagApi } from '@/lib/api/catalogue'

export interface Tag {
  id: string
  name_fr: string
  name_ar: string
  slug: string
  show_on_homepage: boolean
  homepage_order: number
}

interface TagsStore {
  tags: Tag[]
  isLoading: boolean
  error: string | null
  lastUpdated: number | null
  fetchTags: (force?: boolean) => Promise<void>
  addTag: (t: Omit<Tag, 'id'>) => Promise<void>
  update: (id: string, updates: Partial<Tag>) => Promise<void>
  deleteTag: (id: string) => Promise<void>
  getHomepageTags: () => Tag[]
  seed: (tags: Tag[]) => void
}

const CACHE_DURATION = 5 * 60 * 1000

export const useTagsStore = create<TagsStore>()(
  persist(
    (set, get) => ({
      tags: [],
      isLoading: false,
      error: null,
      lastUpdated: null,

      fetchTags: async (force = false) => {
        const { lastUpdated, tags } = get()
        const now = Date.now()

        if (!force && lastUpdated && now - lastUpdated < CACHE_DURATION && tags.length > 0) {
          return
        }

        set({ isLoading: true, error: null })
        try {
          const data = await fetchTags()
          set({ tags: data || [], lastUpdated: now, isLoading: false })
        } catch (err: any) {
          set({ error: err.message, isLoading: false })
        }
      },

      addTag: async (tag) => {
        set({ isLoading: true })
        try {
          const data = await tagApi.create(tag)
          set(s => ({ tags: [...s.tags, data], isLoading: false }))
        } catch (err: any) {
          set({ error: err.message, isLoading: false })
          throw err
        }
      },

      update: async (id, updates) => {
        set({ isLoading: true })
        try {
          const data = await tagApi.update(id, updates)
          set(s => ({
            tags: s.tags.map(t => t.id === id ? { ...t, ...data } : t),
            isLoading: false
          }))
        } catch (err: any) {
          set({ error: err.message, isLoading: false })
          throw err
        }
      },

      deleteTag: async (id) => {
        set({ isLoading: true })
        try {
          await tagApi.remove(id)
          set(s => ({ tags: s.tags.filter(t => t.id !== id), isLoading: false }))
        } catch (err: any) {
          set({ error: err.message, isLoading: false })
          throw err
        }
      },

      getHomepageTags: () => {
        return get().tags
          .filter(t => t.show_on_homepage)
          .sort((a, b) => (a.homepage_order || 0) - (b.homepage_order || 0))
      },
      
      seed: (tags) => set({ tags, lastUpdated: Date.now() })
    }),
    {
      name: 'amouris_tags_cache',
    }
  )
)
