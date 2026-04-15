'use client';

import { useState } from 'react';
import { 
  Megaphone, Plus, Trash2, GripVertical, 
  Save, Loader2, AlertCircle, CheckCircle2,
  Airplay, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  createAnnouncementAction, 
  updateAnnouncementAction, 
  deleteAnnouncementAction,
  toggleAnnouncementActive 
} from '@/lib/actions/announcements';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/i18n/i18n-context';

interface Announcement {
  id: string;
  text_fr: string;
  text_ar: string;
  is_active: boolean;
  display_order: number;
}

export default function AnnouncementsClient({ initialAnnouncements }: { initialAnnouncements: Announcement[] }) {
  const { t, dir } = useI18n();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [annDraft, setAnnDraft] = useState({
    text_fr: '',
    text_ar: '',
    is_active: true,
  });

  const handleAdd = async () => {
    if (!annDraft.text_fr || !annDraft.text_ar) {
      toast.error(t('admin.announcements.toasts.error_fill_both'));
      return;
    }
    setLoading(true);
    try {
      const result = await createAnnouncementAction({
        ...annDraft,
        display_order: initialAnnouncements.length,
      });
      if (result.success) {
        toast.success(t('admin.announcements.toasts.success_add'));
        setAnnDraft({ text_fr: '', text_ar: '', is_active: true });
        router.refresh();
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      toast.error(t('admin.announcements.toasts.error_prefix') + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string, updates: Partial<Announcement>) => {
    try {
      const result = await updateAnnouncementAction(id, updates);
      if (result.success) {
        router.refresh();
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      toast.error(t('admin.announcements.toasts.error_update') + ': ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.announcements.confirm_delete'))) return;
    try {
      const result = await deleteAnnouncementAction(id);
      if (result.success) {
        toast.success(t('admin.announcements.toasts.success_delete'));
        router.refresh();
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      toast.error(t('admin.announcements.toasts.error_prefix') + err.message);
    }
  };

  const handleToggle = async (id: string, status: boolean) => {
    try {
      const result = await toggleAnnouncementActive(id, status);
      if (result.success) {
        toast.success(t('admin.announcements.toasts.success_status'));
        router.refresh();
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      toast.error(t('admin.announcements.toasts.error_prefix') + err.message);
    }
  };

  return (
    <div className="space-y-12 pb-24" dir={dir}>
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className={dir === 'rtl' ? 'text-right' : ''}>
          <h1 className="text-4xl font-bold font-serif text-emerald-950 flex items-center gap-4 italic">
            <Megaphone size={36} className="text-[#C9A84C]" />
            {t('admin.announcements.title')}
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-950/40 mt-2">{t('admin.announcements.subtitle')}</p>
        </div>
        
        <div className={`flex items-center gap-3 px-6 py-3 bg-emerald-50 rounded-2xl border border-emerald-100 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
           <Airplay size={18} className="text-emerald-600 animate-pulse" />
           <span className="text-[10px] font-black uppercase text-emerald-900 tracking-widest">{t('admin.announcements.realtime_active')}</span>
        </div>
      </header>

      <section className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-emerald-950/5 shadow-2xl shadow-emerald-900/5 space-y-12">
        {/* Create New Form */}
        <div className="space-y-8 bg-neutral-50/50 p-8 rounded-[2.5rem] border border-emerald-950/[0.03]">
          <div className={`flex items-center gap-3 mb-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <Plus size={18} className="text-[#C9A84C]" />
            <h2 className="text-lg font-bold text-emerald-950 font-serif">{t('admin.announcements.form.title')}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className={`text-[10px] font-black uppercase tracking-widest text-emerald-950/30 px-1 ${dir === 'rtl' ? 'text-right block' : ''}`}>{t('admin.announcements.form.text_fr_label')}</label>
              <textarea 
                value={annDraft.text_fr}
                onChange={e => setAnnDraft(p => ({ ...p, text_fr: e.target.value }))}
                placeholder={t('admin.announcements.form.placeholder_fr')}
                className={`w-full h-24 p-5 bg-white border border-emerald-950/5 rounded-2xl text-sm outline-none focus:border-[#C9A84C] transition-all resize-none shadow-sm ${dir === 'rtl' ? 'text-right' : ''}`}
              />
            </div>
            <div className="space-y-3">
              <label className={`text-[10px] font-black uppercase tracking-widest text-emerald-950/30 px-1 ${dir === 'rtl' ? 'text-right block' : ''}`}>{t('admin.announcements.form.text_ar_label')}</label>
              <textarea 
                dir="rtl"
                value={annDraft.text_ar}
                onChange={e => setAnnDraft(p => ({ ...p, text_ar: e.target.value }))}
                placeholder={t('admin.announcements.form.placeholder_ar')}
                className="w-full h-24 p-5 bg-white border border-emerald-950/5 rounded-2xl text-sm font-arabic outline-none focus:border-[#C9A84C] transition-all resize-none shadow-sm"
              />
            </div>
          </div>
          
          <div className={`flex items-center justify-between pt-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
             <label className={`flex items-center gap-3 cursor-pointer group ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <input 
                  type="checkbox" 
                  checked={annDraft.is_active}
                  onChange={e => setAnnDraft(p => ({ ...p, is_active: e.target.checked }))}
                  className="w-5 h-5 rounded-lg accent-emerald-600"
                />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-950/40 group-hover:text-emerald-950 transition-colors">{t('admin.announcements.form.broadcast_now')}</span>
             </label>
             
             <button 
               onClick={handleAdd}
               disabled={loading}
               className="h-14 px-10 bg-emerald-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
             >
               {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
               {loading ? t('admin.announcements.form.saving') : t('admin.announcements.form.save_button')}
             </button>
          </div>
        </div>

        {/* List of existing */}
        <div className="space-y-6">
          <div className={`flex items-center justify-between px-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
             <h2 className="text-xl font-bold font-serif text-emerald-950 italic">{t('admin.announcements.list.title')}</h2>
             <span className="text-[10px] font-black uppercase text-emerald-950/20 tracking-widest">{t('admin.announcements.list.total_count', { count: initialAnnouncements.length })}</span>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {initialAnnouncements.map((ann, idx) => (
                <motion.div 
                  layout
                  key={ann.id}
                  initial={{ opacity: 0, x: dir === 'rtl' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`group relative bg-white border border-emerald-950/5 rounded-[2rem] p-6 ${dir === 'rtl' ? 'pl-24 pr-6' : 'pr-24 pl-6'} hover:border-emerald-950/20 hover:shadow-2xl hover:shadow-emerald-900/5 transition-all duration-500`}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <div className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                          <Globe size={12} className="text-emerald-600/40" />
                          <span className="text-[8px] font-bold uppercase tracking-widest text-emerald-900/30">{t('admin.announcements.list.fr_label')}</span>
                       </div>
                       <input 
                         className={`w-full bg-transparent border-none text-sm font-semibold text-emerald-950 p-2 rounded-lg hover:bg-neutral-50 focus:bg-neutral-50 transition-colors ${dir === 'rtl' ? 'text-right' : ''}`}
                         value={ann.text_fr}
                         onChange={e => handleUpdate(ann.id, { text_fr: e.target.value })}
                       />
                    </div>
                    <div className="space-y-4">
                       <div className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row' : 'justify-end'}`}>
                          <span className="text-[8px] font-bold uppercase tracking-widest text-[#C9A84C]/40">{t('admin.announcements.list.ar_label')}</span>
                          <Globe size={12} className="text-[#C9A84C]/40" />
                       </div>
                       <input 
                         dir="rtl"
                         className="w-full bg-transparent border-none text-sm font-arabic text-emerald-950 p-2 rounded-lg hover:bg-neutral-50 focus:bg-neutral-50 transition-colors text-right"
                         value={ann.text_ar}
                         onChange={e => handleUpdate(ann.id, { text_ar: e.target.value })}
                       />
                    </div>
                  </div>

                  <div className={`absolute ${dir === 'rtl' ? 'left-6' : 'right-6'} top-1/2 -translate-y-1/2 flex flex-col gap-3`}>
                     <button 
                       onClick={() => handleToggle(ann.id, ann.is_active)}
                       className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${ann.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-neutral-50 text-neutral-300'}`}
                       title={ann.is_active ? t('admin.announcements.list.action_deactivate') : t('admin.announcements.list.action_activate')}
                     >
                       {ann.is_active ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                     </button>
                     <button 
                       onClick={() => handleDelete(ann.id)}
                       className="w-12 h-12 rounded-xl bg-rose-50 text-rose-300 hover:text-rose-600 hover:bg-rose-100 transition-all flex items-center justify-center"
                     >
                       <Trash2 size={20} />
                     </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {initialAnnouncements.length === 0 && (
              <div className="py-24 text-center border-2 border-dashed border-emerald-950/5 rounded-[3rem]">
                 <Megaphone size={48} className="mx-auto text-emerald-950/5 mb-4" />
                 <p className="font-serif text-xl text-emerald-950/20 italic">{t('admin.announcements.no_announcements')}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Realtime Info Box */}
      <footer className="bg-[#C9A84C] text-emerald-950 p-10 rounded-[3rem] shadow-xl shadow-amber-900/10 flex flex-col md:flex-row items-center gap-8 justify-between">
         <div className={`space-y-2 text-center ${dir === 'rtl' ? 'md:text-right' : 'md:text-left'}`}>
            <h3 className="text-xl font-bold font-serif italic">{t('admin.announcements.footer.title')}</h3>
            <p className="text-sm font-medium opacity-60 max-w-xl">
              {t('admin.announcements.footer.desc')}
            </p>
         </div>
         <div className="flex -space-x-4">
            <div className="w-12 h-12 rounded-full border-4 border-[#C9A84C] bg-emerald-900 flex items-center justify-center text-white text-[10px] font-black">WS</div>
            <div className="w-12 h-12 rounded-full border-4 border-[#C9A84C] bg-emerald-700 flex items-center justify-center text-white text-[10px] font-black">RT</div>
            <div className="w-12 h-12 rounded-full border-4 border-[#C9A84C] bg-amber-600 flex items-center justify-center text-white text-[10px] font-black">⚡</div>
         </div>
      </footer>
    </div>
  );
}
