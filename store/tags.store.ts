'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
  _seeded: boolean
  seed: (data: Tag[]) => void
  add: (t: Omit<Tag, 'id'>) => void
  update: (id: string, updates: Partial<Tag>) => void
  remove: (id: string) => void
  getHomepageTags: () => Tag[]
}

export const useTagsStore = create<TagsStore>()(
  persist(
    (set, get) => ({
      tags: [],
      _seeded: false,
      seed: (data) => { if (!get()._seeded) set({ tags: data, _seeded: true }) },
      add: (t) => set(s => ({ tags: [...s.tags, { ...t, id: `tag_${Date.now()}` }] })),
      update: (id, u) => set(s => ({ tags: s.tags.map(t => t.id === id ? { ...t, ...u } : t) })),
      remove: (id) => set(s => ({ tags: s.tags.filter(t => t.id !== id) })),
      getHomepageTags: () =>
        get().tags
          .filter(t => t.show_on_homepage)
          .sort((a, b) => a.homepage_order - b.homepage_order),
    }),
    { name: 'amouris_tags' }
  )
)
