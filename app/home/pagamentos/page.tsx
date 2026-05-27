'use client';

import { useMinhasCompras } from '@/hooks/useCompra';

const statusConfig: Record<string, { label: string; class: string }> = {
  aprovado: { label: 'Aprovado', class: 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20' },
  pendente: { label: 'Pendente', class: 'bg-yellow-900/20 text-yellow-400 border border-yellow-900/30' },
  recusado: { label: 'Recusado', class: 'bg-red-900/20 text-red-400 border border-red-900/30' },
  reembolsado: { label: 'Reembolsado', class: 'bg-neutral-800 text-neutral-400 border border-neutral-700' },
};

export default function Pagamentos() {
  const { data: compras, isLoading, error } = useMinhasCompras();

  const formatKz = (v: number) => `${(v / 100).toFixed(2)} Kz`;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">Meus Pagamentos</h1>

      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="bg-[#0a0a0a] border border-red-900/30 rounded-xl p-6">
          <p className="text-red-400">Erro: {error.message}</p>
        </div>
      )}

      {compras && compras.length === 0 && (
        <div className="bg-[#0a0a0a] border border-[#D4AF37]/20 rounded-2xl p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-neutral-600 mb-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <p className="text-neutral-400">Nenhum pagamento registrado.</p>
        </div>
      )}

      {compras && compras.length > 0 && (
        <div className="space-y-4">
          {compras.map((compra) => (
            <div key={compra.id} className="bg-[#0a0a0a] border border-[#D4AF37]/10 rounded-2xl overflow-hidden transition-all hover:border-[#D4AF37]/20">
              {/* Header */}
              <div className="px-6 py-4 border-b border-[#D4AF37]/10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neutral-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-neutral-400">
                    {new Date(compra.criado_em).toLocaleDateString('pt-PT', {
                      day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
                    })}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusConfig[compra.status]?.class || 'bg-neutral-800 text-neutral-400 border border-neutral-700'}`}>
                    {statusConfig[compra.status]?.label || compra.status}
                  </span>
                </div>
                <span className="text-xs text-neutral-500">
                  {compra.provider === 'manual' ? 'Manual' : compra.provider}
                </span>
              </div>

              {/* Items */}
              <div className="px-6 py-2 divide-y divide-[#D4AF37]/5">
                {compra.itens.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {item.modulo_thumbnail ? (
                        <img src={item.modulo_thumbnail} alt="" className="w-10 h-8 rounded object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-8 rounded bg-neutral-800 flex items-center justify-center flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neutral-600" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                          </svg>
                        </div>
                      )}
                      <span className="text-sm text-neutral-300 truncate">{item.modulo_titulo}</span>
                    </div>
                    <span className="text-sm font-medium text-white flex-shrink-0">{formatKz(item.preco_pago_centavos)}</span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="px-6 py-3 bg-[#111] border-t border-[#D4AF37]/10 flex items-center justify-between">
                <span className="text-sm font-semibold text-neutral-300">Total</span>
                <span className="text-lg font-bold text-[#D4AF37]">{formatKz(compra.valor_pago_centavos)}</span>
              </div>

              {/* Approval */}
              {compra.aprovado_em && (
                <div className="px-6 py-2 bg-[#D4AF37]/5 text-xs text-[#D4AF37]/70 border-t border-[#D4AF37]/10">
                  Aprovado em {new Date(compra.aprovado_em).toLocaleDateString('pt-PT', {
                    day: '2-digit', month: 'long', year: 'numeric',
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
