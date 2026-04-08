'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Customer } from './customers.store'

interface CustomerAuthStore {
  currentCustomer: Customer | null
  customer: Customer | null // compatibility
  isAuthenticated: boolean
  setCustomer: (c: Customer) => void
  logout: () => void
}

export const useCustomerAuthStore = create<CustomerAuthStore>()(
  persist(
    (set) => ({
      currentCustomer: null,
      customer: null, // compatibility
      isAuthenticated: false,
      setCustomer: (c) => set({ currentCustomer: c, customer: c, isAuthenticated: true }),
      logout: () => set({ currentCustomer: null, customer: null, isAuthenticated: false }),
    }),
    {
      name: 'amouris_customer_session',
      partialize: (s) => ({ currentCustomer: s.currentCustomer, isAuthenticated: s.isAuthenticated }),
    }
  )
)

export const useCustomerAuth = useCustomerAuthStore
