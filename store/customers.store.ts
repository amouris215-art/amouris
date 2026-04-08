'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Customer {
  id: string
  first_name: string
  last_name: string
  phone: string
  shop_name?: string
  wilaya: string
  commune?: string
  password_hash: string
  is_frozen: boolean
  created_at: string
}

interface CustomersStore {
  customers: Customer[]
  _seeded: boolean
  seed: (data: Customer[]) => void
  register: (data: {
    first_name: string
    last_name: string
    phone: string
    password: string
    shop_name?: string
    wilaya: string
    commune?: string
  }) => { ok: boolean; customer?: Customer; error?: string }
  login: (phone: string, password: string) => { ok: boolean; customer?: Customer; error?: string }
  freeze: (id: string) => void
  unfreeze: (id: string) => void
  remove: (id: string) => void
  resetPassword: (id: string, newPassword: string) => void
  getById: (id: string) => Customer | undefined
}

function normalizePhone(p: string) {
  return p.replace(/[\s\-\.]/g, '').trim()
}

export const useCustomersStore = create<CustomersStore>()(
  persist(
    (set, get) => ({
      customers: [],
      _seeded: false,

      seed: (data) => { if (!get()._seeded) set({ customers: data, _seeded: true }) },

      register: (data) => {
        const phone = normalizePhone(data.phone)
        if (get().customers.find(c => c.phone === phone)) {
          return { ok: false, error: 'Un compte avec ce numéro existe déjà' }
        }
        if (data.password.length < 6) {
          return { ok: false, error: 'Mot de passe trop court (min. 6 caractères)' }
        }
        const customer: Customer = {
          id: `cust_${Date.now()}`,
          first_name: data.first_name,
          last_name: data.last_name,
          phone,
          shop_name: data.shop_name,
          wilaya: data.wilaya,
          commune: data.commune,
          password_hash: data.password,
          is_frozen: false,
          created_at: new Date().toISOString(),
        }
        set(s => ({ customers: [...s.customers, customer] }))
        return { ok: true, customer }
      },

      login: (phone, password) => {
        const p = normalizePhone(phone)
        const found = get().customers.find(c => c.phone === p && c.password_hash === password)
        if (!found) return { ok: false, error: 'Numéro ou mot de passe incorrect' }
        if (found.is_frozen) return { ok: false, error: 'Ce compte est suspendu' }
        return { ok: true, customer: found }
      },

      freeze: (id) => set(s => ({
        customers: s.customers.map(c => c.id === id ? { ...c, is_frozen: true } : c)
      })),
      unfreeze: (id) => set(s => ({
        customers: s.customers.map(c => c.id === id ? { ...c, is_frozen: false } : c)
      })),
      remove: (id) => set(s => ({ customers: s.customers.filter(c => c.id !== id) })),
      resetPassword: (id, pwd) => set(s => ({
        customers: s.customers.map(c => c.id === id ? { ...c, password_hash: pwd } : c)
      })),
      getById: (id) => get().customers.find(c => c.id === id),
    }),
    { name: 'amouris_customers' }
  )
)
