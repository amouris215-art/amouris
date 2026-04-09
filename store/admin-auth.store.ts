'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authApi } from '@/lib/api/auth.api'

interface AdminAuthStore {
  isAuthenticated: boolean
  email: string | null
  adminEmail: string | null // compatibility
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => Promise<void>
  checkSession: () => Promise<void>
}

export const useAdminAuthStore = create<AdminAuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      email: null,
      adminEmail: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
          await authApi.loginAdmin(email, password)
          set({ isAuthenticated: true, email, adminEmail: email, isLoading: false })
          return { ok: true }
        } catch (err: any) {
          set({ error: err.message, isLoading: false })
          return { ok: false, error: err.message }
        }
      },

      logout: async () => {
        await authApi.logout()
        set({ isAuthenticated: false, email: null, adminEmail: null })
      },

      checkSession: async () => {
        try {
          const data = await authApi.getCurrentUser()
          if (data?.profile?.role === 'admin') {
            set({ isAuthenticated: true, email: data.user.email || null, adminEmail: data.user.email || null })
          } else {
            set({ isAuthenticated: false, email: null, adminEmail: null })
          }
        } catch {
          set({ isAuthenticated: false, email: null, adminEmail: null })
        }
      }
    }),
    {
      name: 'amouris_admin_session',
      partialize: (s) => ({ isAuthenticated: s.isAuthenticated, email: s.email }),
    }
  )
)

export const useAdminAuth = useAdminAuthStore
