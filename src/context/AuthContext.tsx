import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api } from '../lib/api';
import { supabase } from '../lib/supabaseClient';
import type { SubscriptionSnapshot, SubscriptionStatus } from '../types/billing';

type AuthContextValue = {
  isAuthenticated: boolean;
  isLoading: boolean;
  gmailConnected: boolean;
  gmailEmail?: string;
  csrfToken?: string;
  subscription?: SubscriptionSnapshot;
  hasAppAccess: boolean;
  isMasterUser: boolean;
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
  subscription?: SubscriptionSnapshot;
};

const ALLOWED_APP_STATUSES: SubscriptionStatus[] = ['trial', 'active', 'past_due'];
export const MANUAL_AUTH_KEY = 'xproflow-manual-auth';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [gmailConnected, setGmailConnected] = useState(false);
  const [gmailEmail, setGmailEmail] = useState<string | undefined>(undefined);
  const [csrfToken, setCsrfToken] = useState<string | undefined>(undefined);
  const [subscription, setSubscription] = useState<SubscriptionSnapshot | undefined>(undefined);
  const [manualAuth, setManualAuth] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.localStorage.getItem(MANUAL_AUTH_KEY) === 'true';
  });

  const clearManualAuth = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(MANUAL_AUTH_KEY);
    }
    setManualAuth(false);
  }, []);

  const refreshSession = useCallback(async (options?: { background?: boolean }) => {
    const isBackgroundRefresh = options?.background ?? false;
    if (!isBackgroundRefresh) setIsLoading(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const hasSession = Boolean(sessionData.session);
      const isManualSession = manualAuth && !hasSession;
      if (hasSession && manualAuth) {
        clearManualAuth();
      }
      const data = await api.get<MeResponse>('/api/me');
      setIsAuthenticated(data.authenticated || hasSession || isManualSession);
      setCsrfToken(data.csrfToken);
      setGmailConnected(Boolean(data.gmail?.connected));
      setGmailEmail(data.gmail?.email);
      setSubscription(data.subscription);
    } catch {
      const { data: sessionData } = await supabase.auth.getSession();
      setIsAuthenticated(Boolean(sessionData.session) || manualAuth);
      setGmailConnected(false);
      setGmailEmail(undefined);
      setCsrfToken(undefined);
      setSubscription(undefined);
    } finally {
      if (!isBackgroundRefresh) setIsLoading(false);
    }
  }, [manualAuth, clearManualAuth]);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  const value = useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      gmailConnected,
      gmailEmail,
      csrfToken,
      subscription,
      hasAppAccess: subscription ? ALLOWED_APP_STATUSES.includes(subscription.status) : true,
      isMasterUser: manualAuth,
      loginWithGoogle: async () => {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
            scopes: 'https://www.googleapis.com/auth/gmail.readonly',
          },
        });
        if (error) throw error;
      },
      loginWithManual: () => {
        window.localStorage.setItem(MANUAL_AUTH_KEY, 'true');
        setManualAuth(true);
        setIsAuthenticated(true);
      },
      logout: async () => {
        setIsAuthenticated(false);
        setGmailConnected(false);
        setGmailEmail(undefined);
        setCsrfToken(undefined);
        setSubscription(undefined);
        clearManualAuth();
        await supabase.auth.signOut({ scope: 'global' });
      },
      refreshSession,
    }),
    [isAuthenticated, isLoading, gmailConnected, gmailEmail, csrfToken, subscription, refreshSession, manualAuth, clearManualAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
