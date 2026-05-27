'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useUsuarioAdmin } from '@/hooks/useUsuarios';
import { useAcessosUsuario, useModulosDisponiveis, useCreateAcesso, useUpdateAcesso, useDeleteAcesso } from '@/hooks/useUsuarioAcesso';
import { useCriarCompraManual } from '@/hooks/useCompra';
import { formatPriceMask } from '@/utils/format';


export default function UsuarioDetalhe() {
  const params = useParams();
  const id = params.id as string;

  const { data: usuario, isLoading: userLoading } = useUsuarioAdmin(id);
  const { data: acessos, isLoading: acessosLoading } = useAcessosUsuario(id);
  const { data: disponiveis, isLoading: dispLoading } = useModulosDisponiveis(id);
  const createMutation = useCreateAcesso(id);
  const updateMutation = useUpdateAcesso(id);
  const deleteMutation = useDeleteAcesso(id);
  const compraManualMutation = useCriarCompraManual(id);

  const [selectedModulo, setSelectedModulo] = useState('');
  const [expiraEm, setExpiraEm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editExpiraEm, setEditExpiraEm] = useState('');

  const [selectedCompra, setSelectedCompra] = useState<Record<string, number>>({});
  const [compraError, setCompraError] = useState('');

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

  const handleCompraManual = async () => {
    setCompraError('');
    const itens = Object.entries(selectedCompra).filter(([_, p]) => p > 0);
    if (itens.length === 0) {
      setCompraError('Selecione pelo menos um módulo com valor válido');
      return;
    }
    try {
      await compraManualMutation.mutateAsync(
        itens.map(([modulo_id, preco_centavos]) => ({ modulo_id, preco_centavos }))
      );
      setSelectedCompra({});
    } catch (err: any) {
      setCompraError(err.message);
    }
  };

  const toggleItemCompra = (moduloId: string, precoSugerido: number) => {
    setSelectedCompra((prev) => {
      if (prev[moduloId]) {
        const next = { ...prev };
        delete next[moduloId];
        return next;
      }
      return { ...prev, [moduloId]: precoSugerido };
    });
  };

  const updatePreco = (moduloId: string, valor: string) => {
    const centavos = Math.round(parseFloat(valor.replace(',', '.')) * 100);
    if (isNaN(centavos) || centavos < 0) return;
    setSelectedCompra((prev) => ({ ...prev, [moduloId]: centavos }));
  };

  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="bg-[#0a0a0a] border border-[#D4AF37]/20 rounded-2xl p-8 text-center">
        <p className="text-neutral-400">Usuário não encontrado.</p>
      </div>
    );
  }

  const formatDate = (d: string | null) => {
    if (!d) return '-';
    return new Date(d).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/usuarios" className="text-sm text-[#D4AF37] hover:text-[#B87333] transition-colors">
          &larr; Voltar
        </Link>
        <h1 className="text-2xl font-bold text-white">{usuario.nome}</h1>
      </div>

      {/* User Info Card */}
      <div className="bg-[#0a0a0a] border border-[#D4AF37]/20 rounded-2xl p-6">
        <div className="grid grid-cols-2 gap-6 text-sm">
          <div>
            <span className="text-xs uppercase tracking-wider text-neutral-500 block mb-0.5">Email</span>
            <span className="font-medium text-white">{usuario.email}</span>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-neutral-500 block mb-0.5">Telefone</span>
            <span className="font-medium text-white">{usuario.telefone || '-'}</span>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-neutral-500 block mb-0.5">Função</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20">
              {usuario.role}
            </span>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-neutral-500 block mb-0.5">Ativo</span>
            <span className={`flex items-center gap-1.5 ${usuario.ativo ? 'text-[#D4AF37]' : 'text-neutral-500'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${usuario.ativo ? 'bg-[#D4AF37]' : 'bg-neutral-600'}`} />
              {usuario.ativo ? 'Sim' : 'Não'}
            </span>
          </div>
        </div>
      </div>

      {/* Acessos Section */}
      <section className="space-y-6">
        <h3 className="text-xl font-bold text-white">Módulos com Acesso</h3>

        {acessosLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
          </div>
        )}

        {acessos && acessos.length === 0 && (
          <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-neutral-700 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="text-neutral-500 text-sm">Este usuário não possui acesso a nenhum módulo.</p>
          </div>
        )}

        {acessos && acessos.length > 0 && (
          <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-800 bg-[#111]">
                    <th className="text-left px-4 py-3.5 text-sm font-semibold text-neutral-400">Módulo</th>
                    <th className="text-left px-4 py-3.5 text-sm font-semibold text-neutral-400">Início</th>
                    <th className="text-left px-4 py-3.5 text-sm font-semibold text-neutral-400">Expira</th>
                    <th className="text-left px-4 py-3.5 text-sm font-semibold text-neutral-400">Status</th>
                    <th className="text-left px-4 py-3.5 text-sm font-semibold text-neutral-400">Origem</th>
                    <th className="text-right px-4 py-3.5 text-sm font-semibold text-neutral-400">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {acessos.map((acesso) => (
                    <tr key={acesso.id} className="border-b border-neutral-800/50 hover:bg-[#111] transition-colors">
                      <td className="px-4 py-3.5 text-sm font-medium text-white">{acesso.modulo_titulo}</td>
                      <td className="px-4 py-3.5 text-sm text-neutral-400">{formatDate(acesso.iniciado_em)}</td>
                      <td className="px-4 py-3.5 text-sm text-neutral-400">
                        {editingId === acesso.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="datetime-local"
                              value={editExpiraEm}
                              onChange={(e) => setEditExpiraEm(e.target.value)}
                              className="w-44 px-2 py-1 bg-[#050505] border border-neutral-700 rounded text-xs text-white focus:outline-none focus:border-[#D4AF37]/50"
                            />
                            <button onClick={() => handleUpdateExpiration(acesso.id)} className="text-xs bg-green-700 hover:bg-green-600 text-white px-2 py-1 rounded transition-colors">Salvar</button>
                            <button onClick={() => { setEditingId(null); setEditExpiraEm(''); }} className="text-xs text-neutral-500 hover:text-white transition-colors">Cancelar</button>
                          </div>
                        ) : (
                          <span>{formatDate(acesso.expira_em)}</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          acesso.status === 'ativo' ? 'bg-green-900/30 text-green-400 border border-green-900/30' :
                          acesso.status === 'expirado' ? 'bg-red-900/30 text-red-400 border border-red-900/30' :
                          acesso.status === 'cancelado' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-900/30' :
                          'bg-neutral-800 text-neutral-400 border border-neutral-700'
                        }`}>{acesso.status}</span>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-neutral-400">{acesso.origem_acesso}</td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => { setEditingId(acesso.id); setEditExpiraEm(acesso.expira_em ? acesso.expira_em.slice(0, 16) : ''); }} className="px-3 py-1.5 text-xs bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 rounded-lg hover:bg-[#D4AF37]/20 transition-all">Editar Expiração</button>
                          <button onClick={() => { if (window.confirm('Remover acesso a este módulo?')) deleteMutation.mutate(acesso.id); }} className="px-3 py-1.5 text-xs bg-red-900/40 text-red-400 border border-red-900/30 rounded-lg hover:bg-red-800/50 transition-all">Remover</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* Liberar Acesso & Compra Manual */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Liberar Acesso (grátis)</h3>
          {dispLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
            </div>
          )}
          {disponiveis && disponiveis.length === 0 && (
            <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-6 text-center">
              <p className="text-neutral-500 text-sm">Todos os módulos já foram liberados.</p>
            </div>
          )}
          {disponiveis && disponiveis.length > 0 && (
            <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Módulo</label>
                <select value={selectedModulo} onChange={(e) => { setSelectedModulo(e.target.value); const mod = disponiveis.find((m) => m.id === e.target.value); if (mod?.duracao_acesso_dias) { const d = new Date(); d.setDate(d.getDate() + mod.duracao_acesso_dias); setExpiraEm(d.toISOString().slice(0, 16)); } else setExpiraEm(''); }} className="w-full px-4 py-2.5 bg-[#050505] border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/30 transition-all">
                  <option value="">Selecione</option>
                  {disponiveis.map((mod) => (<option key={mod.id} value={mod.id}>{mod.titulo} {mod.duracao_acesso_dias ? `(${mod.duracao_acesso_dias} dias)` : '(vitalício)'}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Expira em</label>
                <input type="datetime-local" value={expiraEm} onChange={(e) => setExpiraEm(e.target.value)} className="w-full px-4 py-2.5 bg-[#050505] border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/30 transition-all" />
              </div>
              <button onClick={handleGrant} disabled={!selectedModulo || createMutation.isPending} className="px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B87333] text-black font-semibold rounded-lg text-sm hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {createMutation.isPending ? 'Liberando...' : 'Liberar Acesso'}
              </button>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-xl font-bold text-white mb-4">Compra Manual</h3>
          {dispLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
            </div>
          )}
          {disponiveis && disponiveis.length === 0 && (
            <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-6 text-center">
              <p className="text-neutral-500 text-sm">Nenhum módulo disponível para compra.</p>
            </div>
          )}
          {disponiveis && disponiveis.length > 0 && (
            <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-6">
              {compraError && (
                <div className="mb-4 p-3 bg-red-900/20 border border-red-900/30 text-red-400 rounded-lg text-sm">
                  {compraError}
                </div>
              )}
              <div className="space-y-3 max-h-72 overflow-y-auto">
                {disponiveis.map((mod) => {
                  const selected = selectedCompra[mod.id] !== undefined;
                  return (
                    <div key={mod.id} className={`p-3 rounded-xl border transition-colors ${selected ? 'border-[#D4AF37]/40 bg-[#D4AF37]/5' : 'border-neutral-800 hover:border-neutral-700'}`}>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" checked={selected} onChange={() => toggleItemCompra(mod.id, mod.preco_centavos)} className="mt-1 rounded border-neutral-700 bg-[#050505] text-[#D4AF37] focus:ring-[#D4AF37]/30" />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium text-white block truncate">{mod.titulo}</span>
                          <span className="text-xs text-neutral-500">{mod.duracao_acesso_dias ? `${mod.duracao_acesso_dias} dias` : 'Vitalício'}</span>
                        </div>
                      </label>
                      {selected && (
                        <div className="mt-2 ml-7">
                          <label className="text-xs text-neutral-500 block mb-1">Valor (Kz)</label>
                          <input type="text" value={formatPriceMask(String(selectedCompra[mod.id]))} onChange={(e) => updatePreco(mod.id, e.target.value)} className="w-full px-3 py-1.5 bg-[#050505] border border-neutral-800 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4AF37]/50" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-neutral-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-neutral-300">Total</span>
                  <span className="text-lg font-bold text-[#D4AF37]">{formatPriceMask(String(Object.values(selectedCompra).reduce((a, b) => a + b, 0)))}</span>
                </div>
                <button onClick={handleCompraManual} disabled={Object.keys(selectedCompra).length === 0 || compraManualMutation.isPending} className="w-full px-4 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B87333] text-black font-semibold rounded-lg text-sm hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  {compraManualMutation.isPending ? 'Processando...' : 'Finalizar Compra Manual'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
