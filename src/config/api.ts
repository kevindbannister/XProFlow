const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const globalProcessEnv = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;
const configuredInternalApiKey = globalProcessEnv?.NEXT_PUBLIC_INTERNAL_API_KEY || import.meta.env.VITE_INTERNAL_API_KEY;

export const apiBaseUrl = configuredApiBaseUrl
  ? configuredApiBaseUrl.replace(/\/$/, '')
  : import.meta.env.PROD
    ? 'https://api.xproflow.com'
    : '';

export const internalApiKey = configuredInternalApiKey || '';
