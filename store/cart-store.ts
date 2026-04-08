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
  flacon_variant_id: string | null
  variant_label: string | null
  unit_price: number
  quantity_grams: number | null
  quantity_units: number | null
  total_price: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, delta: { grams?: number, units?: number }) => void
  clear: () => void
  getTotal: () => number
  getCount: () => number
  // compatibility
  cartTotal: () => number
  cartCount: () => number
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
          if (existing.product_type === 'perfume') {
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
      updateQuantity: (id, delta) => set(s => ({
        items: s.items.map(i => {
          if (i.id !== id) return i
          if (i.product_type === 'perfume' && delta.grams !== undefined) {
             i.quantity_grams = Math.max(100, (i.quantity_grams || 0) + delta.grams)
          } else if (i.product_type === 'flacon' && delta.units !== undefined) {
             i.quantity_units = Math.max(1, (i.quantity_units || 0) + delta.units)
          }
          i.total_price = i.unit_price * (i.quantity_grams || i.quantity_units || 0)
          return i
        })
      })),
      clear: () => set({ items: [] }),
      getTotal: () => get().items.reduce((sum, i) => sum + i.total_price, 0),
      getCount: () => get().items.length,
      cartTotal: () => get().getTotal(),
      cartCount: () => get().getCount(),
    }),
    { name: 'amouris_cart' }
  )
)
