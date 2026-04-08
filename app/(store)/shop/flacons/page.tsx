import dynamic from 'next/dynamic';

const FlaconsClient = dynamic(() => import('./FlaconsClient'), { ssr: false });

export default function FlaconsPage() {
  return <FlaconsClient />;
}
