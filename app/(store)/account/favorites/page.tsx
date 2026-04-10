import { getCurrentUser } from '@/lib/api/auth';
import { redirect } from 'next/navigation';
import FavoritesClient from './FavoritesClient';

export default async function FavoritesPage() {
  const session = await getCurrentUser();

  if (!session || !session.profile) {
    redirect('/login');
  }

  return <FavoritesClient />;
}
