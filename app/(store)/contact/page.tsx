"use client";

import { useI18n } from '@/i18n/i18n-context';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function ContactPage() {
  const { language } = useI18n();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(language === 'ar' ? 'تم إرسال الرسالة بنجاح سنرد عليك قريباً!' : 'Message envoyé avec succès! Nous reviendrons vers vous bientôt.');
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16">
          {/* Info Side */}
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h1 className="text-4xl md:text-5xl font-serif text-emerald-950 mb-6">
                {language === 'ar' ? 'تواصل معنا' : 'Contactez-nous'}
              </h1>
              <p className="text-gray-600 text-lg font-light leading-relaxed">
                {language === 'ar' 
                  ? 'سواء كنت بائع تجزئة أو مهتماً بمنتجاتنا، يسعدنا سماع صوتك. فريقنا متواجد للإجابة على جميع استفساراتك.' 
                  : 'Que vous soyez un revendeur ou que vous soyez intéressé par nos produits, nous serions ravis de vous entendre. Notre équipe est là pour répondre à toutes vos questions.'}
              </p>
            </motion.div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 bg-white p-6 shadow-sm border border-emerald-50">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-800">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm uppercase tracking-wider">{language === 'ar' ? 'رقم الهاتف' : 'Numéro de téléphone'}</p>
                  <p className="text-emerald-950 font-medium">+213 550 123 456</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white p-6 shadow-sm border border-emerald-50">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-800">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm uppercase tracking-wider">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</p>
                  <p className="text-emerald-950 font-medium">contact@amouris.dz</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white p-6 shadow-sm border border-emerald-50">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-800">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm uppercase tracking-wider">{language === 'ar' ? 'العنوان' : 'Adresse'}</p>
                  <p className="text-emerald-950 font-medium">{language === 'ar' ? 'حي باب الواد، الجزائر العاصمة' : 'Bab El Oued, Alger'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-10 shadow-xl rounded-none border border-emerald-50"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6">
                <div className="space-y-2 text-start">
                  <Label htmlFor="name">{language === 'ar' ? 'الاسم' : 'Nom'}</Label>
                  <Input id="name" required placeholder={language === 'ar' ? 'الاسم بالكامل' : 'Nom Complet'} className="bg-neutral-50" />
                </div>
                <div className="space-y-2 text-start">
                  <Label htmlFor="email">{language === 'ar' ? 'البريد الإلكتروني / رقم الهاتف' : 'Email / Téléphone'}</Label>
                  <Input id="email" required placeholder={language === 'ar' ? 'وسيلة الاتصال' : 'Moyen de contact'} className="bg-neutral-50" />
                </div>
                <div className="space-y-2 text-start">
                  <Label htmlFor="message">{language === 'ar' ? 'الرسالة' : 'Message'}</Label>
                  <Textarea id="message" required placeholder={language === 'ar' ? 'كيف يمكننا مساعدتك؟' : 'Comment pouvons-nous vous aider ?'} className="min-h-[150px] bg-neutral-50" />
                </div>
              </div>
              <Button type="submit" className="w-full bg-emerald-900 hover:bg-emerald-950 text-white py-6">
                <Send className="h-4 w-4 mx-2" />
                {language === 'ar' ? 'إرسال الرسالة' : 'Envoyer le message'}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
