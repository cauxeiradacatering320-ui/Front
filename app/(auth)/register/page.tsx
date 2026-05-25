'use client';

import { useState } from 'react';
import { apiRequest } from '@/services/api';
import { useAuthStore, type User } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { setAuthCookies } from '@/lib/cookies';

export default function RegisterPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await apiRequest<{ user: User; accessToken: string }>('/auth/register', 'POST', { nome, email, senha });

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Cadastro EAD</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Seu Nome"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              minLength={6}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-md disabled:cursor-not-allowed"
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-gray-600">
          Já possui conta? <Link href="/login" className="text-blue-600 hover:underline font-medium">Faça Login</Link>
        </p>
      </div>
    </div>
  );
}
