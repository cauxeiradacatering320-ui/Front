'use client';

import Link from 'next/link';
import { useModulosPublic } from '@/hooks/useModulos';
import {formatPriceMask } from '@/utils/format';

export default function ModulosPage() {
  const { data: modulos, isLoading, error } = useModulosPublic();

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-2">Todos os Módulos</h1>
      <p className="text-gray-600 mb-8">Conheça nossos módulos disponíveis.</p>

      {isLoading && <p className="text-gray-500">Carregando...</p>}

      {error && (
        <p className="text-red-500">Erro ao carregar módulos: {error.message}</p>
      )}

      {modulos && modulos.length === 0 && (
        <p className="text-gray-500">Nenhum módulo disponível no momento.</p>
      )}

      {modulos && modulos.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modulos.map((modulo) => (
            <Link
              key={modulo.id}
              href={`/modulos/${modulo.id}`}
              className="block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {modulo.thumbnail_url ? (
                <img
                  src={modulo.thumbnail_url}
                  alt={modulo.titulo}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                  Sem imagem
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{modulo.titulo}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                  {modulo.descricao || 'Sem descrição'}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">
                    {modulo.gratuito ? 'Grátis' : `${formatPriceMask(String(modulo.preco_centavos))}KZ`}
                  </span>
                  {modulo.duracao_acesso_dias && (
                    <span className="text-xs text-gray-400">{modulo.duracao_acesso_dias} dias</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
