import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api } from '../lib/api';
import { supabase } from '../lib/supabaseClient';
import type { SubscriptionSnapshot, SubscriptionStatus } from '../types/billing';

type AppUserProfile = {
  id: string;
  firm_id?: string | null;
  role?: string | null;
};

type AuthContextValue = {
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

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const loadAppUserProfile = async (userId: string): Promise<AppUserProfile | null> => {
  const selectProfile = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('id, firm_id, role')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message || 'Unable to load app user profile');
    }

    return (data as AppUserProfile | null) ?? null;
  };

  const immediateProfile = await selectProfile();
  if (immediateProfile) {
    return immediateProfile;
  }

  await delay(500);
  return selectProfile();
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
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

      let nextProfile: AppUserProfile | null = null;
      if (sessionData.session?.user?.id) {
        nextProfile = await loadAppUserProfile(sessionData.session.user.id);
      }

      if (hasSession && !nextProfile && !isManualSession) {
        await supabase.auth.signOut({ scope: 'global' });
        setIsAuthenticated(false);
        setProfileReady(false);
        setAppUserProfile(null);
        setCsrfToken(undefined);
        setGmailConnected(false);
        setGmailEmail(undefined);
        setSubscription(undefined);
        setIsMasterUser(false);
        return;
      }

      const data = await api.get<MeResponse>('/api/me');
      setIsAuthenticated(data.authenticated || hasSession || isManualSession);
      setProfileReady(isManualSession || !hasSession || Boolean(nextProfile));
      setAppUserProfile(nextProfile);
      setCsrfToken(data.csrfToken);
      setGmailConnected(Boolean(data.gmail?.connected));
      setGmailEmail(data.gmail?.email);
      setSubscription(data.subscription);
      setIsMasterUser(Boolean(data.isMasterUser) || isManualSession);
    } catch (sessionError) {
      console.error('Failed to refresh application session state:', sessionError);
      const { data: sessionData } = await supabase.auth.getSession();
      const hasSession = Boolean(sessionData.session);
      setIsAuthenticated(hasSession || manualAuth);
      setProfileReady(manualAuth && !hasSession);
      setAppUserProfile(null);
      setGmailConnected(false);
      setGmailEmail(undefined);
      setCsrfToken(undefined);
      setSubscription(undefined);
      setIsMasterUser(manualAuth && !hasSession);
    } finally {
      if (!isBackgroundRefresh) setIsLoading(false);
    }
  }, [manualAuth, clearManualAuth]);

  useEffect(() => {
    void refreshSession();

    const { data } = supabase.auth.onAuthStateChange(() => {
      void refreshSession({ background: true });
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, [refreshSession]);

  const value = useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      isBootstrapping: isLoading || (isAuthenticated && !profileReady),
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
        setIsMasterUser(true);
        setIsAuthenticated(true);
        setProfileReady(true);
        setAppUserProfile(null);
      },
      logout: async () => {
        setIsAuthenticated(false);
        setProfileReady(false);
        setAppUserProfile(null);
        setGmailConnected(false);
        setGmailEmail(undefined);
        setCsrfToken(undefined);
        setSubscription(undefined);
        setIsMasterUser(false);
        clearManualAuth();
        await supabase.auth.signOut({ scope: 'global' });
      },
      refreshSession,
    }),
    [isAuthenticated, isLoading, profileReady, gmailConnected, gmailEmail, csrfToken, subscription, isMasterUser, appUserProfile, refreshSession, clearManualAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
