import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

type AppUser = {
  id: string;
  firm_id: string | null;
  role: string | null;
  [key: string]: unknown;
};

type Firm = {
  id: string;
  [key: string]: unknown;
};

type AppContextValue = {
  session: Session | null;
  user: AppUser | null;
  firm: Firm | null;
  role: string | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [firm, setFirm] = useState<Firm | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isMountedRef = useRef(true);
  const inFlightHydrationRef = useRef<Promise<void> | null>(null);
  const queuedSessionRef = useRef<Session | null | undefined>(undefined);

  const hydrateState = useCallback(async (incomingSession?: Session | null) => {
    if (inFlightHydrationRef.current) {
      queuedSessionRef.current = incomingSession;
      return inFlightHydrationRef.current;
    }

    const runHydration = async (requestedSession?: Session | null) => {
      if (!isMountedRef.current) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const sessionToUse = typeof requestedSession === 'undefined'
          ? (await supabase.auth.getSession()).data.session
          : requestedSession;

        if (!isMountedRef.current) {
          return;
        }

        setSession(sessionToUse);

        if (!sessionToUse?.user?.id) {
          setUser(null);
          setFirm(null);
          setRole(null);
          return;
        }

        const fetchAppUser = async () => {
          const { data, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', sessionToUse.user.id)
            .maybeSingle();

          if (userError) {
            throw userError;
          }

          return data as AppUser | null;
        };

        let appUser = await fetchAppUser();

        if (!appUser) {
          // First-login race condition: profile row can appear moments after auth succeeds.
          await delay(300);
          appUser = await fetchAppUser();
        }

        if (!isMountedRef.current) {
          return;
        }

        setUser(appUser);
        setRole(appUser?.role ?? null);

        if (!appUser?.firm_id) {
          setFirm(null);
          return;
        }

        const { data: firmData, error: firmError } = await supabase
          .from('firms')
          .select('*')
          .eq('id', appUser.firm_id)
          .maybeSingle();

        if (firmError) {
          throw firmError;
        }

        if (!isMountedRef.current) {
          return;
        }

        setFirm((firmData as Firm | null) ?? null);
      } catch (hydrateError) {
        if (!isMountedRef.current) {
          return;
        }

        const message = hydrateError instanceof Error ? hydrateError.message : 'Failed to hydrate app context.';
        setError(message);
        setUser(null);
        setFirm(null);
        setRole(null);
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    inFlightHydrationRef.current = runHydration(incomingSession)
      .finally(async () => {
        inFlightHydrationRef.current = null;

        if (typeof queuedSessionRef.current !== 'undefined') {
          const queuedSession = queuedSessionRef.current;
          queuedSessionRef.current = undefined;
          await hydrateState(queuedSession);
        }
      });

    return inFlightHydrationRef.current;
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    void hydrateState();

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      void hydrateState(nextSession);
    });

    return () => {
      isMountedRef.current = false;
      data.subscription.unsubscribe();
    };
  }, [hydrateState]);

  const value = useMemo(() => ({
    session,
    user,
    firm,
    role,
    loading,
    error,
    refresh: async () => {
      await hydrateState();
    },
  }), [session, user, firm, role, loading, error, hydrateState]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }

  return context;
};

export type { AppUser, Firm };
