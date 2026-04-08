'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentStatus = 'unpaid' | 'partial' | 'paid'

export interface OrderItem {
  product_id: string
  flacon_variant_id: string | null
  product_name_fr: string
  product_name_ar: string
  quantity_grams: number | null
  quantity_units: number | null
  unit_price: number
  total_price: number
}

export interface Order {
  id: string
  order_number: string
  customer_id: string | null
  guest_first_name?: string
  guest_last_name?: string
  guest_phone?: string
  guest_wilaya?: string
  items: OrderItem[]
  total_amount: number
  amount_paid: number
  payment_status: PaymentStatus
  order_status: OrderStatus
  admin_notes: string
  invoice_url: string | null
  created_at: string
  updated_at: string
}

let orderCounter = 1

interface OrdersStore {
  orders: Order[]
  _seeded: boolean
  seed: (data: Order[]) => void
  createOrder: (data: Omit<Order, 'id' | 'order_number' | 'payment_status' | 'amount_paid' | 'admin_notes' | 'invoice_url' | 'created_at' | 'updated_at'>) => Order
  updateStatus: (id: string, status: OrderStatus) => void
  updatePayment: (id: string, amountPaid: number) => void
  updateNotes: (id: string, notes: string) => void
  setInvoiceUrl: (id: string, url: string) => void
  getByCustomer: (customerId: string) => Order[]
  getAll: () => Order[]
}

export const useOrdersStore = create<OrdersStore>()(
  persist(
    (set, get) => ({
      orders: [],
      _seeded: false,

      seed: (data) => {
        if (!get()._seeded) {
          orderCounter = data.length + 1
          set({ orders: data, _seeded: true })
        }
      },

      createOrder: (data) => {
        const num = String(orderCounter++).padStart(6, '0')
        const order: Order = {
          ...data,
          id: `ord_${Date.now()}`,
          order_number: `AM-${num}`,
          amount_paid: 0,
          payment_status: 'unpaid',
          admin_notes: '',
          invoice_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        set(s => ({ orders: [order, ...s.orders] }))
        return order
      },

      updateStatus: (id, status) =>
        set(s => ({
          orders: s.orders.map(o =>
            o.id === id ? { ...o, order_status: status, updated_at: new Date().toISOString() } : o
          ),
        })),

      updatePayment: (id, amountPaid) =>
        set(s => ({
          orders: s.orders.map(o => {
            if (o.id !== id) return o
            const ps: PaymentStatus =
              amountPaid <= 0 ? 'unpaid'
              : amountPaid >= o.total_amount ? 'paid'
              : 'partial'
            return { ...o, amount_paid: amountPaid, payment_status: ps, updated_at: new Date().toISOString() }
          }),
        })),

      updateNotes: (id, notes) =>
        set(s => ({
          orders: s.orders.map(o => o.id === id ? { ...o, admin_notes: notes } : o),
        })),

      setInvoiceUrl: (id, url) =>
        set(s => ({
          orders: s.orders.map(o => o.id === id ? { ...o, invoice_url: url } : o),
        })),

      getByCustomer: (customerId) =>
        get().orders.filter(o => o.customer_id === customerId),

      getAll: () => get().orders,
    }),
    { name: 'amouris_orders' }
  )
)
