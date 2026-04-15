'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { fetchSettings, updateSettings } from '@/lib/api/settings'

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
  showAnnouncementBar: boolean
}

interface SettingsStore extends StoreSettings {
  isLoading: boolean
  error: string | null
  fetchSettings: () => Promise<void>
  updateSettings: (updates: Partial<StoreSettings>) => Promise<void>
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
      showAnnouncementBar: true,
      
      isLoading: false,
      error: null,

      fetchSettings: async () => {
        set({ isLoading: true, error: null })
        try {
          const val = await fetchSettings()
          if (val) {
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
              showAnnouncementBar: val.show_announcement_bar !== false,
              isLoading: false
            })
          } else {
            set({ isLoading: false })
          }
        } catch (err: any) {
          console.error('Error fetching settings:', err)
          set({ error: err.message, isLoading: false })
        }
      },
      
      updateSettings: async (updates) => {
        // Optimistic update
        const previousState = get()
        set((state) => ({ ...state, ...updates }))
        
        try {
          // Get current full value (via API or local state mapped back)
          // For simplicity, we map back the entire state to the DB format
          const currentState = get()
          const newValue = {
            name_fr: currentState.storeNameFR,
            name_ar: currentState.storeNameAR,
            slogan_fr: currentState.sloganFR,
            slogan_ar: currentState.sloganAR,
            email: currentState.email,
            phone: currentState.phone,
            address: currentState.address,
            wilaya: currentState.wilaya,
            instagram: currentState.instagram,
            facebook: currentState.facebook,
            free_shipping_threshold: currentState.freeDeliveryThreshold,
            stock_alert_grams: currentState.alertStockPerfume,
            stock_alert_units: currentState.alertStockFlacon,
            min_order_amount: currentState.minOrderAmount,
            show_announcement_bar: currentState.showAnnouncementBar,
          }

          await updateSettings(newValue)
        } catch (err: any) {
          console.error('Error updating settings:', err)
          // Rollback on error
          set(previousState)
        }
      },
    }),
    {
      name: 'amouris_settings_cache',
    }
  )
)
