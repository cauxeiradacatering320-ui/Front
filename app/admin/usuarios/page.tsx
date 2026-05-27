'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useUsuariosAdmin, useCreateUsuario, useUpdateUsuario, useToggleUsuarioActive, useDeleteUsuario } from '@/hooks/useUsuarios';
import type { CreateUsuarioData, UpdateUsuarioData } from '@/services/usuario';
import { mascaraTelefone } from '@/utils/format';

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

const roleStyles: Record<string, string> = {
  admin: 'bg-purple-900/20 text-purple-400 border border-purple-900/30',
  produtor: 'bg-blue-900/20 text-blue-400 border border-blue-900/30',
  aluno: 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20',
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

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Gerenciar Usuários</h1>
        <button
          onClick={openCreate}
          className="px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B87333] text-black font-semibold rounded-lg text-sm hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-all"
        >
          + Adicionar Usuário
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="bg-[#0a0a0a] border border-red-900/30 rounded-xl p-6">
          <p className="text-red-400">Erro ao carregar usuários: {error.message}</p>
        </div>
      )}

      {usuarios && usuarios.length > 0 && (
        <div className="relative mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por nome, email ou telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0a0a0a] border border-[#D4AF37]/20 rounded-lg text-white placeholder-neutral-500 focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none text-sm"
          />
        </div>
      )}

      {usuarios && usuarios.length === 0 && (
        <div className="bg-[#0a0a0a] border border-[#D4AF37]/20 rounded-2xl p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-neutral-600 mb-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
          <p className="text-neutral-400">Nenhum usuário encontrado.</p>
        </div>
      )}

      {filtered && filtered.length > 0 && (
        <div className="bg-[#0a0a0a] border border-[#D4AF37]/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#D4AF37]/10 bg-[#111]">
                  <th className="text-left px-4 py-3.5 text-sm font-semibold text-neutral-400">Nome</th>
                  <th className="text-left px-4 py-3.5 text-sm font-semibold text-neutral-400">Email</th>
                  <th className="text-left px-4 py-3.5 text-sm font-semibold text-neutral-400">Telefone</th>
                  <th className="text-left px-4 py-3.5 text-sm font-semibold text-neutral-400">Função</th>
                  <th className="text-left px-4 py-3.5 text-sm font-semibold text-neutral-400">Ativo</th>
                  <th className="text-right px-4 py-3.5 text-sm font-semibold text-neutral-400">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((usuario) => (
                  <tr key={usuario.id} className="border-b border-[#D4AF37]/5 hover:bg-[#111] transition-colors">
                    <td className="px-4 py-3.5 text-sm font-medium">
                      <Link href={`/admin/usuarios/${usuario.id}`} className="text-white hover:text-[#D4AF37] transition-colors">
                        {usuario.nome}
                      </Link>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-neutral-400">{usuario.email}</td>
                    <td className="px-4 py-3.5 text-sm text-neutral-400">{mascaraTelefone((usuario.telefone) || '-')}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleStyles[usuario.role] || roleStyles.aluno}`}>
                        {usuario.role}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm">
                      <span className={`flex items-center gap-1.5 ${usuario.ativo ? 'text-[#D4AF37]' : 'text-neutral-500'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${usuario.ativo ? 'bg-[#D4AF37]' : 'bg-neutral-600'}`} />
                        {usuario.ativo ? 'Sim' : 'Não'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(usuario.id)}
                          className="px-3 py-1.5 text-xs bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 rounded-lg hover:bg-[#D4AF37]/20 transition-all"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => toggleActiveMutation.mutate(usuario.id)}
                          className={`px-3 py-1.5 text-xs rounded-lg transition-all text-white ${
                            usuario.ativo
                              ? 'bg-yellow-700/60 hover:bg-yellow-600/80'
                              : 'bg-green-700/60 hover:bg-green-600/80'
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
                          className="px-3 py-1.5 text-xs bg-red-900/40 text-red-400 border border-red-900/30 rounded-lg hover:bg-red-800/50 transition-all"
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
        </div>
      )}

      {filtered && filtered.length === 0 && usuarios && usuarios.length > 0 && (
        <p className="text-neutral-500 mt-4 text-sm">Nenhum resultado encontrado para &quot;{search}&quot;.</p>
      )}

      {modalOpen !== 'none' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0a0a] border border-[#D4AF37]/20 rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-6">
              {modalOpen === 'create' ? 'Adicionar Usuário' : 'Editar Usuário'}
            </h3>

            {formError && (
              <div className="mb-4 p-3 bg-red-900/20 text-red-400 rounded-lg text-sm border border-red-900/30">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Nome</label>
                <input
                  type="text"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="w-full px-3 py-2 bg-[#111] border border-[#D4AF37]/20 rounded-lg text-white placeholder-neutral-500 focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 bg-[#111] border border-[#D4AF37]/20 rounded-lg text-white placeholder-neutral-500 focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Telefone</label>
                <input
                  type="text"
                  value={mascaraTelefone(form.telefone)}
                  onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                  placeholder="(xx) xxxx-xxxx"
                  className="w-full px-3 py-2 bg-[#111] border border-[#D4AF37]/20 rounded-lg text-white placeholder-neutral-500 focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
                />
              </div>

              {modalOpen === 'create' && (
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Senha</label>
                  <input
                    type="password"
                    value={form.senha}
                    onChange={(e) => setForm({ ...form, senha: e.target.value })}
                    className="w-full px-3 py-2 bg-[#111] border border-[#D4AF37]/20 rounded-lg text-white placeholder-neutral-500 focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Função</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value as UsuarioForm['role'] })}
                  className="w-full px-3 py-2 bg-[#111] border border-[#D4AF37]/20 rounded-lg text-white focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
                >
                  <option value="aluno">Aluno</option>
                  <option value="produtor">Produtor</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#B87333] text-black font-semibold rounded-lg text-sm hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] disabled:opacity-50 transition-all"
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
