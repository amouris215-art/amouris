"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/i18n/i18n-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const { t, language } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock login for Phase 1
    setTimeout(() => {
      if (phone === '0550123456' && password === '123456') {
        toast.success(language === 'ar' ? 'تم تسجيل الدخول بنجاح' : 'Connexion réussie !');
        router.push('/account');
      } else {
        toast.error(language === 'ar' ? 'بيانات غير صحيحة' : 'Identifiants incorrects');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center min-h-[80vh] items-center">
      <div className="w-full max-w-md bg-white border border-emerald-100 p-10 shadow-xl">
        <h1 className="text-3xl font-serif text-emerald-950 mb-4 text-center">
          {language === 'ar' ? 'تسجيل الدخول' : 'Connexion'}
        </h1>
        <p className="text-center text-gray-500 mb-8 font-light">
          {language === 'ar' 
            ? 'مرحباً بك مجدداً في متجر Amouris Parfums.' 
            : 'Bon retour sur Amouris Parfums.'}
        </p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2 text-start">
            <Label htmlFor="phone">{language === 'ar' ? 'رقم الهاتف' : 'Numéro de téléphone'}</Label>
            <Input 
              id="phone" 
              type="tel" 
              required 
              placeholder="05xxxxxx" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-neutral-50"
            />
          </div>

          <div className="space-y-2 text-start">
            <Label htmlFor="password">{language === 'ar' ? 'كلمة المرور' : 'Mot de passe'}</Label>
            <Input 
              id="password" 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-neutral-50"
            />
          </div>

          <Button type="submit" className="w-full h-12 bg-emerald-900 hover:bg-emerald-950 text-white" disabled={isLoading}>
             {isLoading ? t('common.loading') : (language === 'ar' ? 'دخول' : 'Se connecter')}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500 border-t pt-6">
          {language === 'ar' ? 'ليس لديك حساب؟' : 'Pas encore de compte ?'}
          <Link href="/register" className="text-emerald-800 font-medium hover:underline mx-2">
            {language === 'ar' ? 'إنشاء حساب جديد' : 'Créer un compte'}
          </Link>
        </div>
      </div>
    </div>
  );
}
