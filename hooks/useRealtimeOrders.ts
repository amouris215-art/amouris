import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useOrdersStore } from '@/store/orders.store';
import { toast } from 'sonner';

export const useRealtimeOrders = () => {
  const fetchOrders = useOrdersStore((s) => s.fetchOrders);

  useEffect(() => {
    const supabase = createClient();
    
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          console.log('New order received!', payload);
          toast.success(`Nouvelle commande: ${payload.new.order_number}`);
          fetchOrders(true); // Force refresh
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchOrders]);
};
