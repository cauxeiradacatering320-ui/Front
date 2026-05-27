'use client';

import Link from 'next/link';
import { useMeusModulos, useRecomendados } from '@/hooks/useMeusModulos';
import { formatPriceMask } from '@/utils/format';

export default function StudentModulos() {
  const { data: meusModulos, isLoading, error } = useMeusModulos();
  const { data: recomendados, isLoading: recLoading } = useRecomendados();

  const formatDate = (d: string | null) => {
    if (!d) return 'Vitalício';
    return `Expira: ${new Date(d).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">Meus Módulos</h1>

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

      {meusModulos && meusModulos.length === 0 && (
        <div className="bg-[#0a0a0a] border border-[#D4AF37]/20 rounded-2xl p-8 text-center">
          <p className="text-neutral-400">Você ainda não possui módulos adquiridos.</p>
        </div>
      )}

      {meusModulos && meusModulos.length > 0 && (
        <div className="grid gap-3 mb-12">
          {meusModulos.map((mod) => (
            <Link
              key={mod.acesso_id}
              href={`/home/modulos/${mod.id}`}
              className="bg-[#0a0a0a] border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 rounded-xl p-4 transition-all group"
            >
              <div className="flex items-start gap-3">
                {mod.thumbnail_url ? (
                  <div className="w-16 sm:w-24 h-12 sm:h-16 rounded-lg overflow-hidden flex-shrink-0 mt-0.5">
                    <img
                      src={mod.thumbnail_url}
                      alt={mod.titulo}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 sm:w-24 h-12 sm:h-16 rounded-lg bg-neutral-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 sm:h-6 w-5 sm:w-6 text-neutral-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                    </svg>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm sm:text-lg text-white truncate group-hover:text-[#D4AF37] transition-colors">
                    {mod.titulo}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-500 line-clamp-1 sm:line-clamp-2 mt-0.5">
                    {mod.descricao || 'Sem descrição'}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1.5">
                    <span className="text-[10px] sm:text-xs text-neutral-500">
                      {mod.expira_em ? formatDate(mod.expira_em) : 'Acesso vitalício'}
                    </span>
                    {mod.carga_horaria ? (
                      <span className="text-[10px] sm:text-xs text-neutral-500">
                        {mod.carga_horaria}h
                      </span>
                    ) : null}
                    <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-medium ${
                      mod.acesso_status === 'ativo'
                        ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20'
                        : 'bg-red-900/20 text-red-400 border border-red-900/30'
                    }`}>
                      {mod.acesso_status}
                    </span>
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-neutral-600 group-hover:text-[#D4AF37] transition-colors flex-shrink-0 self-center" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}

      {recomendados && recomendados.length > 0 && (
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-white mb-4">Compre também</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recomendados.map((mod) => (
              <Link
                key={mod.id}
                href={`/modulos/${mod.id}`}
                className="bg-[#0a0a0a] border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 rounded-xl overflow-hidden transition-all group"
              >
                {mod.thumbnail_url ? (
                  <div className="w-full h-36 overflow-hidden">
                    <img
                      src={mod.thumbnail_url}
                      alt={mod.titulo}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                ) : (
                  <div className="w-full h-36 bg-neutral-800 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-neutral-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                    </svg>
                  </div>
                )}
                <div className="p-4">
                  <h4 className="font-semibold text-white truncate group-hover:text-[#D4AF37] transition-colors">{mod.titulo}</h4>
                  <p className="text-sm text-neutral-500 truncate mt-1">
                    {mod.descricao || 'Sem descrição'}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm font-bold text-[#D4AF37]">
                      {mod.gratuito ? 'Grátis' : `${formatPriceMask(String(mod.preco_centavos))}KZ`}
                    </span>
                    <div className="flex items-center gap-2">
                      {mod.carga_horaria && (
                        <span className="text-xs text-neutral-600">{mod.carga_horaria}h</span>
                      )}
                      <span className="text-xs text-neutral-500">
                        {mod.duracao_acesso_dias ? `${mod.duracao_acesso_dias} dias` : 'Vitalício'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {!recLoading && recomendados && recomendados.length === 0 && meusModulos && meusModulos.length > 0 && (
        <p className="text-neutral-500 text-sm">Todos os módulos disponíveis já estão liberados para si.</p>
      )}
    </div>
  );
}
