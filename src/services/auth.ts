export type AuthSession = {
  username: string;
  loggedInAt: string;
};

const MASTER_USERNAME = 'master';
const MASTER_PASSWORD = 'master';
const SESSION_KEY = 'emailai.session';

export const authenticate = (username: string, password: string): AuthSession | null => {
  if (username === MASTER_USERNAME && password === MASTER_PASSWORD) {
    return {
      username,
      loggedInAt: new Date().toISOString(),
    };
  }

  return null;
};

export const getStoredSession = (): AuthSession | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawSession = window.localStorage.getItem(SESSION_KEY);
  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(rawSession) as AuthSession;
  } catch {
    return null;
  }
};

export const storeSession = (session: AuthSession): void => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const clearSession = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(SESSION_KEY);
};
