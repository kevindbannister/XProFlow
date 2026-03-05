import { supabase } from './supabaseClient';
import { apiBaseUrl, internalApiKey } from '../config/api';

type ApiOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
};

const buildInternalApiHeaders = (): Record<string, string> => {
  if (!internalApiKey) {
    return {};
  }

  return {
    'x-internal-api-key': internalApiKey
  };
};

const request = async <T>(endpoint: string, options: ApiOptions = {}): Promise<T> => {
  const isAbsoluteUrl = /^https?:\/\//i.test(endpoint);
  const normalizedEndpoint = isAbsoluteUrl
    ? endpoint
    : `${apiBaseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const { data } = await supabase.auth.getSession();
  const accessToken = data.session?.access_token;
  const isMasterSession = typeof window !== 'undefined' && window.localStorage.getItem('xproflow-manual-auth') === 'true';

  const response = await fetch(normalizedEndpoint, {
    method: options.method || 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(isMasterSession ? { 'x-master-session': 'true' } : {}),
      ...buildInternalApiHeaders(),
      ...(options.headers || {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const bodyPreview = (await response.text()).slice(0, 120).replace(/\s+/g, ' ').trim();
    throw new Error(`Expected JSON response but received ${contentType || 'unknown content type'}: ${bodyPreview}`);
  }

  return response.json() as Promise<T>;
};

export const api = {
  get: <T>(endpoint: string, headers?: Record<string, string>) => request<T>(endpoint, { headers }),
  post: <T>(endpoint: string, body?: unknown, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: 'POST', body, headers }),
  put: <T>(endpoint: string, body?: unknown, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: 'PUT', body, headers }),
  patch: <T>(endpoint: string, body?: unknown, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: 'PATCH', body, headers })
};
