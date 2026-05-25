'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { API_BASE, refreshToken } from '../services/api';
import { setAuthCookies } from '@/lib/cookies';

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

async function verifySession(token: string): Promise<boolean> {
  try {
    const resp = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return resp.ok;
  } catch {
    return false;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { clearAuth, setLoading } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      const { accessToken, user } = useAuthStore.getState();

      if (accessToken) {
        if (!isTokenExpired(accessToken)) {
          const valid = await verifySession(accessToken);
          if (valid) {
            if (user) setAuthCookies(user);
            setLoading(false);
            return;
          }
          clearAuth();
          setLoading(false);
          return;
        }

        const success = await refreshToken();
        if (success) {
          setLoading(false);
          return;
        }
        clearAuth();
        setLoading(false);
        return;
      }

      const success = await refreshToken();
      if (!success) {
        clearAuth();
      }
      setLoading(false);
    };

    initAuth();
  }, [clearAuth, setLoading]);

  return <>{children}</>;
}
