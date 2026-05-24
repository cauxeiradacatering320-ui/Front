import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  nome: string;
  email: string;
  telefone?: string | null;
  role: 'admin' | 'produtor' | 'aluno';
  ativo?: boolean;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  setAuth: (user: User, accessToken: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isLoading: true,
      setAuth: (user, accessToken) => set({ user, accessToken, isLoading: false }),
      clearAuth: () => set({ user: null, accessToken: null, isLoading: false }),
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
      }),
      onRehydrateStorage: () => {
        return (state) => {
          if (state) {
            state.setLoading(false);
          }
        };
      },
    }
  )
);
