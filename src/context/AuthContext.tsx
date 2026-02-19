import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { api } from '../lib/api';
import { supabase } from '../lib/supabaseClient';
import { useAppContext } from './AppContext';
import type { SubscriptionSnapshot, SubscriptionStatus } from '../types/billing';

type AppUserProfile = {
  id: string;
  firm_id?: string | null;
  role?: string | null;
};

type AuthContextValue = {
  hasSession: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  isBootstrapping: boolean;
  gmailConnected: boolean;
  gmailEmail?: string;
  csrfToken?: string;
  subscription?: SubscriptionSnapshot;
  hasAppAccess: boolean;
  isMasterUser: boolean;
  appUserProfile: AppUserProfile | null;
  profileReady: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithManual: () => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: (options?: { background?: boolean }) => Promise<void>;
};

type MeResponse = {
  authenticated: boolean;
  csrfToken?: string;
  user?: { id: string; email?: string };
  gmail?: { connected: boolean; email?: string; scopes?: string };
  subscription?: SubscriptionSnapshot;
  isMasterUser?: boolean;
};

const ALLOWED_APP_STATUSES: SubscriptionStatus[] = ['trial', 'active', 'past_due'];
export const MANUAL_AUTH_KEY = 'xproflow-manual-auth';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { session, user, loading: appLoading, refresh: refreshAppContext } = useAppContext();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [gmailConnected, setGmailConnected] = useState(false);
  const [gmailEmail, setGmailEmail] = useState<string | undefined>(undefined);
  const [csrfToken, setCsrfToken] = useState<string | undefined>(undefined);
  const [subscription, setSubscription] = useState<SubscriptionSnapshot | undefined>(undefined);
  const [isMasterUser, setIsMasterUser] = useState(false);
  const [manualAuth, setManualAuth] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.localStorage.getItem(MANUAL_AUTH_KEY) === 'true';
  });

  const manualAuthRef = useRef(manualAuth);
  const isRefreshingRef = useRef(false);
  const hasRefreshed = useRef(false);
  const autoRefreshBlockedRef = useRef(false);
  const refreshSessionRef = useRef<(options?: { background?: boolean }) => Promise<void>>(async () => {});

  useEffect(() => {
    manualAuthRef.current = manualAuth;
  }, [manualAuth]);

  const clearManualAuth = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(MANUAL_AUTH_KEY);
    }
    setManualAuth(false);
  }, []);

  const resetSignedOutState = useCallback(() => {
    setIsAuthenticated(false);
    setCsrfToken(undefined);
    setGmailConnected(false);
    setGmailEmail(undefined);
    setSubscription(undefined);
    setIsMasterUser(false);
  }, []);

  const refreshSession = useCallback(async (options?: { background?: boolean }) => {
    if (isRefreshingRef.current) {
      return;
    }

    if (autoRefreshBlockedRef.current && options?.background) {
      return;
    }

    isRefreshingRef.current = true;
    const isBackgroundRefresh = options?.background ?? false;

    if (!isBackgroundRefresh) {
      setIsLoading(true);
    }

    try {
      await refreshAppContext();
      const hasSupabaseSession = Boolean(session);
      const isManualSession = manualAuthRef.current && !hasSupabaseSession;
      const hasActiveSession = hasSupabaseSession || isManualSession;

      if (hasSupabaseSession && manualAuthRef.current) {
        clearManualAuth();
      }

      const data = await api.get<MeResponse>('/api/me');

      autoRefreshBlockedRef.current = false;
      setIsAuthenticated(data.authenticated || hasActiveSession);
      setCsrfToken(data.csrfToken);
      setGmailConnected(Boolean(data.gmail?.connected));
      setGmailEmail(data.gmail?.email);
      setSubscription(data.subscription);
      setIsMasterUser(Boolean(data.isMasterUser) || isManualSession);
    } catch (sessionError) {
      console.error('Failed to refresh application session state:', sessionError);
      autoRefreshBlockedRef.current = true;

      // Force session to null by signing out and syncing app context.
      await supabase.auth.signOut({ scope: 'global' });
      await refreshAppContext();
      clearManualAuth();
      resetSignedOutState();
    } finally {
      setIsLoading(false);
      isRefreshingRef.current = false;
    }
  }, [clearManualAuth, refreshAppContext, resetSignedOutState, session]);

  useEffect(() => {
    refreshSessionRef.current = refreshSession;
  }, [refreshSession]);

  useEffect(() => {
    if (hasRefreshed.current) {
      return;
    }

    hasRefreshed.current = true;
    void refreshSessionRef.current();
  }, []);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'INITIAL_SESSION') {
        return;
      }

      if (autoRefreshBlockedRef.current) {
        return;
      }

      void refreshSessionRef.current({ background: true });
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const hasSession = Boolean(session) || manualAuth;
  const appUserProfile = manualAuth && !user
    ? {
        id: 'manual-user',
        firm_id: null,
        role: 'master',
      }
    : user
      ? {
          id: user.id,
          firm_id: user.firm_id,
          role: user.role,
        }
      : null;
  const profileReady = !hasSession || manualAuth || Boolean(user);

  const value = useMemo(
    () => ({
      hasSession,
      isAuthenticated,
      isLoading: isLoading || appLoading,
      isBootstrapping: isLoading || appLoading || (hasSession && !profileReady),
      gmailConnected,
      gmailEmail,
      csrfToken,
      subscription,
      hasAppAccess: subscription ? ALLOWED_APP_STATUSES.includes(subscription.status) : true,
      isMasterUser,
      appUserProfile,
      profileReady,
      loginWithGoogle: async () => {
        autoRefreshBlockedRef.current = false;
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
            scopes: 'https://www.googleapis.com/auth/gmail.readonly',
          },
        });
        if (error) throw error;
      },
      loginWithManual: async () => {
        autoRefreshBlockedRef.current = false;
        await supabase.auth.signOut({ scope: 'global' });
        window.localStorage.setItem(MANUAL_AUTH_KEY, 'true');
        setManualAuth(true);
        setIsMasterUser(true);
        setIsAuthenticated(true);
        setIsLoading(false);
      },
      logout: async () => {
        clearManualAuth();
        resetSignedOutState();
        await supabase.auth.signOut({ scope: 'global' });
      },
      refreshSession,
    }),
    [
      hasSession,
      isAuthenticated,
      isLoading,
      appLoading,
      profileReady,
      gmailConnected,
      gmailEmail,
      csrfToken,
      subscription,
      isMasterUser,
      appUserProfile,
      refreshSession,
      clearManualAuth,
      resetSignedOutState,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
