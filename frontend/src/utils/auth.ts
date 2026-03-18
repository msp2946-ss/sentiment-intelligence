const TOKEN_KEY = 'sentiai_token';

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function getApiBaseUrl(): string {
  const envBase = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '';
  return String(envBase).replace(/\/$/, '');
}

export function buildApiUrl(path: string): string {
  const base = getApiBaseUrl();
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

export function withAuthHeaders(headers: HeadersInit = {}): HeadersInit {
  const token = getAuthToken();
  if (!token) {
    return headers;
  }

  return {
    ...headers,
    Authorization: `Bearer ${token}`,
  };
}
