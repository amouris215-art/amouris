import { fetchSettings } from '@/lib/api/settings';
import { fetchAnnouncements } from '@/lib/api/announcements';
import AdminSettingsClient from './AdminSettingsClient';

export default async function AdminSettingsPage() {
  const [settings, announcements] = await Promise.all([
    fetchSettings(),
    fetchAnnouncements()
  ]);

  return (
    <AdminSettingsClient 
      initialSettings={settings} 
      initialAnnouncements={announcements} 
    />
  );
}
