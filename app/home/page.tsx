'use client';

import { useAuthStore } from '@/store/authStore';

export default function StudentDashboard() {
  const { user } = useAuthStore();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <h2 className="text-2xl font-bold mb-4">Bem-vindo, {user?.nome}!</h2>
      <p className="text-gray-600">
        Você está logado como <strong>{user?.role}</strong>.
      </p>
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-sm text-blue-700">
          <strong>Email:</strong> {user?.email}
        </p>
      </div>
    </div>
  );
}
