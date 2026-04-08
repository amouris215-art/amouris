'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Customer } from './customers.store'

interface CustomerAuthStore {
  customer: Customer | null
  currentCustomer: Customer | null // compatibility alias
  isAuthenticated: boolean
  setCustomer: (c: Customer | null) => void
  logout: () => void
}

export const useCustomerAuthStore = create<CustomerAuthStore>()(
  persist(
    (set) => ({
      customer: null,
      currentCustomer: null,
      isAuthenticated: false,
      setCustomer: (c) => set({ 
        customer: c, 
        currentCustomer: c, 
        isAuthenticated: !!c 
      }),
      logout: () => set({ 
        customer: null, 
        currentCustomer: null, 
        isAuthenticated: false 
      }),
    }),
    {
      name: 'amouris_customer_session',
    }
  )
)

export const useCustomerAuth = useCustomerAuthStore
