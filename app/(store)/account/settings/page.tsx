import { getCurrentUser } from '@/lib/api/auth';
import { redirect } from 'next/navigation';
import SettingsClient from './SettingsClient';

export default async function SettingsPage() {
  const session = await getCurrentUser();

  if (!session || !session.profile) {
    redirect('/login');
  }

  return <SettingsClient initialCustomer={session.profile} />;
}
