'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import { verifySession } from '@/services/api';
import { useRouter } from 'next/navigation';

export function useSessionValidation() {
  const { user, isLoading, setAuth, clearAuth } = useAuthStore();
  const router = useRouter();
  const validated = useRef(false);

  useEffect(() => {
    if (isLoading || !user || validated.current) return;

    validated.current = true;

    verifySession().then((result) => {
      if (!result.valid) {
        clearAuth();
        router.push('/login');
      } else if (result.user) {
        setAuth(
          { id: result.user.id, nome: result.user.nome, email: result.user.email, role: result.user.role as 'admin' | 'produtor' | 'aluno' },
          useAuthStore.getState().accessToken || ''
        );
      }
    });
  }, [isLoading, user, router, setAuth, clearAuth]);
}
