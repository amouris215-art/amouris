'use server';

import { createAdminClient } from '@/lib/supabase/admin';

export async function resetPasswordAction(customerId: string, newPassword?: string) {
  try {
    const admin = createAdminClient();
    const pwd = newPassword || `pwd_reset_${Math.random().toString(36).slice(2, 8)}`;
    
    const { data, error } = await admin.auth.admin.updateUserById(customerId, { 
      password: pwd 
    });

    if (error) {
      console.error('Password reset error:', error);
      throw new Error(error.message);
    }

    return { success: true, password: pwd };
  } catch (error: any) {
    console.error('CRITICAL: Server Action resetPasswordAction failed:', error);
    throw new Error(error.message || 'Error occurred while resetting password');
  }
}

export async function toggleFreezeAction(customerId: string, isFrozen: boolean) {
  try {
    const admin = createAdminClient();
    const { error } = await admin
      .from('profiles')
      .update({ is_frozen: isFrozen })
      .eq('id', customerId);

    if (error) {
      console.error('Toggle freeze error:', error);
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error: any) {
    console.error('CRITICAL: Server Action toggleFreezeAction failed:', error);
    throw new Error(error.message || 'Error occurred while toggling freeze status');
  }
}
