'use client'

import { useState, useMemo } from 'react'
import { wilayas } from '@/lib/wilayas'
import { useI18n } from '@/i18n/i18n-context'
import { Search, MapPin, Check } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"

interface WilayaSelectorProps {
  value: string
  onValueChange: (value: string) => void
}

export function WilayaSelector({ value, onValueChange }: WilayaSelectorProps) {
  const { language } = useI18n()
  const [isMobile, setIsMobile] = useState(false)
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  useMemo(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < 768)
    }
  }, [])

  const filteredWilayas = useMemo(() => {
    if (!search) return wilayas
    const s = search.toLowerCase()
    return wilayas.filter(w => 
      w.name.toLowerCase().includes(s) || 
      w.nameAR.includes(s) || 
      w.id.toString().includes(s)
    )
  }, [search])

  const selectedWilaya = wilayas.find(w => w.name === value)

  if (isMobile) {
    return (
      <select
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className="w-full h-14 px-4 bg-neutral-50 border border-emerald-950/5 rounded-2xl outline-none focus:border-[#C9A84C] text-emerald-950 appearance-none font-medium"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23C9A84C'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: language === 'ar' ? 'left 1rem center' : 'right 1rem center', backgroundSize: '1.5rem' }}
      >
        <option value="">{language === 'ar' ? 'اختر الولاية' : 'Choisir la wilaya'}</option>
        {wilayas.map((w) => (
          <option key={w.id} value={w.name}>
            {w.id}. {language === 'ar' ? w.nameAR : w.name}
          </option>
        ))}
      </select>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-between h-14 px-6 font-normal rounded-2xl border-emerald-950/5 bg-neutral-50 hover:bg-emerald-50 hover:border-[#C9A84C] transition-all text-sm outline-none"
        >
          {selectedWilaya ? (
            <span className="flex items-center gap-2">
              <MapPin size={16} className="text-amber-500" />
              <span className="font-medium text-emerald-950">
                {selectedWilaya.id} - {language === 'ar' ? selectedWilaya.nameAR : selectedWilaya.name}
              </span>
            </span>
          ) : (
             <span className="text-gray-400">
               {language === 'ar' ? 'اخrer الولاية' : 'Choisir la wilaya'}
             </span>
          )}
          <Search size={16} className="text-gray-300" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md w-[95vw] rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-6 border-b border-emerald-950/5">
          <DialogTitle className="font-serif text-2xl text-emerald-950">
            {language === 'ar' ? 'اختر ولاية التوصيل' : 'Wilaya de livraison'}
          </DialogTitle>
          <div className="relative mt-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              placeholder={language === 'ar' ? 'ابحث عن الولاية...' : 'Rechercher une wilaya...'}
              className="pl-12 h-14 rounded-2xl border-emerald-950/5 bg-neutral-50 focus-visible:ring-emerald-800"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
        </DialogHeader>
        <ScrollArea className="h-[60vh]">
          <div className="p-3">
            {filteredWilayas.length > 0 ? (
              filteredWilayas.map((w) => (
                <button
                  key={w.id}
                  onClick={() => {
                    onValueChange(w.name)
                    setOpen(false)
                    setSearch('')
                  }}
                  className={`w-full flex items-center justify-between p-5 text-sm transition-all rounded-2xl mb-1 ${value === w.name ? 'bg-emerald-800 text-white shadow-lg shadow-emerald-900/20 font-bold' : 'hover:bg-emerald-50 text-emerald-950 font-medium'}`}
                >
                  <span>
                    {w.id}. {language === 'ar' ? w.nameAR : w.name}
                  </span>
                  {value === w.name && <Check size={16} />}
                </button>
              ))
            ) : (
              <div className="p-12 text-center text-gray-400 italic">
                {language === 'ar' ? 'لم يتم العثور على نتائج' : 'Aucun résultat trouvé'}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
