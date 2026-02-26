const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const apiBaseUrl = configuredApiBaseUrl
  ? configuredApiBaseUrl.replace(/\/$/, '')
  : import.meta.env.PROD
    ? 'https://api.xproflow.com'
    : '';
