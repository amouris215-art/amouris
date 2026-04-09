"use client";

import { useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useCustomerAuthStore } from '@/store/customer-auth.store';
import { useAdminAuthStore } from '@/store/admin-auth.store';
import { useSettingsStore } from '@/store/settings.store';
import { useCategoriesStore } from '@/store/categories.store';
import { useBrandsStore } from '@/store/brands.store';
import { useCollectionsStore } from '@/store/collections.store';
import { useTagsStore } from '@/store/tags.store';
import { useProductsStore } from '@/store/products.store';

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { setSession: setCustomerSession } = useCustomerAuthStore();
  const { setSession: setAdminSession } = useAdminAuthStore();
  
  // Data stores fetching functions
  const { fetchSettings } = useSettingsStore();
  const { fetchCategories } = useCategoriesStore();
  const { fetchBrands } = useBrandsStore();
  const { fetchCollections } = useCollectionsStore();
  const { fetchTags } = useTagsStore();
  const { fetchProducts } = useProductsStore();

  useEffect(() => {
    // 1. Initialize Auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        if (session.user.user_metadata.role === 'admin') {
          setAdminSession(session);
        } else {
          setCustomerSession(session);
        }
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        if (session.user.user_metadata.role === 'admin') {
          setAdminSession(session);
          setCustomerSession(null);
        } else {
          setCustomerSession(session);
          setAdminSession(null);
        }
      } else {
        setCustomerSession(null);
        setAdminSession(null);
      }
    });

    // 2. Initialize Data from Supabase
    const initData = async () => {
      try {
        await Promise.all([
          fetchSettings(),
          fetchCategories(),
          fetchBrands(),
          fetchCollections(),
          fetchTags(),
          fetchProducts()
        ]);
      } catch (error) {
        console.error("Error initializing data from Supabase:", error);
      }
    };

    initData();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return <>{children}</>;
}
