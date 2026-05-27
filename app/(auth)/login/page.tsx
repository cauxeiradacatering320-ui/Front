'use client';

import { useState } from 'react';
import { apiRequest } from '@/services/api';
import { useAuthStore, type User } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { setAuthCookies } from '@/lib/cookies';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await apiRequest<{ user: User; accessToken: string }>('/auth/login', 'POST', { email, senha });

      setAuth(data.user, data.accessToken);
      setAuthCookies(data.user);

      if (data.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/home');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] relative">
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-neutral-400 hover:text-[#D4AF37] transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Voltar ao Início
      </Link>

      <div className="max-w-md w-full p-8 bg-[#0a0a0a] rounded-xl shadow-[0_0_50px_rgba(212,175,55,0.05)] border border-[#D4AF37]/20">
        <h2 className="text-3xl font-bold text-center text-[#D4AF37] mb-8">Login EAD</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-900/20 text-red-400 rounded-md text-sm border border-red-900/30">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-2 bg-[#111] border border-[#D4AF37]/20 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all text-white placeholder-neutral-500 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-2 bg-[#111] border border-[#D4AF37]/20 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all text-white placeholder-neutral-500 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B87333] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-md disabled:cursor-not-allowed"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-neutral-400">
          Não tem uma conta? <Link href="/register" className="text-[#D4AF37] hover:underline font-medium">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}
