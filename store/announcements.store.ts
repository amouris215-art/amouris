'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Announcement {
  id: string
  text_fr: string
  text_ar: string
  is_active: boolean
  display_order: number
}

interface AnnouncementsStore {
  announcements: Announcement[]
  _seeded: boolean
  seed: (data: Announcement[]) => void
  add: (a: Omit<Announcement, 'id'>) => void
  update: (id: string, updates: Partial<Announcement>) => void
  remove: (id: string) => void
  getActive: () => Announcement[]
}

export const useAnnouncementsStore = create<AnnouncementsStore>()(
  persist(
    (set, get) => ({
      announcements: [],
      _seeded: false,
      seed: (data) => { if (!get()._seeded) set({ announcements: data, _seeded: true }) },
      add: (a) => set(s => ({ announcements: [...s.announcements, { ...a, id: `ann_${Date.now()}` }] })),
      update: (id, u) => set(s => ({ announcements: s.announcements.map(a => a.id === id ? { ...a, ...u } : a) })),
      remove: (id) => set(s => ({ announcements: s.announcements.filter(a => a.id !== id) })),
      getActive: () => get().announcements.filter(a => a.is_active).sort((a, b) => a.display_order - b.display_order),
    }),
    { name: 'amouris_announcements' }
  )
)
