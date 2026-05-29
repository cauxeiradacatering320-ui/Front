'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import { API_BASE } from '@/services/api';
import { useRouter } from 'next/navigation';
import { setAuthCookies, clearAuthCookies } from '@/lib/cookies';

export function useSessionValidation() {
  const { user, isLoading, accessToken, clearAuth } = useAuthStore();
  const router = useRouter();
  const validated = useRef(false);

  useEffect(() => {
    if (isLoading || !user || !accessToken || validated.current) return;

    validated.current = true;

    fetch(`${API_BASE}/auth/session/verify`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Sessão inválida');
        setAuthCookies(user);
      })
      .catch(() => {
        clearAuth();
        clearAuthCookies();
        localStorage.removeItem('auth-storage');
        router.push('/login');
      });
  }, [isLoading, user, accessToken, router, clearAuth]);
}
