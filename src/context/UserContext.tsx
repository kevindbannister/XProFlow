import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

type UserProfile = {
  name: string;
  email: string;
  avatarUrl?: string;
};

type UserContextValue = {
  user: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateAvatar: (avatarUrl: string) => void;
};

const defaultUser: UserProfile = {
  name: 'Kevin Bannister',
  email: 'kevin.bannister@xproflow.com'
};

const USER_STORAGE_KEY = 'emailai-user-profile';

const getSessionUserProfile = (session: Session | null): UserProfile | null => {
  if (!session?.user) {
    return null;
  }

  const metadata = session.user.user_metadata ?? {};
  const email = session.user.email ?? defaultUser.email;
  const name =
    metadata.full_name ||
    metadata.name ||
    metadata.preferred_username ||
    email.split('@')[0] ||
    defaultUser.name;
  const avatarUrl = metadata.avatar_url || metadata.picture || undefined;

  return { name, email, avatarUrl };
};

const getStoredUser = () => {
  if (typeof window === 'undefined') {
    return defaultUser;
  }

  const raw = window.localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) {
    return defaultUser;
  }

  try {
    return { ...defaultUser, ...(JSON.parse(raw) as UserProfile) };
  } catch {
    return defaultUser;
  }
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile>(() => getStoredUser());

  useEffect(() => {
    let isMounted = true;

    const loadSessionUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (!isMounted) {
        return;
      }
      const sessionProfile = getSessionUserProfile(data.session);
      if (sessionProfile) {
        setUser((current) => ({ ...current, ...sessionProfile }));
      }
    };

    void loadSessionUser();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionProfile = getSessionUserProfile(session);
      if (sessionProfile) {
        setUser((current) => ({ ...current, ...sessionProfile }));
      } else {
        setUser(getStoredUser());
      }
    });

    return () => {
      isMounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    }
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      updateProfile: (updates: Partial<UserProfile>) => {
        setUser((current) => ({ ...current, ...updates }));
      },
      updateAvatar: (avatarUrl: string) => {
        setUser((current) => ({ ...current, avatarUrl }));
      }
    }),
    [user]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};

export const getUserInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};
