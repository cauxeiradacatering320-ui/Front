'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

export function Navbar() {
  const { user, isLoading } = useAuthStore();

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold text-gray-800">
            Plataforma EAD
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Home
            </Link>
            <Link href="/modulos" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Módulos
            </Link>
            <Link href="/sobre" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Sobre
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isLoading ? null : user ? (
            <>
              <span className="text-sm text-gray-600 hidden sm:inline">{user.nome}</span>
              <Link
                href={user.role === 'admin' ? '/admin' : '/home'}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
              >
                Meu Painel
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
