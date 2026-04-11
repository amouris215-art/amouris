import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function checkTrigger() {
  // Check the actual function definition
  const { data, error } = await supabase.rpc('exec_sql', {
    sql: `SELECT prosrc FROM pg_proc WHERE proname = 'handle_new_user'`
  });
  
  if (error) {
    console.log('Cannot use exec_sql, trying direct query on pg_catalog...');
    
    // Try via REST - query the function info from information_schema
    const { data: d2, error: e2 } = await supabase
      .from('pg_proc')
      .select('prosrc')
      .eq('proname', 'handle_new_user');
    
    if (e2) {
      console.log('Cannot query pg_proc either:', e2.message);
    } else {
      console.log('Function source:', d2);
    }
  } else {
    console.log('Function source:', data);
  }
}

checkTrigger().catch(console.error);
