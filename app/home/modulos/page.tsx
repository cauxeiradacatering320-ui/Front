'use client';

import Link from 'next/link';
import { useMeusModulos, useRecomendados } from '@/hooks/useMeusModulos';

export default function StudentModulos() {
  const { data: meusModulos, isLoading, error } = useMeusModulos();
  const { data: recomendados, isLoading: recLoading } = useRecomendados();

  const formatDate = (d: string | null) => {
    if (!d) return 'Vitalício';
    return `Expira: ${new Date(d).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Meus Módulos</h2>

      {isLoading && <p className="text-gray-500">Carregando...</p>}

      {error && (
        <p className="text-red-500">Erro ao carregar módulos: {error.message}</p>
      )}

      {meusModulos && meusModulos.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <p className="text-gray-500">Você ainda não possui módulos adquiridos.</p>
        </div>
      )}

      {meusModulos && meusModulos.length > 0 && (
        <div className="grid gap-4 mb-12">
          {meusModulos.map((mod) => (
            <Link
              key={mod.acesso_id}
              href={`/home/modulos/${mod.id}`}
              className="block bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                {mod.thumbnail_url && (
                  <img
                    src={mod.thumbnail_url}
                    alt={mod.titulo}
                    className="w-24 h-16 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg truncate">{mod.titulo}</h3>
                  <p className="text-sm text-gray-500 truncate mt-1">
                    {mod.descricao || 'Sem descrição'}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-gray-400">
                      {mod.expira_em ? formatDate(mod.expira_em) : 'Acesso vitalício'}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      mod.acesso_status === 'ativo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {mod.acesso_status}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {recomendados && recomendados.length > 0 && (
        <>
          <h3 className="text-xl font-bold mb-4">Compre também...</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recomendados.map((mod) => (
              <Link
                key={mod.id}
                href={`/modulos/${mod.id}`}
                className="block bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
              >
                {mod.thumbnail_url && (
                  <img
                    src={mod.thumbnail_url}
                    alt={mod.titulo}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                )}
                <h4 className="font-semibold truncate">{mod.titulo}</h4>
                <p className="text-sm text-gray-500 truncate mt-1">
                  {mod.descricao || 'Sem descrição'}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm font-bold text-blue-600">
                    {mod.gratuito ? 'Grátis' : `${(mod.preco_centavos / 100).toFixed(2)} Kz`}
                  </span>
                  <span className="text-xs text-gray-400">
                    {mod.duracao_acesso_dias ? `${mod.duracao_acesso_dias} dias` : 'Vitalício'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {!recLoading && recomendados && recomendados.length === 0 && meusModulos && meusModulos.length > 0 && (
        <p className="text-gray-400 text-sm">Todos os módulos disponíveis já estão liberados para si.</p>
      )}
    </div>
  );
}
