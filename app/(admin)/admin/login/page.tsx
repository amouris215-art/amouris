"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ShieldAlert } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Mock admin credentials as per request
    const ADMIN_EMAIL = 'admin@gmail.com';
    const ADMIN_PASSWORD = '123456';

    setTimeout(() => {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        localStorage.setItem('amouris_admin_token', 'mock_admin_token_2024');
        localStorage.setItem('amouris_admin_role', 'admin');
        toast.success('Accès administrateur autorisé');
        router.push('/admin');
      } else {
        setError('Identifiants administrateur incorrects');
        toast.error('Échec de la connexion');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-black border border-emerald-900/50 p-8 shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="bg-emerald-900/20 p-4 rounded-full border border-emerald-500/20">
            <ShieldAlert className="h-8 w-8 text-emerald-500" />
          </div>
        </div>
        
        <h1 className="text-2xl font-serif text-white mb-2 text-center">
          Administration
        </h1>
        <p className="text-center text-emerald-500/60 text-sm mb-8 font-light uppercase tracking-widest">
          Portail Sécurisé
        </p>
        
        <form onSubmit={handleAdminLogin} className="space-y-6">
          {error && (
            <div className="bg-red-900/20 border border-red-500/50 p-3 text-red-500 text-xs text-center">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-emerald-100/70 text-xs uppercase tracking-widest">Email Admin</Label>
            <Input 
              id="email" 
              type="email" 
              required 
              placeholder="admin@gmail.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-neutral-800 border-emerald-900/30 text-white focus:border-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" title="Mot de passe" className="text-emerald-100/70 text-xs uppercase tracking-widest">Mot de passe</Label>
            <Input 
              id="password" 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-neutral-800 border-emerald-900/30 text-white focus:border-emerald-500"
            />
          </div>

          <Button type="submit" className="w-full h-12 bg-emerald-700 hover:bg-emerald-600 text-white uppercase tracking-widest text-xs font-bold" disabled={isLoading}>
             {isLoading ? 'Chargement...' : 'Déverrouiller'}
          </Button>
        </form>
        
        <p className="mt-8 text-center text-[10px] text-gray-600 font-mono">
          SYSTEM_ACCESS_REV_1.0
        </p>
      </div>
    </div>
  );
}
