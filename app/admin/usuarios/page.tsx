'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useUsuariosAdmin, useCreateUsuario, useUpdateUsuario, useToggleUsuarioActive, useDeleteUsuario } from '@/hooks/useUsuarios';
import type { CreateUsuarioData, UpdateUsuarioData } from '@/services/usuario';

interface UsuarioForm {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  role: 'produtor' | 'aluno';
}

const initialForm: UsuarioForm = {
  nome: '',
  email: '',
  senha: '',
  telefone: '',
  role: 'aluno',
};

export default function AdminUsuarios() {
  const { data: usuarios, isLoading, error } = useUsuariosAdmin();
  const createMutation = useCreateUsuario();
  const updateMutation = useUpdateUsuario();
  const toggleActiveMutation = useToggleUsuarioActive();
  const deleteMutation = useDeleteUsuario();

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState<'none' | 'create' | 'edit'>('none');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<UsuarioForm>(initialForm);
  const [formError, setFormError] = useState('');

  const filtered = usuarios?.filter((u) =>
    u.role === 'aluno' && (
      u.nome.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.telefone && u.telefone.includes(search))
    )
  );

  const openCreate = () => {
    setForm(initialForm);
    setEditingId(null);
    setFormError('');
    setModalOpen('create');
  };

  const openEdit = (id: string) => {
    const u = usuarios?.find((x) => x.id === id);
    if (!u) return;
    setForm({ nome: u.nome, email: u.email, senha: '', telefone: u.telefone || '', role: 'aluno' });
    setEditingId(id);
    setFormError('');
    setModalOpen('edit');
  };

  const closeModal = () => {
    setModalOpen('none');
    setForm(initialForm);
    setEditingId(null);
    setFormError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!form.nome.trim() || !form.email.trim()) {
      setFormError('Nome e email são obrigatórios');
      return;
    }

    try {
      if (modalOpen === 'create') {
        if (!form.senha) {
          setFormError('Senha é obrigatória');
          return;
        }
        const data: CreateUsuarioData = {
          nome: form.nome.trim(),
          email: form.email.trim(),
          senha: form.senha,
          telefone: form.telefone.trim() || undefined,
          role: form.role,
        };
        await createMutation.mutateAsync(data);
      } else if (modalOpen === 'edit' && editingId) {
        const data: UpdateUsuarioData = {
          nome: form.nome.trim(),
          email: form.email.trim(),
          telefone: form.telefone.trim() || null,
          role: form.role,
          ativo: true,
        };
        await updateMutation.mutateAsync({ id: editingId, data });
      }
      closeModal();
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  const roleBadge = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-purple-100 text-purple-700',
      produtor: 'bg-blue-100 text-blue-700',
      aluno: 'bg-gray-100 text-gray-700',
    };
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[role] || colors.aluno}`}>
        {role}
      </span>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Gerenciar Usuários</h2>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
        >
          Adicionar Usuário
        </button>
      </div>

      {isLoading && <p className="text-gray-500">Carregando...</p>}

      {error && (
        <p className="text-red-500">Erro ao carregar usuários: {error.message}</p>
      )}

      {usuarios && usuarios.length > 0 && (
        <input
          type="text"
          placeholder="Buscar por nome, email ou telefone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      )}

      {usuarios && usuarios.length === 0 && (
        <p className="text-gray-500">Nenhum usuário encontrado.</p>
      )}

      {filtered && filtered.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Nome</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Email</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Telefone</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Função</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Ativo</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((usuario) => (
                <tr key={usuario.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium">
                    <Link href={`/admin/usuarios/${usuario.id}`} className="text-blue-600 hover:underline">
                      {usuario.nome}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{usuario.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{usuario.telefone || '-'}</td>
                  <td className="px-4 py-3">{roleBadge(usuario.role)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {usuario.ativo ? 'Sim' : 'Não'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(usuario.id)}
                        className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => toggleActiveMutation.mutate(usuario.id)}
                        className={`px-3 py-1.5 text-xs rounded-lg transition-colors text-white ${
                          usuario.ativo ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'
                        }`}
                      >
                        {usuario.ativo ? 'Desativar' : 'Ativar'}
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Tem certeza que deseja excluir ${usuario.nome}?`)) {
                            deleteMutation.mutate(usuario.id);
                          }
                        }}
                        className="px-3 py-1.5 text-xs bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filtered && filtered.length === 0 && usuarios && usuarios.length > 0 && (
        <p className="text-gray-500 mt-4">Nenhum resultado encontrado para &quot;{search}&quot;.</p>
      )}

      {modalOpen !== 'none' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-8 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold mb-6">
              {modalOpen === 'create' ? 'Adicionar Usuário' : 'Editar Usuário'}
            </h3>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm border border-red-100">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <input
                  type="text"
                  value={form.telefone}
                  onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                  placeholder="(xx) xxxx-xxxx"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              {modalOpen === 'create' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                  <input
                    type="password"
                    value={form.senha}
                    onChange={(e) => setForm({ ...form, senha: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Função</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value as UsuarioForm['role'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="aluno">Aluno</option>
                  <option value="produtor">Produtor</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm transition-colors"
                >
                  {modalOpen === 'create' ? 'Adicionar' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
