'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { HiMenu, HiX } from 'react-icons/hi';

export function Navbar() {
  const { user, isLoading } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace('#', '');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 200);
    }
  }, [pathname]);

  const handleScrollLink = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const hashIndex = href.indexOf('#');
    if (hashIndex === -1) return;

    const id = href.slice(hashIndex + 1);
    const basePath = href.slice(0, hashIndex) || '/';

    if (pathname === basePath) {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMenuOpen(false);
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/#modulos', label: 'Módulos' },
    { href: '/#sobre', label: 'Sobre' },
  ];

  return (
    <nav className="bg-[#050505] border-b border-[#D4AF37]/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.preta.jpeg"
            alt="Logo"
            width={40}
            height={40}
            className="rounded-lg object-cover"
          />
          <span className="text-lg font-bold text-[#D4AF37] hidden sm:inline">
            Caxueirada 
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(e) => handleScrollLink(e, link.href)}
              className="text-sm text-neutral-400 hover:text-[#D4AF37] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {isLoading ? null : user ? (
            <div className="hidden md:flex items-center gap-4">
              <span className="text-sm text-neutral-400">{user.nome}</span>
              <Link
                href={user.role === 'admin' ? '/admin' : '/home'}
                className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#B87333] hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] text-white rounded-lg text-sm font-semibold transition-all"
              >
                Meu Painel
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden md:inline-block px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#B87333] hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] text-white rounded-lg text-sm font-semibold transition-all"
            >
              Entrar
            </Link>
          )}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-[#D4AF37] hover:text-[#B87333] transition-colors"
            aria-label="Abrir menu"
          >
            {menuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#0a0a0a] border-t border-[#D4AF37]/10 px-4 py-4 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(e) => { handleScrollLink(e, link.href); setMenuOpen(false); }}
              className="block text-sm text-neutral-400 hover:text-[#D4AF37] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <hr className="border-[#D4AF37]/10" />
          {user ? (
            <>
              <span className="block text-sm text-neutral-500">{user.nome}</span>
              <Link
                href={user.role === 'admin' ? '/admin' : '/home'}
                onClick={() => setMenuOpen(false)}
                className="block text-center px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#B87333] text-white rounded-lg text-sm font-semibold"
              >
                Meu Painel
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="block text-center px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#B87333] text-white rounded-lg text-sm font-semibold"
            >
              Entrar
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
