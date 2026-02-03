import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type AuthContextValue = {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
};

const AUTH_STORAGE_KEY = 'emailai-authenticated';

const getStoredAuth = () => {
  if (typeof window === 'undefined') {
    return true;
  }
  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (raw === null) {
    return true;
  }
  return raw === 'true';
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => getStoredAuth());

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(AUTH_STORAGE_KEY, String(isAuthenticated));
    }
  }, [isAuthenticated]);

  const value = useMemo(
    () => ({
      isAuthenticated,
      login: () => setIsAuthenticated(true),
      logout: () => setIsAuthenticated(false)
    }),
    [isAuthenticated]
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
