'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useUsuarioAdmin } from '@/hooks/useUsuarios';
import { useAcessosUsuario, useModulosDisponiveis, useCreateAcesso, useUpdateAcesso, useDeleteAcesso } from '@/hooks/useUsuarioAcesso';

export default function UsuarioDetalhe() {
  const params = useParams();
  const id = params.id as string;

  const { data: usuario, isLoading: userLoading } = useUsuarioAdmin(id);
  const { data: acessos, isLoading: acessosLoading } = useAcessosUsuario(id);
  const { data: disponiveis, isLoading: dispLoading } = useModulosDisponiveis(id);
  const createMutation = useCreateAcesso(id);
  const updateMutation = useUpdateAcesso(id);
  const deleteMutation = useDeleteAcesso(id);

  const [selectedModulo, setSelectedModulo] = useState('');
  const [expiraEm, setExpiraEm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editExpiraEm, setEditExpiraEm] = useState('');

  const handleGrant = async () => {
    if (!selectedModulo) return;
    await createMutation.mutateAsync({
      modulo_id: selectedModulo,
      expira_em: expiraEm || null,
    });
    setSelectedModulo('');
    setExpiraEm('');
  };

  const handleUpdateExpiration = async (acessoId: string) => {
    await updateMutation.mutateAsync({
      acessoId,
      data: { expira_em: editExpiraEm || null },
    });
    setEditingId(null);
    setEditExpiraEm('');
  };

  if (userLoading) return <p className="text-gray-500">Carregando...</p>;
  if (!usuario) return <p className="text-red-500">Usuário não encontrado.</p>;

  const formatDate = (d: string | null) => {
    if (!d) return '-';
    return new Date(d).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div>
      <Link href="/admin/usuarios" className="text-sm text-blue-600 hover:underline">&larr; Voltar</Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mt-4 mb-8">
        <h2 className="text-2xl font-bold mb-4">{usuario.nome}</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-500">Email:</span> <span className="font-medium">{usuario.email}</span></div>
          <div><span className="text-gray-500">Telefone:</span> <span className="font-medium">{usuario.telefone || '-'}</span></div>
          <div><span className="text-gray-500">Função:</span> <span className="font-medium">{usuario.role}</span></div>
          <div><span className="text-gray-500">Ativo:</span> <span className="font-medium">{usuario.ativo ? 'Sim' : 'Não'}</span></div>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-4">Módulos com Acesso</h3>

      {acessosLoading && <p className="text-gray-500">Carregando acessos...</p>}

      {acessos && acessos.length === 0 && (
        <p className="text-gray-500 mb-6">Este usuário não possui acesso a nenhum módulo.</p>
      )}

      {acessos && acessos.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Módulo</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Início</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Expira</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Origem</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody>
              {acessos.map((acesso) => (
                <tr key={acesso.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{acesso.modulo_titulo}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatDate(acesso.iniciado_em)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {editingId === acesso.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="datetime-local"
                          value={editExpiraEm}
                          onChange={(e) => setEditExpiraEm(e.target.value)}
                          className="w-44 px-2 py-1 border border-gray-300 rounded text-xs"
                        />
                        <button
                          onClick={() => handleUpdateExpiration(acesso.id)}
                          className="text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded"
                        >
                          Salvar
                        </button>
                        <button
                          onClick={() => { setEditingId(null); setEditExpiraEm(''); }}
                          className="text-xs text-gray-500 hover:text-gray-700"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <span>{formatDate(acesso.expira_em)}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      acesso.status === 'ativo' ? 'bg-green-100 text-green-700' :
                      acesso.status === 'expirado' ? 'bg-red-100 text-red-700' :
                      acesso.status === 'cancelado' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {acesso.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{acesso.origem_acesso}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingId(acesso.id);
                          setEditExpiraEm(acesso.expira_em ? acesso.expira_em.slice(0, 16) : '');
                        }}
                        className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        Editar Expiração
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Remover acesso a este módulo?')) {
                            deleteMutation.mutate(acesso.id);
                          }
                        }}
                        className="px-3 py-1.5 text-xs bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                      >
                        Remover
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h3 className="text-xl font-bold mb-4">Liberar Acesso a Módulo</h3>

      {dispLoading && <p className="text-gray-500">Carregando módulos disponíveis...</p>}

      {disponiveis && disponiveis.length === 0 && (
        <p className="text-gray-500">Todos os módulos já foram liberados para este usuário.</p>
      )}

      {disponiveis && disponiveis.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-lg">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Módulo</label>
              <select
                value={selectedModulo}
                onChange={(e) => {
                  setSelectedModulo(e.target.value);
                  const mod = disponiveis.find((m) => m.id === e.target.value);
                  if (mod?.duracao_acesso_dias) {
                    const d = new Date();
                    d.setDate(d.getDate() + mod.duracao_acesso_dias);
                    setExpiraEm(d.toISOString().slice(0, 16));
                  } else {
                    setExpiraEm('');
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">Selecione um módulo</option>
                {disponiveis.map((mod) => (
                  <option key={mod.id} value={mod.id}>
                    {mod.titulo} {mod.duracao_acesso_dias ? `(${mod.duracao_acesso_dias} dias)` : '(vitalício)'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expira em (opcional)</label>
              <input
                type="datetime-local"
                value={expiraEm}
                onChange={(e) => setExpiraEm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <p className="text-xs text-gray-400 mt-1">Preenchido automaticamente com a duração do módulo. Pode editar.</p>
            </div>

            <button
              onClick={handleGrant}
              disabled={!selectedModulo || createMutation.isPending}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm transition-colors"
            >
              {createMutation.isPending ? 'Liberando...' : 'Liberar Acesso'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
