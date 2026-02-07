type SupabaseClient = {
  auth: {
    signInWithOAuth: (options: {
      provider: 'google';
      options: { redirectTo: string };
    }) => Promise<{ data?: unknown; error?: unknown }>;
    getSession: () => Promise<{ data: { session: unknown }; error: unknown }>;
  };
};

export const getSupabaseClient = () => {
  const supabaseClient = (globalThis as { supabase?: SupabaseClient }).supabase;

  if (!supabaseClient) {
    const error = new Error('Supabase client is not available on the global scope.');
    console.error(error);
    throw error;
  }

  return supabaseClient;
};
