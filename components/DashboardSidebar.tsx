'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { HiMenu, HiX, HiChevronLeft, HiChevronRight } from 'react-icons/hi';

interface SidebarLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface DashboardSidebarProps {
  links: SidebarLink[];
  userNome: string;
  userRole: string;
  onLogout: () => void;
  admin?: boolean;
}

const defaultAdminLinks: SidebarLink[] = [
  { href: '/admin', label: 'Dashboard', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" /></svg> },
  { href: '/admin/usuarios', label: 'Usuários', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /></svg> },
  { href: '/admin/modulos', label: 'Módulos', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" /></svg> },
  { href: '/admin/pagamentos', label: 'Pagamentos', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg> },
  { href: '/admin/configuracoes', label: 'Configurações', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg> },
];

const defaultStudentLinks: SidebarLink[] = [
  { href: '/home', label: 'Dashboard', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg> },
  { href: '/home/modulos', label: 'Meus Módulos', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" /></svg> },
  { href: '/home/certificados', label: 'Certificados', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg> },
  { href: '/home/pagamentos', label: 'Pagamentos', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg> },
  { href: '/home/configuracoes', label: 'Configurações', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg> },
];

export function DashboardSidebar({ links, userNome, userRole, onLogout, admin }: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === (admin ? '/admin' : '/home')) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-30 md:hidden bg-[#050505] border border-[#D4AF37]/20 text-[#D4AF37] p-2 rounded-lg hover:bg-[#111] transition-colors"
        aria-label="Abrir menu"
      >
        <HiMenu size={24} />
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 z-50 h-screen
          bg-[#050505] border-r border-[#D4AF37]/10
          flex flex-col
          transition-all duration-300 ease-in-out
          ${collapsed ? 'w-16' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-[#D4AF37]/10">
          {!collapsed && (
            <Link href={admin ? '/admin' : '/home'} className="flex items-center gap-3 min-w-0">
              <Image
                src="/logo.preta.jpeg"
                alt="Logo"
                width={32}
                height={32}
                className="rounded-lg object-cover flex-shrink-0"
              />
              <span className="text-sm font-bold text-[#D4AF37] truncate">
                {admin ? 'Admin' : 'Caxueirada'}
              </span>
            </Link>
          )}
          {collapsed && (
            <Link href={admin ? '/admin' : '/home'} className="mx-auto">
              <Image
                src="/logo.preta.jpeg"
                alt="Logo"
                width={32}
                height={32}
                className="rounded-lg object-cover flex-shrink-0"
              />
            </Link>
          )}
          <button
            onClick={() => { setCollapsed(!collapsed); setMobileOpen(false); }}
            className="text-neutral-500 hover:text-[#D4AF37] transition-colors flex-shrink-0 hidden md:block"
            aria-label={collapsed ? 'Expandir' : 'Recolher'}
          >
            {collapsed ? <HiChevronRight size={20} /> : <HiChevronLeft size={20} />}
          </button>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-neutral-500 hover:text-[#D4AF37] transition-colors md:hidden"
            aria-label="Fechar menu"
          >
            <HiX size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                ${isActive(link.href)
                  ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20'
                  : 'text-neutral-400 hover:bg-[#0a0a0a] hover:text-neutral-200 border border-transparent'
                }
                ${collapsed ? 'justify-center' : ''}
              `}
              title={collapsed ? link.label : undefined}
            >
              <span className="flex-shrink-0">{link.icon}</span>
              {!collapsed && <span className="text-sm truncate">{link.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-[#D4AF37]/10 p-4">
          {!collapsed && (
            <div className="mb-3 px-1">
              <p className="text-sm text-neutral-400 truncate">{userNome}</p>
              <p className="text-xs text-neutral-600 truncate capitalize">{userRole}</p>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-lg text-neutral-400 hover:bg-[#0a0a0a] hover:text-neutral-200 transition-all text-sm
                ${collapsed ? 'justify-center' : ''}
              `}
              title={collapsed ? 'Ver Site' : undefined}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              {!collapsed && <span>Ver Site</span>}
            </Link>
            <button
              onClick={onLogout}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-lg text-neutral-400 hover:bg-red-900/20 hover:text-red-400 transition-all text-sm w-full
                ${collapsed ? 'justify-center' : ''}
              `}
              title={collapsed ? 'Sair' : undefined}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm7 8a1 1 0 01-1 1H7v2a1 1 0 11-2 0v-2H3a1 1 0 110-2h2V7a1 1 0 112 0v2h2a1 1 0 011 1z" clipRule="evenodd" />
              </svg>
              {!collapsed && <span>Sair</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export { defaultAdminLinks, defaultStudentLinks };
