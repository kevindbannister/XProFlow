import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api } from '../lib/api';
import { useAuth } from './AuthContext';

export type FeatureFlags = {
  dashboard: boolean;
  inbox: boolean;
  labels: boolean;
  rules: boolean;
  drafting: boolean;
  writingStyle: boolean;
  signatureTimeZone: boolean;
  professionalContext: boolean;
  account: boolean;
  help: boolean;
};

type FeatureFlagsContextValue = {
  flags: FeatureFlags;
  isLoading: boolean;
  refreshFlags: () => Promise<void>;
  updateFlags: (nextFlags: FeatureFlags) => Promise<void>;
};

const FEATURE_FLAGS_STORAGE_KEY = 'xproflow.feature-flags';

const defaultFlags: FeatureFlags = {
  dashboard: true,
  inbox: true,
  labels: true,
  rules: true,
  drafting: true,
  writingStyle: true,
  signatureTimeZone: true,
  professionalContext: true,
  account: true,
  help: true,
};

const getStoredFlags = (): FeatureFlags => {
  if (typeof window === 'undefined') {
    return defaultFlags;
  }

  try {
    const rawValue = window.localStorage.getItem(FEATURE_FLAGS_STORAGE_KEY);
    if (!rawValue) {
      return defaultFlags;
    }

    const parsed = JSON.parse(rawValue) as Partial<FeatureFlags>;
    return { ...defaultFlags, ...parsed };
  } catch {
    return defaultFlags;
  }
};

const persistFlags = (nextFlags: FeatureFlags) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(FEATURE_FLAGS_STORAGE_KEY, JSON.stringify(nextFlags));
};

const FeatureFlagsContext = createContext<FeatureFlagsContextValue | undefined>(undefined);

export const FeatureFlagsProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [flags, setFlags] = useState<FeatureFlags>(getStoredFlags);
  const [isLoading, setIsLoading] = useState(true);

  const refreshFlags = useCallback(async () => {
    if (!isAuthenticated) {
      setFlags(getStoredFlags());
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await api.get<{ flags: FeatureFlags }>('/api/feature-flags');
      const normalizedFlags = { ...defaultFlags, ...data.flags };
      setFlags(normalizedFlags);
      persistFlags(normalizedFlags);
    } catch {
      setFlags((currentFlags) => ({ ...defaultFlags, ...currentFlags }));
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    void refreshFlags();
  }, [refreshFlags]);

  const value = useMemo(
    () => ({
      flags,
      isLoading,
      refreshFlags,
      updateFlags: async (nextFlags: FeatureFlags) => {
        const previousFlags = flags;
        const normalizedFlags = { ...defaultFlags, ...nextFlags };
        setFlags(normalizedFlags);
        persistFlags(normalizedFlags);

        try {
          const data = await api.put<{ flags: FeatureFlags }>('/api/feature-flags', { flags: normalizedFlags });
          const serverFlags = { ...defaultFlags, ...data.flags };
          setFlags(serverFlags);
          persistFlags(serverFlags);
        } catch {
          setFlags(previousFlags);
          persistFlags(previousFlags);
          throw new Error('Failed to save feature settings. Please try again.');
        }
      },
    }),
    [flags, isLoading, refreshFlags]
  );

  return <FeatureFlagsContext.Provider value={value}>{children}</FeatureFlagsContext.Provider>;
};

export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagsContext);
  if (!context) {
    throw new Error('useFeatureFlags must be used within FeatureFlagsProvider');
  }
  return context;
};
