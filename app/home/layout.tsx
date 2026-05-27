'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { apiRequest } from '@/services/api';
import { useSessionValidation } from '@/hooks/useSessionValidation';
import { clearAuthCookies } from '@/lib/cookies';
import { DashboardSidebar, defaultStudentLinks } from '@/components/DashboardSidebar';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, clearAuth } = useAuthStore();
  const router = useRouter();

  useSessionValidation();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  const handleLogout = async () => {
    try {
      await apiRequest('/auth/logout', 'POST');
    } catch {

    }
    clearAuth();
    clearAuthCookies();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#242323] flex">
      <DashboardSidebar
        links={defaultStudentLinks}
        userNome={user.nome}
        userRole={user.role}
        onLogout={handleLogout}
      />
      <main className="flex-1 min-w-0 p-4 md:p-8 pt-16 md:pt-8">
        {children}
      </main>
    </div>
  );
}
