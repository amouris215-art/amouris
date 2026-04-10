import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/api/auth';
import AccountSidebarClient from './AccountSidebarClient';

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentUser();

  if (!session || !session.profile) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-neutral-50/50 flex flex-col md:flex-row">
      <AccountSidebarClient customer={session.profile} />
      <main className="flex-1 w-full max-max-7xl mx-auto p-4 md:p-12 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
