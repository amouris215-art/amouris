'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { 
  fetchAnnouncements, 
  createAnnouncement, 
  updateAnnouncement as updateAnnApi, 
  deleteAnnouncement as deleteAnnApi 
} from '@/lib/api/announcements'

export interface Announcement {
  id: string
  text_fr: string
  text_ar: string
  is_active: boolean
  display_order: number
}

interface AnnouncementsStore {
  announcements: Announcement[]
  isLoading: boolean
  error: string | null
  fetchAnnouncements: () => Promise<void>
  add: (a: Omit<Announcement, 'id'>) => Promise<void>
  update: (id: string, updates: Partial<Announcement>) => Promise<void>
  remove: (id: string) => Promise<void>
  getActive: () => Announcement[]
}

export const useAnnouncementsStore = create<AnnouncementsStore>()(
  persist(
    (set, get) => ({
      announcements: [],
      isLoading: false,
      error: null,

      fetchAnnouncements: async () => {
        set({ isLoading: true, error: null })
        try {
          const data = await fetchAnnouncements()
          set({ announcements: data, isLoading: false })
        } catch (err: any) {
          set({ error: err.message, isLoading: false })
        }
      },

      add: async (a) => {
        set({ isLoading: true })
        try {
          const newItem = await createAnnouncement(a)
          set(s => ({ 
            announcements: [...s.announcements, newItem],
            isLoading: false 
          }))
        } catch (err: any) {
          set({ error: err.message, isLoading: false })
        }
      },

      update: async (id, u) => {
        // Optimistic update
        const prev = get().announcements
        set(s => ({
          announcements: s.announcements.map(a => a.id === id ? { ...a, ...u } : a)
        }))

        try {
          await updateAnnApi(id, u)
        } catch (err: any) {
          set({ announcements: prev, error: err.message })
        }
      },

      remove: async (id) => {
        const prev = get().announcements
        set(s => ({
          announcements: s.announcements.filter(a => a.id !== id)
        }))

        try {
          await deleteAnnApi(id)
        } catch (err: any) {
          set({ announcements: prev, error: err.message })
        }
      },

      getActive: () => {
        return get().announcements
          .filter(a => a.is_active)
          .sort((a, b) => a.display_order - b.display_order)
      },
    }),
    { name: 'amouris_announcements' }
  )
)
