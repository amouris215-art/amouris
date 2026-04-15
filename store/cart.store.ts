'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string;
  product_id: string;
  product_type: 'perfume' | 'flacon' | 'accessory';
  name_fr: string;
  name_ar: string;
  slug: string;
  image_url?: string;
  flacon_variant_id: string | null; // null for perfumes
  variant_label?: string;
  unit_price: number;
  quantity_grams?: number; // for perfumes
  quantity_units?: number; // for flacons
  total_price: number;
  is_carton?: boolean;
  carton_quantity?: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id' | 'total_price'> & { stock?: number }) => void;
  removeItem: (id: string) => void;
  updateGrams: (id: string, grams: number, stock?: number) => void;
  updateUnits: (id: string, units: number, stock?: number) => void;
  clear: () => void;
  getCount: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => set((state) => {
        const existingIndex = state.items.findIndex(
          (i) => 
            i.product_id === item.product_id && 
            (item.product_type === 'perfume' ? true : i.flacon_variant_id === item.flacon_variant_id) &&
            i.is_carton === item.is_carton
        );

        if (existingIndex > -1) {
          const newItems = [...state.items];
          const existing = newItems[existingIndex];

          if (item.product_type === 'perfume') {
            const addedGrams = item.quantity_grams || 0;
            const newGrams = (existing.quantity_grams || 0) + addedGrams;
            // Respect stock limit if provided
            if (item.stock !== undefined && newGrams > item.stock) {
              existing.quantity_grams = item.stock;
            } else {
              existing.quantity_grams = newGrams;
            }
            existing.total_price = existing.quantity_grams === 50 
              ? (existing.unit_price / 2) + 100 
              : existing.unit_price * (existing.quantity_grams / 100); 
          } else {
            const addedUnits = item.quantity_units || 0;
            const newUnits = (existing.quantity_units || 0) + addedUnits;
            // Respect stock limit if provided (convert carton to units if needed for stock check)
            const unitsInCarton = item.is_carton ? (item.carton_quantity || 1) : 1;
            const totalRequestedUnits = newUnits * unitsInCarton;

            if (item.stock !== undefined && totalRequestedUnits > item.stock) {
              existing.quantity_units = Math.floor(item.stock / unitsInCarton);
            } else {
              existing.quantity_units = newUnits;
            }
            existing.total_price = existing.unit_price * (existing.quantity_units || 0);
          }

          return { items: newItems };
        }

        // Calculate initial total price for new item
        let initialTotal = 0;
        if (item.product_type === 'perfume') {
          initialTotal = item.quantity_grams === 50 
            ? (item.unit_price / 2) + 100 
            : item.unit_price * ((item.quantity_grams || 0) / 100);
        } else {
          initialTotal = item.unit_price * (item.quantity_units || 0);
        }

        const newItem: CartItem = {
          ...item,
          id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          total_price: initialTotal,
        };

        return { items: [...state.items, newItem] };
      }),

      removeItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id),
      })),

      updateGrams: (id, grams, stock) => set((state) => ({
        items: state.items.map((i) => {
          if (i.id !== id) return i;
          let newGrams = Math.max(50, grams); // Minimum 50g
          if (stock !== undefined) {
            newGrams = Math.min(newGrams, stock); // Respect stock
          }
          return { 
            ...i, 
            quantity_grams: newGrams, 
            total_price: newGrams === 50 
              ? (i.unit_price / 2) + 100 
              : i.unit_price * (newGrams / 100) 
          };
        }),
      })),

      updateUnits: (id, units, stock) => set((state) => ({
        items: state.items.map((i) => {
          if (i.id !== id) return i;
          let newUnits = Math.max(1, units); // Minimum 1 unit
          if (stock !== undefined) {
            newUnits = Math.min(newUnits, stock); // Respect stock
          }
          return { 
            ...i, 
            quantity_units: newUnits, 
            total_price: i.unit_price * newUnits 
          };
        }),
      })),

      clear: () => set({ items: [] }),

      getCount: () => get().items.length, // Number of lines in cart

      getTotal: () => get().items.reduce((sum, item) => sum + item.total_price, 0),
    }),
    {
      name: 'amouris_cart',
    }
  )
);

