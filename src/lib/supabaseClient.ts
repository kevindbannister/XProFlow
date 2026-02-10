import { createClient } from '@supabase/supabase-js';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.error('Missing Supabase env vars');
}

const cookieOptions = {
  domain: '.xproflow.com',
  sameSite: 'lax' as const,
  secure: true,
  path: '/',
};

const cookieStorage = {
  getItem: (key: string): string | null => {
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = document.cookie.match(new RegExp(`(?:^|; )${escapedKey}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
  },
  setItem: (key: string, value: string): void => {
    const parts = [
      `${key}=${encodeURIComponent(value)}`,
      `Path=${cookieOptions.path}`,
      `Domain=${cookieOptions.domain}`,
      `SameSite=${cookieOptions.sameSite}`,
    ];

    if (cookieOptions.secure) {
      parts.push('Secure');
    }

    document.cookie = parts.join('; ');
  },
  removeItem: (key: string): void => {
    const parts = [
      `${key}=`,
      'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
      `Path=${cookieOptions.path}`,
      `Domain=${cookieOptions.domain}`,
      `SameSite=${cookieOptions.sameSite}`,
    ];

    if (cookieOptions.secure) {
      parts.push('Secure');
    }

    document.cookie = parts.join('; ');
  },
};

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      storage: cookieStorage,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
