'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { registerCustomer, loginCustomer, logout as apiLogout, getCurrentUser } from '@/lib/api/auth'
import { Session } from '@supabase/supabase-js'

export interface Customer {
  id: string
  first_name: string
  last_name: string
  shop_name?: string
  phone: string
  wilaya: string
  commune: string
  is_frozen: boolean
  role: 'customer' | 'admin'
}

interface CustomerAuthStore {
  customer: Customer | null
  currentCustomer: Customer | null // compatibility alias
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  session: Session | null
  login: (phone: string, password?: string) => Promise<void>
  register: (data: any) => Promise<void>
  setCustomer: (c: Customer | null) => void
  setSession: (session: Session | null) => Promise<void>
  logout: () => Promise<void>
  checkSession: () => Promise<void>
}

export const useCustomerAuthStore = create<CustomerAuthStore>()(
  persist(
    (set, get) => ({
      customer: null,
      currentCustomer: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      session: null,

      login: async (phone, password) => {
        set({ isLoading: true, error: null })
        try {
          const { profile, ok, error } = await loginCustomer(phone, password!)
          if (!ok) throw new Error(error)
          
          set({ 
            customer: profile as any, 
            currentCustomer: profile as any, 
            isAuthenticated: true,
            isLoading: false 
          })
        } catch (err: any) {
          set({ error: err.message, isLoading: false })
          throw err
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null })
        try {
          const { ok, error, data: authData } = await registerCustomer(data)
          if (!ok) throw new Error(error)
          
          // Auto-login after registration
          if (authData?.user) {
            await get().login(data.phone, data.password)
          } else {
            throw new Error('Erreur lors de la création du compte')
          }
        } catch (err: any) {
          set({ error: err.message, isLoading: false })
          throw err
        }
      },

      setCustomer: (c) => set({ 
        customer: c, 
        currentCustomer: c, 
        isAuthenticated: !!c 
      }),

      setSession: async (session) => {
        if (!session) {
          set({ session: null, customer: null, currentCustomer: null, isAuthenticated: false })
          return
        }

        set({ session, isLoading: true })
        try {
          const data = await getCurrentUser()
          if (data?.profile) {
            set({ 
              customer: data.profile as any, 
              currentCustomer: data.profile as any, 
              isAuthenticated: true,
              isLoading: false
            })
          } else {
            set({ customer: null, currentCustomer: null, isAuthenticated: false, isLoading: false })
          }
        } catch {
          set({ customer: null, currentCustomer: null, isAuthenticated: false, isLoading: false })
        }
      },

      logout: async () => {
        await apiLogout()
        set({ 
          customer: null, 
          currentCustomer: null, 
          isAuthenticated: false,
          session: null
        })
      },

      checkSession: async () => {
        try {
          const data = await getCurrentUser()
          if (data?.profile) {
            set({ 
              customer: data.profile as any, 
              currentCustomer: data.profile as any, 
              isAuthenticated: true 
            })
          } else {
            set({ customer: null, currentCustomer: null, isAuthenticated: false })
          }
        } catch {
          set({ customer: null, currentCustomer: null, isAuthenticated: false })
        }
      }
    }),
    {
      name: 'amouris_customer_session',
    }
  )
)

export const useCustomerAuth = useCustomerAuthStore
