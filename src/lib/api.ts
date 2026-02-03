export const api = {
  get: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    return response.json() as Promise<T>;
  }
};
