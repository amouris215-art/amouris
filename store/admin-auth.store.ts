'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AdminAuthStore {
  isAuthenticated: boolean
  email: string | null
  adminEmail: string | null // compatibility
  login: (email: string, password: string) => { ok: boolean; error?: string }
  logout: () => void
}

export const useAdminAuthStore = create<AdminAuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      email: null,
      adminEmail: null, // compatibility
      login: (email, password) => {
        if (email === 'admin@gmail.com' && password === '123456') {
          set({ isAuthenticated: true, email, adminEmail: email })
          return { ok: true }
        }
        return { ok: false, error: 'Identifiants incorrects' }
      },
      logout: () => set({ isAuthenticated: false, email: null, adminEmail: null }),
    }),
    {
      name: 'amouris_admin_session',
      partialize: (s) => ({ isAuthenticated: s.isAuthenticated, email: s.email }),
    }
  )
)

export const useAdminAuth = useAdminAuthStore
