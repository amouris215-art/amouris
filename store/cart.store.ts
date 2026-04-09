'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  product_id: string
  product_type: 'perfume' | 'flacon'
  name_fr: string
  name_ar: string
  slug: string
  flacon_variant_id?: string
  variant_label?: string
  unit_price: number
  quantity_grams?: number
  quantity_units?: number
  total_price: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateGrams: (id: string, grams: number) => void
  updateUnits: (id: string, units: number) => void
  clear: () => void
  getTotal: () => number
  getCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => set(s => {
        const existingIndex = s.items.findIndex(
          i => i.product_id === item.product_id && i.flacon_variant_id === item.flacon_variant_id
        )

        if (existingIndex > -1) {
          const newItems = [...s.items]
          const existing = newItems[existingIndex]
          
          if (item.product_type === 'perfume') {
            existing.quantity_grams = (existing.quantity_grams || 0) + (item.quantity_grams || 0)
          } else {
            existing.quantity_units = (existing.quantity_units || 0) + (item.quantity_units || 0)
          }
          
          existing.total_price = existing.unit_price * (existing.quantity_grams || existing.quantity_units || 0)
          return { items: newItems }
        }

        return { 
          items: [...s.items, { ...item, id: `cart_${Date.now()}` }] 
        }
      }),

      removeItem: (id) => set(s => ({
        items: s.items.filter(i => i.id !== id)
      })),

      updateGrams: (id, grams) => set(s => ({
        items: s.items.map(i => {
          if (i.id !== id) return i
          const newGrams = Math.max(100, grams)
          return { ...i, quantity_grams: newGrams, total_price: i.unit_price * newGrams }
        })
      })),

      updateUnits: (id, units) => set(s => ({
        items: s.items.map(i => {
          if (i.id !== id) return i
          const newUnits = Math.max(1, units)
          return { ...i, quantity_units: newUnits, total_price: i.unit_price * newUnits }
        })
      })),

      clear: () => set({ items: [] }),
      
      getTotal: () => get().items.reduce((sum, i) => sum + i.total_price, 0),
      
      getCount: () => get().items.reduce((sum, i) => sum + (i.quantity_grams ? 1 : (i.quantity_units || 0)), 0),
    }),
    { name: 'amouris_cart' }
  )
)
