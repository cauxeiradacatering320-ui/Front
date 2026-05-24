'use client';

import { useState } from 'react';
import { usePagamentos } from '@/hooks/usePagamentos';
import { formatKz } from '@/utils/format';
import type { PagamentoFiltros } from '@/services/pagamento';

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pendente: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-700' },
  aprovado: { label: 'Aprovado', color: 'bg-green-100 text-green-700' },
  recusado: { label: 'Recusado', color: 'bg-red-100 text-red-700' },
  reembolsado: { label: 'Reembolsado', color: 'bg-gray-100 text-gray-700' },
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold mb-4">Pagamentos</h2>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Início</label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Fim</label>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
            <input
              type="text"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              placeholder="Nome ou email..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={handleFiltrar}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
            >
              Filtrar
            </button>
            <button
              onClick={handleLimpar}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors"
            >
              Limpar
            </button>
          </div>
        </div>

        {data && (
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <span>
              <strong className="text-gray-900">{data.total}</strong> pagamentos encontrados
            </span>
            <span className="text-lg font-bold text-green-700">
              Total: {formatKz(data.totalCentavos)}
            </span>
          </div>
        )}
      </div>

      {isLoading && <p className="text-gray-500">Carregando pagamentos...</p>}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
          Erro ao carregar pagamentos.
        </div>
      )}

      {data && data.pagamentos.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-500">
          Nenhum pagamento encontrado.
        </div>
      )}

      {data && data.pagamentos.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-600">Cliente</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Data</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Valor</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Provider</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Módulos</th>
              </tr>
            </thead>
            <tbody>
              {data.pagamentos.map((p) => {
                const st = STATUS_MAP[p.status] ?? { label: p.status, color: 'bg-gray-100 text-gray-700' };
                return (
                  <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{p.cliente_nome}</td>
                    <td className="px-4 py-3 text-gray-600">{p.cliente_email}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {new Date(p.criado_em).toLocaleDateString('pt-PT')}
                    </td>
                    <td className="px-4 py-3 font-medium">{formatKz(p.valor_pago_centavos)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${st.color}`}>
                        {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 capitalize">{p.provider}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{p.modulos}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
