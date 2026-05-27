'use client';

import { useAuthStore } from '@/store/authStore';
import { useStudentDashboard } from '@/hooks/useStudentDashboard';
import { useRecomendados } from '@/hooks/useMeusModulos';
import { formatPriceMask } from '@/utils/format';
import Link from 'next/link';

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const { data, isLoading } = useStudentDashboard();
  const { data: recomendados } = useRecomendados();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Bem-vindo, {user?.nome}!
        </h1>
        <p className="text-neutral-400 mt-1">Acompanhe seu progresso por aulas nos módulos.</p>
      </div>

      {/* Overall Progress Card */}
      <div className="bg-[#0a0a0a] border border-[#D4AF37]/20 rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative w-28 h-28 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="8" className="text-neutral-800" />
              <circle
                cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 54}`}
                strokeDashoffset={`${2 * Math.PI * 54 * (1 - (data?.porcentagem || 0) / 100)}`}
                className="text-[#D4AF37] transition-all duration-1000"
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-[#D4AF37]">
              {data?.porcentagem || 0}%
            </span>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white mb-2">Progresso Geral</h2>
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="text-neutral-400">
                <strong className="text-white">{data?.aulas_completas || 0}</strong> de {data?.total_aulas || 0} aulas concluídas
              </span>
              <span className="text-neutral-600">|</span>
              <span className="text-neutral-400">
                <strong className="text-white">{data?.total_modulos || 0}</strong> módulo(s) em andamento
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Next Lesson Recommendation */}
      {data?.proxima_aula ? (
        <div className="bg-gradient-to-r from-[#D4AF37]/10 to-[#B87333]/5 border border-[#D4AF37]/20 rounded-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {data.proxima_aula.thumbnail_url && (
              <div className="w-full md:w-48 h-28 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={data.proxima_aula.thumbnail_url}
                  alt={data.proxima_aula.modulo_titulo}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <span className="text-xs font-semibold tracking-widest text-[#D4AF37] uppercase">
                Próxima Aula
              </span>
              <h3 className="text-lg font-bold text-white mt-1 truncate">
                {data.proxima_aula.aula_titulo}
              </h3>
              <p className="text-sm text-neutral-400 mt-1 truncate">
                Módulo: {data.proxima_aula.modulo_titulo}
              </p>
              <Link
                href={`/home/modulos/${data.proxima_aula.modulo_id}`}
                className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B87333] text-black font-semibold rounded-lg text-sm hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-all"
              >
                Continuar Assistindo
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      ) : data && data.total_modulos > 0 && data.total_aulas === 0 ? (
        <div className="bg-[#0a0a0a] border border-[#D4AF37]/20 rounded-2xl p-8 text-center">
          <p className="text-neutral-400">Os módulos que você adquiriu ainda não possuem aulas publicadas.</p>
        </div>
      ) : data && data.total_modulos > 0 ? (
        <div className="bg-[#0a0a0a] border border-[#D4AF37]/20 rounded-2xl p-8 text-center">
          <p className="text-lg font-semibold text-[#D4AF37]">Parabéns!</p>
          <p className="text-neutral-400 mt-1">Você concluiu todas as aulas disponíveis.</p>
        </div>
      ) : null}

      {/* Module Progress Cards */}
      {data?.modulos && data.modulos.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Meus Módulos</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {data.modulos.map((mod) => {
              const pct = mod.total_aulas > 0 ? Math.round((mod.aulas_completas / mod.total_aulas) * 100) : 0;
              return (
                <Link
                  key={mod.id}
                  href={`/home/modulos/${mod.id}`}
                  className="bg-[#0a0a0a] border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 rounded-xl p-5 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    {mod.thumbnail_url ? (
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={mod.thumbnail_url} alt={mod.titulo} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-neutral-800 flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neutral-600" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                        </svg>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate group-hover:text-[#D4AF37] transition-colors">
                        {mod.titulo}
                      </h3>
                      <p className="text-xs text-neutral-500 mt-1">
                        {mod.aulas_completas}/{mod.total_aulas} aulas
                      </p>
                      <div className="mt-2 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#D4AF37] to-[#B87333] rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-[#D4AF37] flex-shrink-0">{pct}%</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Compre Também - Recommended Modules */}
      {recomendados && recomendados.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Compre Também</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  <h3 className="font-semibold text-white truncate group-hover:text-[#D4AF37] transition-colors">
                    {mod.titulo}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                    {mod.descricao || 'Módulo disponível para compra.'}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm font-bold text-[#D4AF37]">
                      {mod.gratuito ? 'Grátis' : `${formatPriceMask(String(mod.preco_centavos))}KZ`}
                    </span>
                    <span className="text-xs text-[#D4AF37] group-hover:underline">Comprar</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* No modules yet */}
      {data && data.total_modulos === 0 && (
        <div className="bg-[#0a0a0a] border border-[#D4AF37]/20 rounded-2xl p-8 text-center">
          <p className="text-neutral-400 mb-4">Você ainda não tem acesso a nenhum módulo.</p>
          {recomendados && recomendados.length > 0 ? (
            <Link
              href="/modulos"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B87333] text-black font-semibold rounded-lg text-sm hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-all"
            >
              Ver Módulos Disponíveis
            </Link>
          ) : (
            <p className="text-sm text-neutral-500">Nenhum módulo disponível no momento.</p>
          )}
        </div>
      )}
    </div>
  );
}
