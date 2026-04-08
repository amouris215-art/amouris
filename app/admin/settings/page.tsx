'use client'

import { useState } from 'react'
import { Settings, Save, Bell, Shield, Globe, Mail, Landmark } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false)

  const handleSave = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.success('Paramètres enregistrés avec succès')
    }, 1000)
  }

  return (
    <div className="space-y-10 p-4 md:p-0">
      <div>
        <h1 className="text-3xl font-bold font-serif text-emerald-950 flex items-center gap-3">
          <Settings size={32} />
          Paramètres Généraux
        </h1>
        <p className="text-emerald-950/40 text-sm mt-1">Configurez les options de votre plateforme Amouris</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Sidebar - Tabs Style */}
        <div className="space-y-2">
            {[
              { label: 'Boutique', icon: Globe, active: true },
              { label: 'Notifications', icon: Bell, active: false },
              { label: 'Sécurité', icon: Shield, active: false },
              { label: 'Paiements', icon: Landmark, active: false },
              { label: 'Emails', icon: Mail, active: false },
            ].map((tab, i) => (
              <button 
                key={i}
                className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all text-sm font-bold ${tab.active ? 'bg-emerald-900 text-white shadow-xl shadow-emerald-900/10' : 'text-emerald-900/60 hover:bg-emerald-50'}`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
        </div>

        {/* Content */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white p-8 rounded-[2.5rem] border border-emerald-50 shadow-sm space-y-8">
              <div>
                 <h3 className="text-lg font-bold text-emerald-950 mb-4">Informations de la boutique</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-xs font-black uppercase tracking-widest text-emerald-900/40">Nom de la plateforme</label>
                       <input type="text" defaultValue="Amouris Parfums" className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-emerald-900/5" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black uppercase tracking-widest text-emerald-900/40">E-mail de contact</label>
                       <input type="email" defaultValue="contact@amouris.dz" className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-emerald-900/5" />
                    </div>
                 </div>
              </div>

              <div className="pt-8 border-t border-emerald-50">
                 <h3 className="text-lg font-bold text-emerald-950 mb-4">Préférences et Localisation</h3>
                 <div className="space-y-6">
                    <div className="flex items-center justify-between">
                       <div>
                          <p className="font-bold text-emerald-900">Activer le Mode Maintenance</p>
                          <p className="text-xs text-emerald-950/40">Désactive l'accès au store frontal pour les clients</p>
                       </div>
                       <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                       <div>
                          <p className="font-bold text-emerald-900">Bilingue (FR/AR)</p>
                          <p className="text-xs text-emerald-950/40">Permet le basculement entre le Français et l'Arabe</p>
                       </div>
                       <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                       <div>
                          <p className="font-bold text-emerald-900">Afficher les Stocks</p>
                          <p className="text-xs text-emerald-950/40">Montrer la disponibilité restante sur les fiches produits</p>
                       </div>
                       <Switch defaultChecked />
                    </div>
                 </div>
              </div>

              <div className="pt-8 border-t border-emerald-50">
                 <Button 
                   onClick={handleSave}
                   disabled={loading}
                   className="bg-emerald-900 text-white px-8 py-6 rounded-2xl hover:bg-emerald-800 shadow-xl shadow-emerald-900/10 transition-all font-bold flex items-center gap-3 w-full justify-center"
                 >
                   {loading ? 'Enregistrement...' : <><Save size={20} /> Enregistrer les modifications</>}
                 </Button>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
