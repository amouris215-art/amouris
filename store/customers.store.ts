'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { fetchAllCustomers, freezeCustomer, deleteCustomer, resetCustomerPassword } from '@/lib/api/customers'
import { registerCustomer } from '@/lib/api/auth'

export interface Customer {
  id: string
  first_name: string
  last_name: string
  phone: string
  phone_number: string // alias for UI
  shop_name?: string
  wilaya: string
  commune?: string
  password?: string
  is_frozen: boolean
  status: 'active' | 'frozen' // alias for UI
  role?: string
  order_count?: number
  total_spent?: number
  created_at: string
}

interface CustomersStore {
  customers: Customer[]
  isLoading: boolean
  error: string | null
  lastUpdated: number | null
  fetchCustomers: (force?: boolean) => Promise<void>
  register: (data: any) => Promise<{ ok: boolean; customer?: Customer; error?: string }>
  freeze: (id: string) => Promise<void>
  unfreeze: (id: string) => Promise<void>
  toggleFreeze: (id: string) => Promise<void>
  remove: (id: string) => Promise<void>
  resetPassword: (id: string, newPassword: string) => Promise<void>
  update: (id: string, updates: Partial<Customer>) => Promise<{ ok: boolean; customer?: Customer; error?: string }>
  getById: (id: string) => Customer | undefined
}

const CACHE_DURATION = 5 * 60 * 1000

export const useCustomersStore = create<CustomersStore>()(
  persist(
    (set, get) => ({
      customers: [],
      isLoading: false,
      error: null,
      lastUpdated: null,

      fetchCustomers: async (force = false) => {
        const { lastUpdated, customers } = get()
        const now = Date.now()

        if (!force && lastUpdated && now - lastUpdated < CACHE_DURATION && customers.length > 0) {
          return
        }

        set({ isLoading: true, error: null })
        try {
          const data = await fetchAllCustomers()
          
          const transformed = (data || []).map(c => ({
            ...c,
            phone_number: c.phone,
            status: c.is_frozen ? 'frozen' : 'active'
          }))
          
          set({ customers: transformed, lastUpdated: now, isLoading: false })
        } catch (err: any) {
          set({ error: err.message, isLoading: false })
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null })
        try {
          const { ok, user, error } = await registerCustomer(data)
          if (!ok) throw new Error(error)

          // Fetch customers again to get the new profile and stats
          await get().fetchCustomers(true)
          
          const customer = get().customers.find(c => c.id === user?.id)
          return { ok: true, customer }
        } catch (err: any) {
          set({ error: err.message, isLoading: false })
          return { ok: false, error: err.message }
        }
      },

      freeze: async (id) => {
        set({ isLoading: true })
        try {
          await freezeCustomer(id, true)
          set(s => ({
            customers: s.customers.map(c => c.id === id ? { ...c, is_frozen: true, status: 'frozen' } : c),
            isLoading: false
          }))
        } catch (err: any) {
          set({ error: err.message, isLoading: false })
        }
      },

      unfreeze: async (id) => {
        set({ isLoading: true })
        try {
          await freezeCustomer(id, false)
          set(s => ({
            customers: s.customers.map(c => c.id === id ? { ...c, is_frozen: false, status: 'active' } : c),
            isLoading: false
          }))
        } catch (err: any) {
          set({ error: err.message, isLoading: false })
        }
      },

      toggleFreeze: async (id) => {
        const customer = get().customers.find(c => c.id === id)
        if (!customer) return
        if (customer.is_frozen) {
          return get().unfreeze(id)
        } else {
          return get().freeze(id)
        }
      },

      remove: async (id) => {
        set({ isLoading: true })
        try {
          await deleteCustomer(id)
          set(s => ({ customers: s.customers.filter(c => c.id !== id), isLoading: false }))
        } catch (err: any) {
          set({ error: err.message, isLoading: false })
        }
      },

      resetPassword: async (id, pwd) => {
        set({ isLoading: true })
        try {
          await resetCustomerPassword(id, pwd)
          set({ isLoading: false })
        } catch (err: any) {
          set({ error: err.message, isLoading: false })
        }
      },

      update: async (id, updates) => {
        set({ isLoading: true, error: null })
        try {
          // Note: profile updates should be done via a profile API in customers.ts if needed
          // For now, using admin client to update profile
          const { createAdminClient } = await import('@/lib/supabase/admin')
          const admin = createAdminClient()
          const { data, error } = await admin
            .from('profiles')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

          if (error) throw error

          const updated = {
            ...data,
            phone_number: data.phone,
            status: data.is_frozen ? 'frozen' : 'active'
          }

          set(s => ({
            customers: s.customers.map(c => c.id === id ? { ...c, ...updated } : c),
            isLoading: false
          }))
          
          return { ok: true, customer: updated as Customer }
        } catch (err: any) {
          set({ error: err.message, isLoading: false })
          return { ok: false, error: err.message }
        }
      },

      getById: (id) => get().customers.find(c => c.id === id),
    }),
    {
      name: 'amouris_customers_cache',
    }
  )
)
