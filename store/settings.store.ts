'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Settings {
  storeNameFr: string
  storeNameAr: string
  sloganFr: string
  sloganAr: string
  contactEmail: string
  contactPhone: string
  address: string
  wilaya: string
  instagramUrl: string
  facebookUrl: string
  freeShippingThreshold: number
  lowStockThresholdGrams: number
  lowStockThresholdUnits: number
  minOrderAmount: number
}

interface SettingsStore extends Settings {
  updateSettings: (partial: Partial<Settings>) => void
}

const DEFAULT_SETTINGS: Settings = {
  storeNameFr: "Amouris Parfums",
  storeNameAr: "أموريس للعطور",
  sloganFr: "L'essence du luxe — Huiles et flacons d'exception",
  sloganAr: "جوهر الفخامة — زيوت وقوارير استثنائية",
  contactEmail: "contact@amouris-parfums.com",
  contactPhone: "+213 550 00 00 00",
  address: "Quartier El Yasmine, Alger",
  wilaya: "Alger",
  instagramUrl: "",
  facebookUrl: "",
  freeShippingThreshold: 50000,
  lowStockThresholdGrams: 500,
  lowStockThresholdUnits: 10,
  minOrderAmount: 0 // Prompt didn't specify, but good to have
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      updateSettings: (partial) => set((state) => ({ ...state, ...partial })),
    }),
    {
      name: 'amouris_settings',
    }
  )
)
