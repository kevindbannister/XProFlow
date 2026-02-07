import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';
import { getSupabaseClient } from '../lib/supabaseClient';

type AuthContextValue = {
  isAuthenticated: boolean;
  isLoading: boolean;
  gmailConnected: boolean;
  gmailEmail?: string;
  csrfToken?: string;
  loginWithGoogle: () => Promise<void>;
  loginWithManual: () => void;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

type MeResponse = {
  authenticated: boolean;
  csrfToken?: string;
  user?: { id: string; email?: string };
  gmail?: { connected: boolean; email?: string; scopes?: string };
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

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

  const refreshSession = async () => {
    setIsLoading(true);
    try {
      const data = await api.get<MeResponse>('/api/me');
      setIsAuthenticated(data.authenticated || manualAuth);
      setCsrfToken(data.csrfToken);
      setGmailConnected(Boolean(data.gmail?.connected));
      setGmailEmail(data.gmail?.email);
    } catch {
      setIsAuthenticated(manualAuth);
      setGmailConnected(false);
      setGmailEmail(undefined);
      setCsrfToken(undefined);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void refreshSession();
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      gmailConnected,
      gmailEmail,
      csrfToken,
      loginWithGoogle: async () => {
        console.log('Starting Supabase Google OAuth sign-in.');
        const supabase = getSupabaseClient();
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: `${window.location.origin}/auth/callback` }
        });
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
        if (!csrfToken) {
          setIsAuthenticated(false);
          setManualAuth(false);
          if (typeof window !== 'undefined') {
            window.localStorage.removeItem('xproflow-manual-auth');
          }
          return;
        }
        await api.post('/auth/logout', undefined, { 'x-csrf-token': csrfToken });
        setIsAuthenticated(false);
        setGmailConnected(false);
        setGmailEmail(undefined);
        setCsrfToken(undefined);
        setManualAuth(false);
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem('xproflow-manual-auth');
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
