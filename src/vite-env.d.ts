/// <reference types="vite/client" />

declare const supabase: {
  auth: {
    signInWithOAuth: (options: {
      provider: 'google';
      options: { redirectTo: string };
    }) => Promise<unknown>;
    getSession: () => Promise<{ data: { session: unknown }; error: unknown }>;
  };
};
