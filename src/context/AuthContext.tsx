import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { api } from '../lib/api';
import { supabase } from '../lib/supabaseClient';
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
  const [hasSession, setHasSession] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [gmailConnected, setGmailConnected] = useState(false);
  const [gmailEmail, setGmailEmail] = useState<string | undefined>(undefined);
  const [csrfToken, setCsrfToken] = useState<string | undefined>(undefined);
  const [subscription, setSubscription] = useState<SubscriptionSnapshot | undefined>(undefined);
  const [isMasterUser, setIsMasterUser] = useState(false);
  const [appUserProfile, setAppUserProfile] = useState<AppUserProfile | null>(null);
  const [profileReady, setProfileReady] = useState(false);
  const [manualAuth, setManualAuth] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.localStorage.getItem(MANUAL_AUTH_KEY) === 'true';
  });
  const manualAuthRef = useRef(manualAuth);
  const isRefreshingRef = useRef(false);
  const hasBootstrappedRef = useRef(false);

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
    setHasSession(false);
    setIsAuthenticated(false);
    setProfileReady(true);
    setAppUserProfile(null);
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

    isRefreshingRef.current = true;
    const isBackgroundRefresh = options?.background ?? false;
    if (!isBackgroundRefresh) setIsLoading(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const hasSupabaseSession = Boolean(sessionData.session);
      const isManualSession = manualAuthRef.current && !hasSupabaseSession;
      const hasActiveSession = hasSupabaseSession || isManualSession;

      setHasSession(hasActiveSession);

      if (hasSupabaseSession && manualAuthRef.current) {
        clearManualAuth();
      }

      const data = await api.get<MeResponse>('/api/me');
      const nextProfile = hasActiveSession
        ? ({
            id: data.user?.id ?? sessionData.session?.user?.id ?? 'manual-user',
            firm_id: null,
            role: isManualSession ? 'master' : null,
          } satisfies AppUserProfile)
        : null;

      if (hasActiveSession && !nextProfile) {
        await supabase.auth.signOut({ scope: 'global' });
        resetSignedOutState();
        return;
      }

      setIsAuthenticated(data.authenticated || hasActiveSession);
      setProfileReady(!hasActiveSession || Boolean(nextProfile));
      setAppUserProfile(nextProfile);
      setCsrfToken(data.csrfToken);
      setGmailConnected(Boolean(data.gmail?.connected));
      setGmailEmail(data.gmail?.email);
      setSubscription(data.subscription);
      setIsMasterUser(Boolean(data.isMasterUser) || isManualSession);
    } catch (sessionError) {
      console.error('Failed to refresh application session state:', sessionError);
      const { data: sessionData } = await supabase.auth.getSession();
      const hasSupabaseSession = Boolean(sessionData.session);
      const isManualSession = manualAuthRef.current && !hasSupabaseSession;
      const hasActiveSession = hasSupabaseSession || isManualSession;

      if (hasSupabaseSession && !isManualSession) {
        await supabase.auth.signOut({ scope: 'global' });
        resetSignedOutState();
      } else {
        setHasSession(hasActiveSession);
        setIsAuthenticated(hasActiveSession);
        setProfileReady(true);
        setAppUserProfile(
          isManualSession
            ? {
                id: 'manual-user',
                firm_id: null,
                role: 'master',
              }
            : null
        );
        setGmailConnected(false);
        setGmailEmail(undefined);
        setCsrfToken(undefined);
        setSubscription(undefined);
        setIsMasterUser(isManualSession);
      }
    } finally {
      if (!isBackgroundRefresh) setIsLoading(false);
      isRefreshingRef.current = false;
    }
  }, [clearManualAuth, resetSignedOutState]);

  useEffect(() => {
    if (!hasBootstrappedRef.current) {
      hasBootstrappedRef.current = true;
      void refreshSession();
    }

    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'INITIAL_SESSION') {
        return;
      }

      void refreshSession({ background: true });
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, [refreshSession]);

  const value = useMemo(
    () => ({
      hasSession,
      isAuthenticated,
      isLoading,
      isBootstrapping: isLoading || (hasSession && !profileReady),
      gmailConnected,
      gmailEmail,
      csrfToken,
      subscription,
      hasAppAccess: subscription ? ALLOWED_APP_STATUSES.includes(subscription.status) : true,
      isMasterUser,
      appUserProfile,
      profileReady,
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
      loginWithManual: async () => {
        await supabase.auth.signOut({ scope: 'global' });
        window.localStorage.setItem(MANUAL_AUTH_KEY, 'true');
        setManualAuth(true);
        setHasSession(true);
        setIsMasterUser(true);
        setIsAuthenticated(true);
        setProfileReady(true);
        setAppUserProfile({
          id: 'manual-user',
          firm_id: null,
          role: 'master',
        });
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
