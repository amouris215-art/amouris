import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { useOrdersStore } from '@/store/orders.store';

export const useRealtimeOrders = () => {
  const fetchOrders = useOrdersStore(state => state.fetchOrders);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel('admin_orders')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          toast.success(`Nouvelle commande reçue: ${payload.new.order_number}`);
          // Force refresh the store
          fetchOrders(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchOrders]);
};
