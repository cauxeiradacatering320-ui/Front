import { useAuthStore } from '../store/authStore';

export const API_BASE = process.env.NEXT_PUBLIC_API_NEXT_BACKEND || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api';

const AUTH_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/refresh'];

export async function apiRequest<T>(
  url: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET",
  body?: unknown,
  token?: string,
  options?: {
    revalidate?: number;
    cache?: RequestCache;
  }
): Promise<T> {
  const headers: Record<string, string> = {};

  if (body) {
    headers["Content-Type"] = "application/json";
  }

  const accessToken = token || useAuthStore.getState().accessToken;

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  let resp = await fetch(
    `${API_BASE}${url}`,
    {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include',
      cache: options?.cache,
      next: options?.revalidate ? { revalidate: options.revalidate } : undefined,
    }
  );

  if (resp.status === 401 && !AUTH_ENDPOINTS.includes(url)) {
    const refreshed = await refreshToken();

    if (refreshed) {
      const newToken = useAuthStore.getState().accessToken;
      if (newToken) {
        headers["Authorization"] = `Bearer ${newToken}`;
      }

      resp = await fetch(`${API_BASE}${url}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        credentials: 'include',
        cache: options?.cache,
        next: options?.revalidate ? { revalidate: options.revalidate } : undefined,
      });
    } else {
      useAuthStore.getState().clearAuth();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error("Sessão expirada. Faça login novamente.");
    }
  }

  const data = await resp.json();

  if (!resp.ok) {
    throw new Error(data.message || "Erro inesperado.");
  }

  return data;
}

export async function refreshToken() {
  try {
    const response = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    useAuthStore.getState().setAuth(data.user, data.accessToken);
    return true;
  } catch {
    return false;
  }
}
