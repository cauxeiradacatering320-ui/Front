'use client';

import { useAuthStore } from '@/store/authStore';

export default function StudentConfig() {
  const { user } = useAuthStore();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <h2 className="text-2xl font-bold mb-4">Configurações do Perfil</h2>

      <div className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
          <input
            type="text"
            defaultValue={user?.nome}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
            disabled
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            defaultValue={user?.email}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
            disabled
          />
        </div>
        <p className="text-sm text-gray-400 mt-2">Em breve você poderá editar suas informações.</p>
      </div>
    </div>
  );
}
