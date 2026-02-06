const { createClient } = require('@supabase/supabase-js');

let supabase;

function getSupabaseClient() {
  if (supabase) {
    return supabase;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.'
    );
  }

  supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
  return supabase;
}

module.exports = { getSupabaseClient };
