'use client';

import { use } from 'react';
import Link from 'next/link';
import { useModuloPublic } from '@/hooks/useModulos';
import { formatKz } from '@/utils/format';

export default function ModuloDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: modulo, isLoading, error } = useModuloPublic(id);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <p className="text-red-500">Erro: {error.message}</p>
        <Link href="/modulos" className="text-blue-600 hover:underline mt-4 inline-block">
          &larr; Ver todos os módulos
        </Link>
      </div>
    );
  }

  if (!modulo) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <p className="text-gray-500">Módulo não encontrado.</p>
        <Link href="/modulos" className="text-blue-600 hover:underline mt-4 inline-block">
          &larr; Ver todos os módulos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <Link href="/modulos" className="text-sm text-blue-600 hover:underline mb-6 inline-block">
        &larr; Ver todos os módulos
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {modulo.thumbnail_url ? (
          <img
            src={modulo.thumbnail_url}
            alt={modulo.titulo}
            className="w-full h-64 object-cover"
          />
        ) : (
          <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-400">
            Sem imagem
          </div>
        )}

        <div className="p-8">
          <h1 className="text-3xl font-bold mb-4">{modulo.titulo}</h1>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-2xl font-bold text-blue-600">
              {modulo.gratuito ? 'Grátis' : formatKz(modulo.preco_centavos)}
            </span>
            {modulo.duracao_acesso_dias && (
              <span className="text-sm text-gray-500">
                Acesso por {modulo.duracao_acesso_dias} dias
              </span>
            )}
            {!modulo.duracao_acesso_dias && (
              <span className="text-sm text-gray-500">Acesso vitalício</span>
            )}
          </div>

          <div className="prose prose-sm max-w-none mb-8">
            <p className="text-gray-700 whitespace-pre-wrap">
              {modulo.descricao || 'Sem descrição disponível.'}
            </p>
          </div>

          <button
            disabled
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg opacity-60 cursor-not-allowed"
          >
            Comprar (em breve)
          </button>
        </div>
      </div>
    </div>
  );
}
