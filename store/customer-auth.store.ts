'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CustomerUser {
  id: string
  firstName: string
  lastName: string
  phone: string
  shopName?: string
  wilaya: string
  commune?: string
}

interface CustomerAuthStore {
  customer: CustomerUser | null
  isAuthenticated: boolean
  login: (phone: string, password: string) => { ok: boolean; error?: string }
  register: (data: {
    firstName: string
    lastName: string
    phone: string
    password: string
    shopName?: string
    wilaya: string
    commune?: string
  }) => { ok: boolean; error?: string }
  logout: () => void
}

// Clé de stockage pour les comptes clients
const CUSTOMERS_DB_KEY = 'amouris_customers_db'

function getCustomersDB(): Array<CustomerUser & { password: string }> {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(CUSTOMERS_DB_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function saveCustomersDB(db: Array<CustomerUser & { password: string }>) {
  if (typeof window === 'undefined') return
  localStorage.setItem(CUSTOMERS_DB_KEY, JSON.stringify(db))
}

function normalizePhone(phone: string): string {
  return phone.replace(/[\s\-\.\+]/g, '').trim()
}

export const useCustomerAuth = create<CustomerAuthStore>()(
  persist(
    (set) => ({
      customer: null,
      isAuthenticated: false,

      register: (data) => {
        const db = getCustomersDB()
        const phone = normalizePhone(data.phone)

        if (db.find(u => u.phone === phone)) {
          return { ok: false, error: 'Un compte avec ce numéro existe déjà' }
        }
        if (data.password.length < 6) {
          return { ok: false, error: 'Le mot de passe doit contenir au moins 6 caractères' }
        }

        const newCustomer: CustomerUser & { password: string } = {
          id: `cust_${Date.now()}`,
          firstName: data.firstName,
          lastName: data.lastName,
          phone,
          shopName: data.shopName,
          wilaya: data.wilaya,
          commune: data.commune,
          password: data.password,
        }

        db.push(newCustomer)
        saveCustomersDB(db)

        const { password: _, ...customer } = newCustomer
        set({ customer, isAuthenticated: true })
        return { ok: true }
      },

      login: (phone, password) => {
        const db = getCustomersDB()
        const normalizedPhone = normalizePhone(phone)
        const found = db.find(
          u => u.phone === normalizedPhone && u.password === password
        )
        if (!found) {
          return { ok: false, error: 'Numéro ou mot de passe incorrect' }
        }
        const { password: _, ...customer } = found
        set({ customer, isAuthenticated: true })
        return { ok: true }
      },

      logout: () => set({ customer: null, isAuthenticated: false }),
    }),
    {
      name: 'amouris_customer_session',
      partialize: (s) => ({ customer: s.customer, isAuthenticated: s.isAuthenticated }),
    }
  )
)
