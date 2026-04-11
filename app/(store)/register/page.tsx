'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCustomerAuthStore } from '@/store/customer-auth.store'
import { useCustomersStore } from '@/store/customers.store'
import Link from 'next/link'

const WILAYAS = [
  'Adrar','Chlef','Laghouat','Oum El Bouaghi','Batna','Béjaïa','Biskra',
  'Béchar','Blida','Bouira','Tamanrasset','Tébessa','Tlemcen','Tiaret',
  'Tizi Ouzou','Alger','Djelfa','Jijel','Sétif','Saïda','Skikda',
  'Sidi Bel Abbès','Annaba','Guelma','Constantine','Médéa','Mostaganem',
  "M'Sila",'Mascara','Ouargla','Oran','El Bayadh','Illizi','Bordj Bou Arréridj',
  'Boumerdès','El Tarf','Tindouf','Tissemsilt','El Oued','Khenchela',
  'Souk Ahras','Tipaza','Mila','Aïn Defla','Naâma','Aïn Témouchent',
  'Ghardaïa','Relizane','Timimoun','Bordj Badji Mokhtar','Ouled Djellal',
  'Béni Abbès','In Salah','In Guezzam','Touggourt','Djanet','El MGhair','El Meniaa'
]

import { createBrowserClient } from '@supabase/ssr'
import { normalizePhone, phoneToEmail } from '@/lib/utils/phone'

export default function RegisterPage() {
  const router = useRouter()
  const registerUser = useCustomerAuthStore(s => s.register)
  
  const [form, setForm] = useState({
    firstName: '', 
    lastName: '', 
    phone: '', 
    shopName: '',
    wilaya: '', 
    commune: '', 
    password: '', 
    confirmPassword: '',
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [globalError, setGlobalError] = useState('')
  const [loading, setLoading] = useState(false)

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => {
      const next = { ...prev }
      delete next[field]
      return next
    })
    setGlobalError('')
  }

  function validate() {
    const newErrors: Record<string, string> = {}
    if (!form.firstName.trim()) newErrors.firstName = 'Le prénom est requis'
    if (!form.lastName.trim()) newErrors.lastName = 'Le nom est requis'
    if (!form.phone.trim()) newErrors.phone = 'Le numéro de téléphone est requis'
    if (!form.wilaya) newErrors.wilaya = 'Veuillez sélectionner votre wilaya'
    if (form.password.length < 6) newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères'
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Les mots de passe ne correspondent pas'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setGlobalError('')
    
    if (!validate()) return

    setLoading(true)

    try {
      await registerUser(form)
      router.replace('/account')
    } catch (err: any) {
      console.error('Registration error:', err)
      setGlobalError(err.message || 'Échec de la création du compte')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-12">
      <div className="bg-white w-full max-w-lg p-8 rounded-2xl border border-gray-100 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="font-serif text-2xl text-gray-900 uppercase tracking-widest">
            Créer un compte
          </h1>
          <p className="text-gray-500 text-sm mt-2">Rejoignez Amouris Parfums — B2B Marketplace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest font-bold text-emerald-900/50 mb-1.5 ml-1">Prénom *</label>
              <input
                type="text" value={form.firstName} onChange={e => update('firstName', e.target.value)}
                placeholder="Ex: Mohammed"
                className={`w-full border ${errors.firstName ? 'border-red-300' : 'border-gray-200'} px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-emerald-400 transition-all`}
              />
              {errors.firstName && <p className="text-[10px] text-red-500 mt-1 ml-1 font-medium">{errors.firstName}</p>}
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest font-bold text-emerald-900/50 mb-1.5 ml-1">Nom *</label>
              <input
                type="text" value={form.lastName} onChange={e => update('lastName', e.target.value)}
                placeholder="Ex: Benali"
                className={`w-full border ${errors.lastName ? 'border-red-300' : 'border-gray-200'} px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-emerald-400 transition-all`}
              />
              {errors.lastName && <p className="text-[10px] text-red-500 mt-1 ml-1 font-medium">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-emerald-900/50 mb-1.5 ml-1">Téléphone *</label>
            <input
              type="tel" value={form.phone} onChange={e => update('phone', e.target.value)}
              placeholder="0550 00 00 00"
              autoComplete="tel"
              className={`w-full border ${errors.phone ? 'border-red-300' : 'border-gray-200'} px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-emerald-400 transition-all`}
            />
            {errors.phone && <p className="text-[10px] text-red-500 mt-1 ml-1 font-medium">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-gray-600 mb-1.5 ml-1">
              Nom du magasin <span className="opacity-50">(optionnel)</span>
            </label>
            <input
              type="text" value={form.shopName} onChange={e => update('shopName', e.target.value)}
              placeholder="Ex: Parfumerie El Nour"
              className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest font-bold text-emerald-900/50 mb-1.5 ml-1">Wilaya *</label>
              <select
                value={form.wilaya} onChange={e => update('wilaya', e.target.value)}
                className={`w-full border ${errors.wilaya ? 'border-red-300' : 'border-gray-200'} px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-emerald-400 bg-white transition-all`}
              >
                <option value="">Sélectionner...</option>
                {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
              {errors.wilaya && <p className="text-[10px] text-red-500 mt-1 ml-1 font-medium">{errors.wilaya}</p>}
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest font-bold text-gray-600 mb-1.5 ml-1">
                Commune <span className="opacity-50">(optionnel)</span>
              </label>
              <input
                type="text" value={form.commune} onChange={e => update('commune', e.target.value)}
                placeholder="Votre commune"
                className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-emerald-900/50 mb-1.5 ml-1">Mot de passe *</label>
            <input
              type="password" value={form.password} onChange={e => update('password', e.target.value)}
              placeholder="Min. 6 caractères"
              autoComplete="new-password"
              className={`w-full border ${errors.password ? 'border-red-300' : 'border-gray-200'} px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-emerald-400 transition-all`}
            />
            {errors.password && <p className="text-[10px] text-red-500 mt-1 ml-1 font-medium">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-emerald-900/50 mb-1.5 ml-1">Confirmer *</label>
            <input
              type="password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)}
              placeholder="Répétez le mot de passe"
              autoComplete="new-password"
              className={`w-full border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-200'} px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-emerald-400 transition-all`}
            />
            {errors.confirmPassword && <p className="text-[10px] text-red-500 mt-1 ml-1 font-medium">{errors.confirmPassword}</p>}
          </div>

          {globalError && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-xs px-4 py-3 rounded-xl font-medium">
              {globalError}
            </div>
          )}

          <button
            type="submit" disabled={loading}
            className="w-full bg-emerald-900 text-white py-4 rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-emerald-800 disabled:opacity-50 transition-all mt-4 shadow-lg shadow-emerald-900/10"
          >
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-8 font-medium">
          Déjà un compte ?{' '}
          <Link href="/login" className="text-emerald-700 font-bold hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}
