import dynamic from 'next/dynamic';

const ParfumsClient = dynamic(() => import('./ParfumsClient'), { ssr: false });

export default function ParfumsPage() {
  return <ParfumsClient />;
}
