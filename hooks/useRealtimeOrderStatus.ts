import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export const useRealtimeOrderStatus = (orderId: string) => {
  const router = useRouter();

  useEffect(() => {
    if (!orderId) return;
    
    const supabase = createClient();

    const channel = supabase
      .channel(`order_status_${orderId}`)
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'orders',
          filter: `id=eq.${orderId}`
        },
        (payload) => {
          if (payload.new.order_status !== payload.old.order_status) {
            toast.info(`Le statut de votre commande a été mis à jour: ${payload.new.order_status}`);
            router.refresh();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, router]);
};
