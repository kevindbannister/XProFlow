import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? 'https://example.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'public-anon-key';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Missing Supabase env vars. Falling back to placeholder client config.');
}

const createSupabaseClient = () =>
  createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
  });

type GlobalWithSupabase = typeof globalThis & {
  __xproflowSupabaseClient?: ReturnType<typeof createSupabaseClient>;
};

const globalWithSupabase = globalThis as GlobalWithSupabase;

export const supabase =
  globalWithSupabase.__xproflowSupabaseClient ?? createSupabaseClient();

if (!globalWithSupabase.__xproflowSupabaseClient) {
  globalWithSupabase.__xproflowSupabaseClient = supabase;
}
