'use client';

import { use, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useModuloPublic } from '@/hooks/useModulos';
import { useConteudosComProgresso, useMarcarCompleto } from '@/hooks/useStudentConteudo';
import { useVerificarCertificado, useGerarCertificado } from '@/hooks/useCertificados';
import { VideoPlayer } from '@/components/VideoPlayer';
import type { TextoDados } from '@/types';

function useTimer(ativo: boolean) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!ativo) { setTimeLeft(0); return; }
    const end = Date.now() + 60000;
    setTimeLeft(60);
    const id = setInterval(() => {
      const left = Math.max(0, Math.ceil((end - Date.now()) / 1000));
      setTimeLeft(left);
      if (left <= 0) clearInterval(id);
    }, 250);
    return () => clearInterval(id);
  }, [ativo]);

  return timeLeft;
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: modulo, isLoading: modLoading } = useModuloPublic(id);
  const { data: conteudos, isLoading: contLoading } = useConteudosComProgresso(id);
  const marcarCompleto = useMarcarCompleto(id);

  const { data: certificadoData } = useVerificarCertificado(id);
  const { mutateAsync: gerarCert, isPending: gerandoCert } = useGerarCertificado();
  const certificado = certificadoData?.certificado;

  const [certModalOpen, setCertModalOpen] = useState(false);
  const [certNome, setCertNome] = useState('');

  const [conteudoAberto, setConteudoAberto] = useState<string | null>(null);
  const [timerAtivo, setTimerAtivo] = useState(false);
  const [animEnter, setAnimEnter] = useState(false);
  const timeLeft = useTimer(timerAtivo);

  useEffect(() => { setTimeout(() => setAnimEnter(true), 50); }, []);

  const handleAbrirConteudo = useCallback((conteudoId: string, idx: number) => {
    if (idx > 0) {
      const anterior = conteudos?.[idx - 1];
      if (anterior && !anterior.progresso_completo) return;
    }
    setConteudoAberto((prev) => prev === conteudoId ? null : conteudoId);
    setTimerAtivo(true);
    setTimeout(() => setTimerAtivo(false), 60000);
  }, [conteudos]);

  const total = conteudos?.length ?? 0;
  const completos = conteudos?.filter((c) => c.progresso_completo).length ?? 0;
  const progresso = total > 0 ? Math.round((completos / total) * 100) : 0;

  const conteudo = conteudos?.find((c) => c.id === conteudoAberto);
  const completa = conteudo?.progresso_completo ?? false;

  const estaBloqueado = (idx: number) => {
    if (idx === 0) return false;
    const anterior = conteudos?.[idx - 1];
    return anterior ? !anterior.progresso_completo : false;
  };

  if (modLoading) return (
    <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
    </div>
  );
  if (!modulo) return (
    <div className="max-w-4xl mx-auto text-center pt-20">
      <p className="text-red-400">Módulo não encontrado.</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 pb-16">
      <Link
        href="/home/modulos"
        className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-[#D4AF37] transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Meus Módulos
      </Link>

      <div className={`mt-6 mb-8 transition-all duration-700 ${animEnter ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B87333] flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
            <svg className="w-6 h-6 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path d="M12 2C8 2 4 5 4 9c0 2.5 1.5 4.5 3 6l5 7 5-7c1.5-1.5 3-3.5 3-6 0-4-4-7-8-7z" />
              <path d="M9 9l2 2 4-4" strokeWidth={2} />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">
              {modulo.titulo}
            </h1>
            <p className="text-sm text-neutral-500">
              {completos} de {total} {total === 1 ? 'lição' : 'lições'}
              {modulo.carga_horaria ? ` • ${modulo.carga_horaria}h` : ''}
              {' • '}{modulo.duracao_acesso_dias ? `${modulo.duracao_acesso_dias} dias de acesso` : 'Acesso vitalício'}
            </p>
          </div>
        </div>

        <div className="relative mt-6">
          <div className="h-3 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-[#D4AF37] to-[#B87333]"
              style={{ width: `${progresso}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-neutral-500">Progresso</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#D4AF37]">{progresso}%</span>
              <div className="w-20 h-2 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-[#D4AF37] to-[#B87333]"
                  style={{ width: `${progresso}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {contLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
        </div>
      )}

      {conteudos && conteudos.length === 0 && (
        <div className="text-center py-16 bg-[#0a0a0a] rounded-2xl border border-[#D4AF37]/10">
          <svg className="w-16 h-16 mx-auto text-[#D4AF37]/30 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
            <path d="M12 2C8 2 4 5 4 9c0 2.5 1.5 4.5 3 6l5 7 5-7c1.5-1.5 3-3.5 3-6 0-4-4-7-8-7z" />
          </svg>
          <p className="text-neutral-500 italic">Este módulo ainda não possui lições.</p>
        </div>
      )}

      {conteudos && conteudos.length > 0 && (
        <div className="space-y-3">
          {conteudos.map((c, idx) => {
            const isOpen = conteudoAberto === c.id;
            const bloqueado = estaBloqueado(idx);
            return (
              <div
                key={c.id}
                className={`transition-all duration-500 rounded-2xl border overflow-hidden ${
                  isOpen
                    ? 'border-[#D4AF37]/20 shadow-xl shadow-[#D4AF37]/5'
                    : bloqueado
                    ? 'border-[#D4AF37]/10 opacity-50'
                    : 'border-[#D4AF37]/10 hover:border-[#D4AF37]/30'
                } bg-[#0a0a0a]`}
                style={{
                  animation: animEnter ? `fadeSlideUp ${300 + idx * 80}ms ease-out both` : 'none',
                }}
              >
                <button
                  onClick={() => handleAbrirConteudo(c.id, idx)}
                  disabled={bloqueado}
                  className={`w-full flex items-center gap-4 px-5 py-4 text-left transition-colors ${
                    bloqueado ? 'cursor-not-allowed' : ''
                  } ${isOpen ? 'bg-[#D4AF37]/5' : !bloqueado ? 'hover:bg-[#111]' : ''}`}
                >
                  <div className={`relative w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-300 ${
                    c.progresso_completo
                      ? 'bg-gradient-to-br from-[#D4AF37] to-[#B87333] text-black shadow-md shadow-[#D4AF37]/20'
                      : isOpen
                      ? 'bg-gradient-to-br from-[#D4AF37] to-[#B87333] text-black shadow-md'
                      : bloqueado
                      ? 'bg-neutral-800 text-neutral-600'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}>
                    {c.progresso_completo ? (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : bloqueado ? (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <rect x="3" y="11" width="18" height="11" rx="2" />
                        <path d="M7 11V7a5 5 0 0110 0v4" />
                      </svg>
                    ) : (
                      <span>{idx + 1}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className={`text-sm font-medium block truncate ${
                      c.progresso_completo ? 'text-[#D4AF37]' : bloqueado ? 'text-neutral-600' : 'text-white'
                    }`}>
                      {c.titulo}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {bloqueado ? 'Complete a lição anterior' : c.tipo === 'video' ? 'Vídeo' : 'Texto'}
                      {c.progresso_completo && ' • Concluído'}
                    </span>
                  </div>

                  <svg className={`w-5 h-5 text-neutral-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  isOpen ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="px-5 pb-5 pt-2 space-y-4">
                    <div className="h-px bg-gradient-to-r from-[#D4AF37]/10 via-[#D4AF37]/20 to-transparent" />

                    {c.tipo === 'video' && (
                      <div className="rounded-xl overflow-hidden border border-[#D4AF37]/10">
                        <VideoPlayer conteudoId={c.id} />
                      </div>
                    )}

                    {c.tipo === 'texto' && (
                      <div className="p-6 bg-[#111] rounded-xl border border-[#D4AF37]/10">
                        <div
                          className="prose prose-sm max-w-none text-neutral-300 leading-relaxed [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white [&_strong]:text-white [&_a]:text-[#D4AF37] [&_a]:underline [&_blockquote]:border-l-[#D4AF37] [&_blockquote]:text-[#D4AF37]/70 [&_ul>li]:marker:text-[#D4AF37] [&_ol>li]:marker:text-[#D4AF37]"
                          dangerouslySetInnerHTML={{ __html: ((c.dados as unknown) as TextoDados).content || '' }}
                        />
                      </div>
                    )}

                    <button
                      onClick={() => marcarCompleto.mutate(c.id)}
                      disabled={timerAtivo || completa || marcarCompleto.isPending}
                      className={`relative w-full py-3 px-6 rounded-xl text-sm font-medium transition-all duration-300 overflow-hidden group ${
                        completa
                          ? 'bg-gradient-to-r from-[#D4AF37] to-[#B87333] text-black cursor-default shadow-md'
                          : timerAtivo
                          ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-[#D4AF37] to-[#B87333] text-black hover:shadow-lg hover:shadow-[#D4AF37]/30 hover:-translate-y-0.5 active:translate-y-0'
                      }`}
                    >
                      {completa ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Concluído
                        </span>
                      ) : timerAtivo ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-4 h-4 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 6v6l4 2" />
                          </svg>
                          Aguarde {timeLeft}s
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Marcar como Concluído
                        </span>
                      )}
                      {!completa && !timerAtivo && (
                        <span className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Certificado */}
      {conteudos && conteudos.length > 0 && progresso === 100 && (
        <div className="mt-10 bg-[#0a0a0a] border border-[#D4AF37]/20 rounded-2xl p-8 text-center">
          {certificado ? (
            <>
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B87333] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#D4AF37]/20">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Certificado Emitido</h3>
              <p className="text-neutral-500 text-sm mb-6">
                {certificado.nome} • Código: {certificado.codigo}
              </p>
              <a
                href={certificado.pdf_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B87333] text-black font-semibold rounded-lg text-sm hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Baixar Certificado
              </a>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-4 border border-[#D4AF37]/20">
                <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Parabéns!</h3>
              <p className="text-neutral-500 text-sm mb-2">
                Você concluiu todas as lições deste módulo.
              </p>
              <p className="text-neutral-600 text-xs mb-6">
                Gere seu certificado de conclusão.
              </p>
              <button
                onClick={() => {
                  setCertNome('');
                  setCertModalOpen(true);
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B87333] text-black font-semibold rounded-lg text-sm hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-all"
              >
                Gerar Certificado
              </button>
            </>
          )}
        </div>
      )}

      {/* Modal nome do certificado */}
      {certModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setCertModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md bg-[#0a0a0a] border border-neutral-800 rounded-2xl shadow-2xl p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-white mb-2">Gerar Certificado</h3>
            <p className="text-sm text-neutral-500 mb-6">
              Digite o nome que aparecerá no certificado.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Nome completo</label>
                <input
                  type="text"
                  value={certNome}
                  onChange={(e) => setCertNome(e.target.value)}
                  placeholder="Seu nome completo"
                  className="w-full px-4 py-2.5 bg-[#050505] border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/30 transition-all"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={async () => {
                    if (!certNome.trim()) return;
                    try {
                      await gerarCert({ moduloId: id, nome: certNome.trim() });
                      setCertModalOpen(false);
                    } catch (err: any) {
                      alert(err.message);
                    }
                  }}
                  disabled={gerandoCert || !certNome.trim()}
                  className="flex-1 px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B87333] text-black font-semibold rounded-lg text-sm hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {gerandoCert ? 'Gerando...' : 'Confirmar'}
                </button>
                <button
                  onClick={() => setCertModalOpen(false)}
                  className="px-6 py-2.5 text-neutral-400 hover:text-white font-medium text-sm transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
