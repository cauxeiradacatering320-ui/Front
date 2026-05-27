'use client';

import Link from 'next/link';
import { useModulosAdmin } from '@/hooks/useModulos';
import { formatPriceMask } from '@/utils/format';
import { useState } from 'react';

const statusStyles: Record<string, string> = {
  publicado: 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20',
  rascunho: 'bg-yellow-900/20 text-yellow-400 border border-yellow-900/30',
  arquivado: 'bg-neutral-800 text-neutral-400 border border-neutral-700',
};

export default function AdminModulos() {
  const { data: modulos, isLoading, error } = useModulosAdmin();
  const [status, setStatus] = useState('todos');

  const moduloFiltred = modulos?.filter((modulo) =>
    status === 'todos' ? true : modulo.status === status
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Gerenciar Módulos</h1>
        <Link
          href="/admin/modulos/novo"
          className="px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B87333] text-black font-semibold rounded-lg text-sm hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-all"
        >
          + Criar Módulo
        </Link>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="bg-[#0a0a0a] border border-red-900/30 rounded-xl p-6">
          <p className="text-red-400">Erro ao carregar módulos: {error.message}</p>
        </div>
      )}

      {modulos && modulos.length === 0 && (
        <div className="bg-[#0a0a0a] border border-[#D4AF37]/20 rounded-2xl p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-neutral-600 mb-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
          </svg>
          <p className="text-neutral-400">Nenhum módulo encontrado.</p>
        </div>
      )}

      {modulos && modulos.length > 0 && (
        <div className="mb-6">
          <select
            onChange={(e) => setStatus(e.target.value)}
            value={status}
            className="bg-[#0a0a0a] border border-[#D4AF37]/20 text-neutral-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
          >
            <option value="todos">Todos</option>
            <option value="publicado">Publicado</option>
            <option value="rascunho">Rascunho</option>
            <option value="arquivado">Arquivados</option>
          </select>
        </div>
      )}

      {modulos && modulos.length > 0 && (
        <div className="grid gap-4">
          {moduloFiltred!.map((modulo) => (
            <Link
              key={modulo.id}
              href={`/admin/modulos/${modulo.id}`}
              className="bg-[#0a0a0a] border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 rounded-xl p-5 transition-all group"
            >
              <div className="flex items-start gap-4">
                {modulo.thumbnail_url ? (
                  <div className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={modulo.thumbnail_url}
                      alt={modulo.titulo}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-16 rounded-lg bg-neutral-800 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neutral-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                    </svg>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-white truncate group-hover:text-[#D4AF37] transition-colors">
                    {modulo.titulo}
                  </h3>
                  <p className="text-sm text-neutral-500 truncate mt-1">
                    {modulo.descricao || 'Sem descrição'}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyles[modulo.status] || 'bg-neutral-800 text-neutral-400'}`}>
                      {modulo.status}
                    </span>
                    {modulo.carga_horaria && (
                      <span className="text-xs text-neutral-600">{modulo.carga_horaria}h</span>
                    )}
                    <span className="text-sm text-[#D4AF37]">
                      {modulo.gratuito ? 'Grátis' : `${formatPriceMask(String(modulo.preco_centavos))}KZ`}
                    </span>
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-600 group-hover:text-[#D4AF37] transition-colors flex-shrink-0 self-center" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
