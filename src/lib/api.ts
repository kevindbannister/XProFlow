type ApiOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
};

const request = async <T>(endpoint: string, options: ApiOptions = {}): Promise<T> => {
  const response = await fetch(endpoint, {
    method: options.method || 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
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

  return response.json() as Promise<T>;
};

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, body?: unknown, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: 'POST', body, headers })
};
