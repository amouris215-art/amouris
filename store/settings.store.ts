'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createClient } from '@/lib/supabase/client'

export interface StoreSettings {
  storeNameFR: string
  storeNameAR: string
  sloganFR: string
  sloganAR: string
  email: string
  phone: string
  address: string
  wilaya: string
  instagram: string
  facebook: string
  freeDeliveryThreshold: number
  alertStockPerfume: number
  alertStockFlacon: number
  minOrderAmount: number
}

interface SettingsStore extends StoreSettings {
  isLoading: boolean
  error: string | null
  fetchSettings: () => Promise<void>
  updateSettings: (updates: Partial<StoreSettings>) => Promise<void>
}

// Map database column names to store field names
const mapToStore = (db: any): StoreSettings => ({
  storeNameFR: db.store_name_fr,
  storeNameAR: db.store_name_ar,
  sloganFR: db.slogan_fr,
  sloganAR: db.slogan_ar,
  email: db.email,
  phone: db.phone,
  address: db.address,
  wilaya: db.wilaya,
  instagram: db.instagram,
  facebook: db.facebook,
  freeDeliveryThreshold: Number(db.free_delivery_threshold),
  alertStockPerfume: Number(db.alert_stock_perfume),
  alertStockFlacon: Number(db.alert_stock_flacon),
  minOrderAmount: Number(db.min_order_amount),
})

const mapToDb = (store: Partial<StoreSettings>) => {
  const mapping: any = {}
  if (store.storeNameFR !== undefined) mapping.store_name_fr = store.storeNameFR
  if (store.storeNameAR !== undefined) mapping.store_name_ar = store.storeNameAR
  if (store.sloganFR !== undefined) mapping.slogan_fr = store.sloganFR
  if (store.sloganAR !== undefined) mapping.slogan_ar = store.sloganAR
  if (store.email !== undefined) mapping.email = store.email
  if (store.phone !== undefined) mapping.phone = store.phone
  if (store.address !== undefined) mapping.address = store.address
  if (store.wilaya !== undefined) mapping.wilaya = store.wilaya
  if (store.instagram !== undefined) mapping.instagram = store.instagram
  if (store.facebook !== undefined) mapping.facebook = store.facebook
  if (store.freeDeliveryThreshold !== undefined) mapping.free_delivery_threshold = store.freeDeliveryThreshold
  if (store.alertStockPerfume !== undefined) mapping.alert_stock_perfume = store.alertStockPerfume
  if (store.alertStockFlacon !== undefined) mapping.alert_stock_flacon = store.alertStockFlacon
  if (store.minOrderAmount !== undefined) mapping.min_order_amount = store.minOrderAmount
  return mapping
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      storeNameFR: "Amouris Parfums",
      storeNameAR: "أموريس للعطور",
      sloganFR: "L'essence du luxe — Huiles et flacons d'exception",
      sloganAR: "جوهر الفخامة — زيوت وقوارير استثنائية",
      email: "contact@amouris-parfums.com",
      phone: "+213 550 00 00 00",
      address: "Quartier El Yasmine, Alger",
      wilaya: "Alger",
      instagram: "",
      facebook: "",
      freeDeliveryThreshold: 50000,
      alertStockPerfume: 500,
      alertStockFlacon: 10,
      minOrderAmount: 0,
      
      isLoading: false,
      error: null,

      fetchSettings: async () => {
        set({ isLoading: true, error: null })
        try {
          const supabase = createClient()
          const { data, error } = await supabase
            .from('settings')
            .select('value')
            .eq('key', 'shop')
            .single()

          if (error) throw error
          if (data && data.value) {
            const val = data.value
            set({
              storeNameFR: val.name_fr || val.store_name_fr,
              storeNameAR: val.name_ar || val.store_name_ar,
              sloganFR: val.slogan_fr,
              sloganAR: val.slogan_ar,
              email: val.email,
              phone: val.phone,
              address: val.address,
              wilaya: val.wilaya,
              instagram: val.instagram,
              facebook: val.facebook,
              freeDeliveryThreshold: val.free_shipping_threshold || val.free_delivery_threshold,
              alertStockPerfume: val.stock_alert_grams || val.alert_stock_perfume,
              alertStockFlacon: val.stock_alert_units || val.alert_stock_flacon,
              minOrderAmount: val.min_order_amount || 0,
              isLoading: false
            })
          }
        } catch (err: any) {
          console.error('Error fetching settings:', err)
          set({ error: err.message, isLoading: false })
        }
      },
      
      updateSettings: async (updates) => {
        // Optimistic update
        set((state) => ({ ...state, ...updates }))
        
        try {
          const supabase = createClient()
          
          // Fetch current full value first to preserve other fields
          const { data } = await supabase.from('settings').select('value').eq('key', 'shop').single()
          const currentValue = data?.value || {}
          
          const newValue = {
            ...currentValue,
            name_fr: updates.storeNameFR ?? currentValue.name_fr,
            name_ar: updates.storeNameAR ?? currentValue.name_ar,
            slogan_fr: updates.sloganFR ?? currentValue.slogan_fr,
            slogan_ar: updates.sloganAR ?? currentValue.slogan_ar,
            email: updates.email ?? currentValue.email,
            phone: updates.phone ?? currentValue.phone,
            address: updates.address ?? currentValue.address,
            wilaya: updates.wilaya ?? currentValue.wilaya,
            instagram: updates.instagram ?? currentValue.instagram,
            facebook: updates.facebook ?? currentValue.facebook,
            free_shipping_threshold: updates.freeDeliveryThreshold ?? currentValue.free_shipping_threshold,
            stock_alert_grams: updates.alertStockPerfume ?? currentValue.stock_alert_grams,
            stock_alert_units: updates.alertStockFlacon ?? currentValue.stock_alert_units,
            min_order_amount: updates.minOrderAmount ?? currentValue.min_order_amount,
          }

          const { error } = await supabase
            .from('settings')
            .update({ value: newValue })
            .eq('key', 'shop')

          if (error) throw error
        } catch (err: any) {
          console.error('Error updating settings:', err)
        }
      },
    }),
    {
      name: 'amouris_settings_cache',
    }
  )
)
