'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCustomerAuthStore } from '@/store/customer-auth.store'
import { useCustomersStore } from '@/store/customers.store'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const setCustomer = useCustomerAuthStore(s => s.setCustomer)
  const loginCustomer = useCustomersStore(s => s.login)
  
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!phone.trim() || !password.trim()) {
      setError('Veuillez remplir tous les champs')
      return
    }

    setLoading(true)
    // Simulate slight delay for luxury feel
    await new Promise(r => setTimeout(r, 400))
    
    const result = loginCustomer(phone, password)
    
    if (result.ok && result.customer) {
      setCustomer(result.customer)
      router.replace('/account')
    } else {
      setError(result.error || 'Identifiants incorrects')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm p-8 rounded-2xl border border-gray-100 shadow-sm">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl text-emerald-950 uppercase tracking-[0.2em]">Connexion</h1>
          <p className="text-gray-400 text-xs mt-3 uppercase tracking-widest font-bold">Espace Client B2B</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-emerald-900/50 mb-2 ml-1">Téléphone</label>
            <input
              type="tel" value={phone} onChange={e => { setPhone(e.target.value); setError('') }}
              placeholder="0550 00 00 00"
              autoComplete="tel"
              className="w-full border border-gray-200 px-5 py-4 rounded-xl text-sm focus:outline-none focus:border-emerald-400 transition-all font-medium"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-emerald-900/50 mb-2 ml-1">Mot de passe</label>
            <input
              type="password" value={password} onChange={e => { setPassword(e.target.value); setError('') }}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full border border-gray-200 px-5 py-4 rounded-xl text-sm focus:outline-none focus:border-emerald-400 transition-all"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-xs px-4 py-3 rounded-xl font-medium">
              {error}
            </div>
          )}

          <button
            type="submit" disabled={loading}
            className="w-full bg-emerald-900 text-white py-4 rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-emerald-800 disabled:opacity-50 transition-all shadow-lg shadow-emerald-900/10 active:scale-[0.98]"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-10 font-medium">
          Pas encore de compte ?{' '}
          <Link href="/register" className="text-emerald-700 font-bold hover:underline">
            S'inscrire
          </Link>
        </p>

        <div className="mt-8 pt-8 border-t border-gray-100 text-center">
          <Link href="/admin/login" className="text-[10px] uppercase font-black tracking-widest text-emerald-900/10 hover:text-emerald-900/40 transition-colors">
            Accès administrateur Amouris →
          </Link>
        </div>
      </div>
    </div>
  )
}
