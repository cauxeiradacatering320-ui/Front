'use client';

import { useMinhasCompras } from '@/hooks/useCompra';

export default function Pagamentos() {
  const { data: compras, isLoading, error } = useMinhasCompras();

  const formatKz = (v: number) => `${(v / 100).toFixed(2)} Kz`;

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      aprovado: 'bg-green-100 text-green-700',
      pendente: 'bg-yellow-100 text-yellow-700',
      recusado: 'bg-red-100 text-red-700',
      reembolsado: 'bg-gray-100 text-gray-700',
    };
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[status] || 'bg-gray-100 text-gray-700'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Meus Pagamentos</h2>

      {isLoading && <p className="text-gray-500">Carregando...</p>}
      {error && <p className="text-red-500">Erro: {error.message}</p>}

      {compras && compras.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-500">Nenhum pagamento registrado.</p>
        </div>
      )}

      {compras && compras.length > 0 && (
        <div className="space-y-4">
          {compras.map((compra) => (
            <div key={compra.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">
                    {new Date(compra.criado_em).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {statusBadge(compra.status)}
                </div>
                <span className="text-sm text-gray-400">
                  {compra.provider === 'manual' ? 'Manual' : compra.provider}
                </span>
              </div>

              <div className="px-6 py-3 divide-y divide-gray-50">
                {compra.itens.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      {item.modulo_thumbnail && (
                        <img src={item.modulo_thumbnail} alt="" className="w-10 h-8 rounded object-cover" />
                      )}
                      <span className="text-sm text-gray-900">{item.modulo_titulo}</span>
                    </div>
                    <span className="text-sm font-medium">{formatKz(item.preco_pago_centavos)}</span>
                  </div>
                ))}
              </div>

              <div className="px-6 py-3 bg-gray-50 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Total</span>
                <span className="text-lg font-bold text-blue-600">{formatKz(compra.valor_pago_centavos)}</span>
              </div>

              {compra.aprovado_em && (
                <div className="px-6 py-2 bg-green-50 text-xs text-green-700">
                  Aprovado em {new Date(compra.aprovado_em).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
