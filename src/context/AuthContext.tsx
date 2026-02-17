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

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [gmailConnected, setGmailConnected] = useState(false);
  const [gmailEmail, setGmailEmail] = useState<string | undefined>(undefined);
  const [csrfToken, setCsrfToken] = useState<string | undefined>(undefined);
  const [subscription, setSubscription] = useState<SubscriptionSnapshot | undefined>(undefined);

  const refreshSession = useCallback(async (options?: { background?: boolean }) => {
    const isBackgroundRefresh = options?.background ?? false;
    if (!isBackgroundRefresh) setIsLoading(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const hasSession = Boolean(sessionData.session);
      const data = await api.get<MeResponse>('/api/me');
      setIsAuthenticated(data.authenticated || hasSession);
      setCsrfToken(data.csrfToken);
      setGmailConnected(Boolean(data.gmail?.connected));
      setGmailEmail(data.gmail?.email);
      setSubscription(data.subscription);
    } catch {
      const { data: sessionData } = await supabase.auth.getSession();
      setIsAuthenticated(Boolean(sessionData.session));
      setGmailConnected(false);
      setGmailEmail(undefined);
      setCsrfToken(undefined);
      setSubscription(undefined);
    } finally {
      if (!isBackgroundRefresh) setIsLoading(false);
    }
  }, []);

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
        setIsAuthenticated(true);
      },
      logout: async () => {
        setIsAuthenticated(false);
        setGmailConnected(false);
        setGmailEmail(undefined);
        setCsrfToken(undefined);
        setSubscription(undefined);
        await supabase.auth.signOut({ scope: 'global' });
      },
      refreshSession,
    }),
    [isAuthenticated, isLoading, gmailConnected, gmailEmail, csrfToken, subscription, refreshSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
