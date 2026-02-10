import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';
import { supabase } from '../lib/supabaseClient';

type AuthContextValue = {
  isAuthenticated: boolean;
  isLoading: boolean;
  gmailConnected: boolean;
  gmailEmail?: string;
  csrfToken?: string;
  loginWithGoogle: () => Promise<void>;
  loginWithManual: () => void;
  logout: () => Promise<void>;
  refreshSession: (options?: { background?: boolean }) => Promise<void>;
};

type MeResponse = {
  authenticated: boolean;
  csrfToken?: string;
  user?: { id: string; email?: string };
  gmail?: { connected: boolean; email?: string; scopes?: string };
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const clearPersistedAuthState = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem('xproflow-manual-auth');

  Object.keys(window.localStorage)
    .filter((key) => key.startsWith('sb-'))
    .forEach((key) => {
      window.localStorage.removeItem(key);
    });

  Object.keys(window.sessionStorage)
    .filter((key) => key.startsWith('sb-'))
    .forEach((key) => {
      window.sessionStorage.removeItem(key);
    });
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [gmailConnected, setGmailConnected] = useState(false);
  const [gmailEmail, setGmailEmail] = useState<string | undefined>(undefined);
  const [csrfToken, setCsrfToken] = useState<string | undefined>(undefined);
  const [manualAuth, setManualAuth] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.localStorage.getItem('xproflow-manual-auth') === 'true';
  });

  const refreshSession = useCallback(async (options?: { background?: boolean }) => {
    const isBackgroundRefresh = options?.background ?? false;
    if (!isBackgroundRefresh) {
      setIsLoading(true);
    }

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const hasSession = Boolean(sessionData.session);
      const data = await api.get<MeResponse>('/api/me');
      setIsAuthenticated(data.authenticated || manualAuth || hasSession);
      setCsrfToken(data.csrfToken);
      setGmailConnected(Boolean(data.gmail?.connected));
      setGmailEmail(data.gmail?.email);
    } catch {
      const { data: sessionData } = await supabase.auth.getSession();
      const hasSession = Boolean(sessionData.session);
      setIsAuthenticated(manualAuth || hasSession);
      setGmailConnected(false);
      setGmailEmail(undefined);
      setCsrfToken(undefined);
    } finally {
      if (!isBackgroundRefresh) {
        setIsLoading(false);
      }
    }
  }, [manualAuth]);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const intervalId = window.setInterval(() => {
      void refreshSession({ background: true });
    }, 60_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [refreshSession]);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsAuthenticated(true);
        void refreshSession({ background: true });
      } else {
        setIsAuthenticated(manualAuth);
        setGmailConnected(false);
        setGmailEmail(undefined);
        setCsrfToken(undefined);
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, [manualAuth, refreshSession]);

  const value = useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      gmailConnected,
      gmailEmail,
      csrfToken,
      loginWithGoogle: async () => {
        console.log('Starting Supabase Google OAuth sign-in.');
        console.log('Calling supabase.auth.signInWithOAuth with redirect.', {
          provider: 'google',
          redirectTo: `${window.location.origin}/auth/callback`
        });
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
            scopes: 'https://www.googleapis.com/auth/gmail.readonly',
            queryParams: {
              access_type: 'offline',
              prompt: 'consent'
            }
          }
        });
        console.log('Supabase Google OAuth response', { data, error });
        if (error) {
          console.error('Supabase Google OAuth sign-in failed.', error);
          throw error;
        }
      },
      loginWithManual: () => {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('xproflow-manual-auth', 'true');
        }
        setManualAuth(true);
        setIsAuthenticated(true);
      },
      logout: async () => {
        setIsAuthenticated(false);
        setGmailConnected(false);
        setGmailEmail(undefined);
        setCsrfToken(undefined);
        setManualAuth(false);
        clearPersistedAuthState();

        try {
          await api.post(
            '/auth/logout',
            undefined,
            csrfToken ? { 'x-csrf-token': csrfToken } : undefined
          );
        } finally {
          await supabase.auth.signOut({ scope: 'global' });
          clearPersistedAuthState();
        }
      },
      refreshSession
    }),
    [isAuthenticated, isLoading, gmailConnected, gmailEmail, csrfToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
