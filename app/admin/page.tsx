'use client';

import { useAuthStore } from '@/store/authStore';

export default function AdminDashboard() {
  const { user } = useAuthStore();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <p className="text-gray-600">
        Bem-vindo ao painel administrativo, <strong>{user?.nome}</strong>.
      </p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
          <p className="text-sm text-indigo-700 font-medium">Total de Usuários</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg border border-green-100">
          <p className="text-sm text-green-700 font-medium">Cursos</p>
        </div>
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
          <p className="text-sm text-amber-700 font-medium">Vendas</p>
        </div>
      </div>
    </div>
  );
}
