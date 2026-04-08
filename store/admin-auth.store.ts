'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AdminAuthStore {
  isAdminAuthenticated: boolean
  adminEmail: string | null
  login: (email: string, password: string) => { ok: boolean; error?: string }
  logout: () => void
}

const ADMIN_CREDENTIALS = {
  email: 'admin@gmail.com',
  password: '123456',
}

export const useAdminAuth = create<AdminAuthStore>()(
  persist(
    (set) => ({
      isAdminAuthenticated: false,
      adminEmail: null,

      login: (email, password) => {
        if (
          email.trim().toLowerCase() === ADMIN_CREDENTIALS.email &&
          password === ADMIN_CREDENTIALS.password
        ) {
          set({ isAdminAuthenticated: true, adminEmail: email })
          return { ok: true }
        }
        return { ok: false, error: 'Email ou mot de passe administrateur incorrect' }
      },

      logout: () => set({ isAdminAuthenticated: false, adminEmail: null }),
    }),
    {
      name: 'amouris_admin_session',
      partialize: (s) => ({
        isAdminAuthenticated: s.isAdminAuthenticated,
        adminEmail: s.adminEmail,
      }),
    }
  )
)
