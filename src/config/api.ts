const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const configuredInternalApiKey = import.meta.env.VITE_INTERNAL_API_KEY;

export const apiBaseUrl = configuredApiBaseUrl
  ? configuredApiBaseUrl.replace(/\/$/, '')
  : import.meta.env.PROD
    ? 'https://api.xproflow.com'
    : '';

export const internalApiKey = configuredInternalApiKey || '';
