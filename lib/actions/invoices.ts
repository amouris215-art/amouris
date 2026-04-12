'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function deleteInvoiceAction(orderId: string) {
  const admin = createAdminClient()
  
  // 1. Reset invoice flags in orders table
  const { error } = await admin
    .from('orders')
    .update({ 
      invoice_generated: false,
      invoice_data: null,
      invoice_url: null
    })
    .eq('id', orderId)
  
  if (error) {
    console.error('Error resetting invoice state:', error)
    throw new Error(error.message)
  }

  revalidatePath('/admin/invoices')
  revalidatePath('/admin/orders')
  return { success: true }
}
