import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useOrdersStore } from '@/store/orders.store';
import { toast } from 'sonner';

export const useRealtimeOrderStatus = (orderId?: string) => {
  const fetchOrders = useOrdersStore((s) => s.fetchOrders);

  useEffect(() => {
    if (!orderId) return;

    const supabase = createClient();
    
    const channel = supabase
      .channel(`order-status-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          console.log('Order status updated!', payload);
          toast.info(`Statut de la commande mis à jour: ${payload.new.order_status}`);
          fetchOrders(true); // Force refresh
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, fetchOrders]);
};
