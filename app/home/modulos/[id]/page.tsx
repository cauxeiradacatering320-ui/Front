'use client';

import { use, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useModuloPublic } from '@/hooks/useModulos';
import { useConteudosComProgresso, useMarcarCompleto } from '@/hooks/useStudentConteudo';
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
      <div className="w-10 h-10 border-[3px] border-[#722F37] border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!modulo) return <p className="text-red-500 text-center mt-20">Módulo não encontrado.</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 pb-16">
      <Link href="/home/modulos" className="inline-flex items-center gap-2 text-sm text-[#722F37] hover:text-[#5a252c] transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Meus Módulos
      </Link>

      <div className={`mt-6 mb-8 transition-all duration-700 ${animEnter ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#722F37] to-[#5a252c] flex items-center justify-center shadow-lg shadow-[#722F37]/20">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path d="M12 2C8 2 4 5 4 9c0 2.5 1.5 4.5 3 6l5 7 5-7c1.5-1.5 3-3.5 3-6 0-4-4-7-8-7z" />
              <path d="M9 9l2 2 4-4" strokeWidth={2} />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#2d1b1e]" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
              {modulo.titulo}
            </h1>
            <p className="text-sm text-[#722F37]/60 italic">
              {completos} de {total} {total === 1 ? 'lição' : 'lições'} • {modulo.duracao_acesso_dias ? `${modulo.duracao_acesso_dias} dias de acesso` : 'Acesso vitalício'}
            </p>
          </div>
        </div>

        <div className="relative mt-6">
          <div className="h-3 bg-[#f5ece6] rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${progresso}%`,
                background: 'linear-gradient(90deg, #722F37, #B8860B)',
                boxShadow: '0 0 12px rgba(114,47,55,0.3)',
              }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-[#722F37]/60">Progresso</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#722F37]">{progresso}%</span>
              <div className="w-20 h-2 bg-[#f5ece6] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${progresso}%`,
                    background: 'linear-gradient(90deg, #722F37, #B8860B)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {contLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-[3px] border-[#722F37]/30 border-t-[#722F37] rounded-full animate-spin" />
        </div>
      )}

      {conteudos && conteudos.length === 0 && (
        <div className="text-center py-16 bg-[#fdfaf7] rounded-2xl border border-[#e8ddd5]">
          <svg className="w-16 h-16 mx-auto text-[#722F37]/30 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
            <path d="M12 2C8 2 4 5 4 9c0 2.5 1.5 4.5 3 6l5 7 5-7c1.5-1.5 3-3.5 3-6 0-4-4-7-8-7z" />
          </svg>
          <p className="text-[#722F37]/50 italic">Este módulo ainda não possui lições.</p>
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
                    ? 'border-[#722F37]/20 shadow-xl shadow-[#722F37]/5'
                    : bloqueado
                    ? 'border-[#e8ddd5] opacity-60'
                    : 'border-[#e8ddd5] hover:border-[#722F37]/30 hover:shadow-md'
                }`}
                style={{
                  background: isOpen
                    ? 'linear-gradient(135deg, #fffdfa 0%, #fff 100%)'
                    : '#fff',
                  animation: animEnter ? `fadeSlideUp ${300 + idx * 80}ms ease-out both` : 'none',
                }}
              >
                <button
                  onClick={() => handleAbrirConteudo(c.id, idx)}
                  disabled={bloqueado}
                  className={`w-full flex items-center gap-4 px-5 py-4 text-left transition-colors ${
                    bloqueado ? 'cursor-not-allowed' : ''
                  } ${isOpen ? 'bg-[#722F37]/5' : !bloqueado ? 'hover:bg-[#fdfaf7]' : ''}`}
                >
                  <div className={`relative w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-300 ${
                    c.progresso_completo
                      ? 'bg-gradient-to-br from-[#5B7B3A] to-[#4a6b2e] text-white shadow-md shadow-[#5B7B3A]/20'
                      : isOpen
                      ? 'bg-gradient-to-br from-[#722F37] to-[#5a252c] text-white shadow-md'
                      : bloqueado
                      ? 'bg-[#e8ddd5] text-[#722F37]/30'
                      : 'bg-[#f5ece6] text-[#722F37]/60'
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
                      <span style={{ fontFamily: 'Georgia, serif' }}>{idx + 1}</span>
                    )}
                    {c.progresso_completo && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#5B7B3A] rounded-full border-2 border-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className={`text-sm font-medium block truncate ${
                      c.progresso_completo ? 'text-[#5B7B3A]' : bloqueado ? 'text-[#722F37]/40' : 'text-[#2d1b1e]'
                    }`} style={{ fontFamily: 'Georgia, serif' }}>
                      {c.titulo}
                    </span>
                    <span className="text-xs text-[#722F37]/40">
                      {bloqueado ? 'Complete a lição anterior' : c.tipo === 'video' ? 'Vídeo' : 'Texto'}
                      {c.progresso_completo && ' • Concluído'}
                    </span>
                  </div>

                  <svg className={`w-5 h-5 text-[#722F37]/40 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  isOpen ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="px-5 pb-5 pt-2 space-y-4">
                    <div className="h-px bg-gradient-to-r from-[#722F37]/10 via-[#722F37]/20 to-transparent" />

                    {c.tipo === 'video' && (
                      <div className="rounded-xl overflow-hidden shadow-lg shadow-black/5 border border-[#e8ddd5]">
                        <VideoPlayer conteudoId={c.id} />
                      </div>
                    )}

                    {c.tipo === 'texto' && (
                      <div className="p-6 bg-[#fdfaf7] rounded-xl border border-[#e8ddd5]">
                        <div
                          className="prose prose-sm max-w-none text-[#4a3a35] leading-relaxed [&_h1]:text-[#2d1b1e] [&_h1]:font-serif [&_h2]:text-[#2d1b1e] [&_h2]:font-serif [&_h3]:text-[#2d1b1e] [&_h3]:font-serif [&_strong]:text-[#2d1b1e] [&_a]:text-[#722F37] [&_a]:underline [&_blockquote]:border-l-[#722F37] [&_blockquote]:text-[#722F37]/70 [&_ul>li]:marker:text-[#722F37] [&_ol>li]:marker:text-[#722F37]"
                          dangerouslySetInnerHTML={{ __html: ((c.dados as unknown) as TextoDados).content || '' }}
                        />
                      </div>
                    )}

                    <button
                      onClick={() => marcarCompleto.mutate(c.id)}
                      disabled={timerAtivo || completa || marcarCompleto.isPending}
                      className={`relative w-full py-3 px-6 rounded-xl text-sm font-medium transition-all duration-300 overflow-hidden group ${
                        completa
                          ? 'bg-gradient-to-r from-[#5B7B3A] to-[#4a6b2e] text-white cursor-default shadow-md'
                          : timerAtivo
                          ? 'bg-[#f5ece6] text-[#722F37]/40 cursor-not-allowed'
                          : 'bg-gradient-to-r from-[#722F37] to-[#8b3a44] text-white hover:shadow-lg hover:shadow-[#722F37]/30 hover:-translate-y-0.5 active:translate-y-0'
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

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
