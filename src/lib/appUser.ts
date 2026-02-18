import { supabase } from './supabaseClient';

type AppUserRow = {
  id: string;
  firm_id?: string | null;
  role?: string | null;
};

type WaitForAppUserOptions = {
  timeoutMs?: number;
  intervalMs?: number;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const waitForAppUser = async (
  userId: string,
  options: WaitForAppUserOptions = {}
): Promise<AppUserRow | null> => {
  const timeoutMs = options.timeoutMs ?? 6000;
  const intervalMs = options.intervalMs ?? 250;
  const startedAt = Date.now();
  let lastError: Error | null = null;

  while (Date.now() - startedAt < timeoutMs) {
    const { data, error } = await supabase
      .from('users')
      .select('id, firm_id, role')
      .eq('id', userId)
      .maybeSingle();

    if (!error && data) {
      return data as AppUserRow;
    }

    if (error) {
      const normalizedError = new Error(error.message || 'Unknown error while loading app user');
      (normalizedError as Error & { code?: string }).code = error.code;
      lastError = normalizedError;

      if (error.code === '42501') {
        throw normalizedError;
      }
    }

    await delay(intervalMs);
  }

  if (lastError) {
    throw lastError;
  }

  return null;
};

export type { AppUserRow };
