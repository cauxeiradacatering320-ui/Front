'use client';

import { useState } from 'react';
import { usePagamentos } from '@/hooks/usePagamentos';
import { formatPriceMask } from '@/utils/format';
import type { PagamentoFiltros } from '@/services/pagamento';

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pendente: { label: 'Pendente', color: 'bg-yellow-900/30 text-yellow-400 border border-yellow-900/30' },
  aprovado: { label: 'Aprovado', color: 'bg-green-900/30 text-green-400 border border-green-900/30' },
  recusado: { label: 'Recusado', color: 'bg-red-900/30 text-red-400 border border-red-900/30' },
  reembolsado: { label: 'Reembolsado', color: 'bg-neutral-800 text-neutral-400 border border-neutral-700' },
};

export default function AdminPagamentos() {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [cliente, setCliente] = useState('');
  const [filtros, setFiltros] = useState<PagamentoFiltros | undefined>();

  const { data, isLoading, error } = usePagamentos(filtros);

  const handleFiltrar = () => {
    const f: PagamentoFiltros = {};
    if (dataInicio) f.dataInicio = dataInicio;
    if (dataFim) f.dataFim = dataFim;
    if (cliente.trim()) f.cliente = cliente.trim();
    setFiltros(f);
  };

  const handleLimpar = () => {
    setDataInicio('');
    setDataFim('');
    setCliente('');
    setFiltros(undefined);
  };

  return (
    <div className="space-y-6">
      {/* Header + Filtros */}
      <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Pagamentos</h2>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">Data Início</label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#050505] border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/30 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">Data Fim</label>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#050505] border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/30 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">Cliente</label>
            <input
              type="text"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              placeholder="Nome ou email..."
              className="w-full px-4 py-2.5 bg-[#050505] border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/30 transition-all"
            />
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={handleFiltrar}
              className="px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B87333] text-black font-semibold rounded-lg text-sm hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-all"
            >
              Filtrar
            </button>
            <button
              onClick={handleLimpar}
              className="px-5 py-2.5 border border-neutral-700 text-neutral-400 rounded-lg text-sm hover:bg-neutral-800 transition-all"
            >
              Limpar
            </button>
          </div>
        </div>

        {data && (
          <div className="flex items-center gap-6 text-sm pt-2 border-t border-neutral-800">
            <span className="text-neutral-400">
              <strong className="text-white">{data.total}</strong> pagamentos encontrados
            </span>
            <span className="text-lg font-bold text-[#D4AF37]">
              Total: {formatPriceMask(String(data.totalCentavos))}
            </span>
          </div>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-[#0a0a0a] border border-red-900/30 rounded-xl p-6">
          <p className="text-red-400">Erro ao carregar pagamentos.</p>
        </div>
      )}

      {/* Empty state */}
      {data && data.pagamentos.length === 0 && (
        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-neutral-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-neutral-500">Nenhum pagamento encontrado.</p>
        </div>
      )}

      {/* Tabela */}
      {data && data.pagamentos.length > 0 && (
        <div className="bg-[#0a0a0a] border border-[#D4AF37]/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#D4AF37]/10 bg-[#111]">
                  <th className="text-left px-4 py-3.5 text-sm font-semibold text-neutral-400">Cliente</th>
                  <th className="text-left px-4 py-3.5 text-sm font-semibold text-neutral-400">Email</th>
                  <th className="text-left px-4 py-3.5 text-sm font-semibold text-neutral-400">Data</th>
                  <th className="text-left px-4 py-3.5 text-sm font-semibold text-neutral-400">Valor</th>
                  <th className="text-left px-4 py-3.5 text-sm font-semibold text-neutral-400">Status</th>
                  <th className="text-left px-4 py-3.5 text-sm font-semibold text-neutral-400">Provider</th>
                  <th className="text-left px-4 py-3.5 text-sm font-semibold text-neutral-400">Módulos</th>
                </tr>
              </thead>
              <tbody>
                {data.pagamentos.map((p) => {
                  const st = STATUS_MAP[p.status] ?? { label: p.status, color: 'bg-neutral-800 text-neutral-400 border border-neutral-700' };
                  return (
                    <tr key={p.id} className="border-b border-[#D4AF37]/5 hover:bg-[#111] transition-colors">
                      <td className="px-4 py-3.5 text-sm font-medium text-white">{p.cliente_nome}</td>
                      <td className="px-4 py-3.5 text-sm text-neutral-400">{p.cliente_email}</td>
                      <td className="px-4 py-3.5 text-sm text-neutral-400 whitespace-nowrap">
                        {new Date(p.criado_em).toLocaleDateString('pt-PT')}
                      </td>
                      <td className="px-4 py-3.5 text-sm font-medium text-[#D4AF37]">
                        {formatPriceMask(String(p.valor_pago_centavos))}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${st.color}`}>
                          {st.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-neutral-400 capitalize">{p.provider}</td>
                      <td className="px-4 py-3.5 text-sm text-neutral-500 max-w-xs truncate">{p.modulos}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
