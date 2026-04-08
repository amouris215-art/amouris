'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  productId: string
  type: 'perfume' | 'flacon'
  nameFR: string
  nameAR: string
  slug: string
  variantId?: string
  variantLabel?: string
  unitPrice: number
  quantity: number // grams for perfume, units for flacon
  total: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, delta: number) => void
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
          i => i.productId === item.productId && i.variantId === item.variantId
        )

        if (existingIndex > -1) {
          const newItems = [...s.items]
          const existing = newItems[existingIndex]
          existing.quantity += item.quantity
          existing.total = existing.unitPrice * existing.quantity
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
          const min = i.type === 'perfume' ? 100 : 1
          i.quantity = Math.max(min, i.quantity + delta)
          i.total = i.unitPrice * i.quantity
          return i
        })
      })),
      clear: () => set({ items: [] }),
      getTotal: () => get().items.reduce((sum, i) => sum + i.total, 0),
      getCount: () => get().items.length,
    }),
    { name: 'amouris_cart' }
  )
)
