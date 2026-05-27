'use client';

import { useCertificados } from '@/hooks/useCertificados';
import Link from 'next/link';

export default function StudentCertificados() {
  const { data: certificados, isLoading, error } = useCertificados();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Meus Certificados</h2>

      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="bg-[#0a0a0a] border border-red-900/30 rounded-xl p-6">
          <p className="text-red-400">Erro ao carregar certificados.</p>
        </div>
      )}

      {certificados && certificados.length === 0 && (
        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-neutral-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          <p className="text-neutral-500">Nenhum certificado emitido ainda.</p>
          <p className="text-neutral-600 text-sm mt-2">
            Complete todos os conteúdos de um módulo para gerar seu certificado.
          </p>
          <Link
            href="/home/modulos"
            className="inline-block mt-6 px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B87333] text-black font-semibold rounded-lg text-sm hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-all"
          >
            Ver meus módulos
          </Link>
        </div>
      )}

      {certificados && certificados.length > 0 && (
        <div className="grid gap-4">
          {certificados.map((cert) => (
            <div
              key={cert.id}
              className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-6 flex items-center gap-5 hover:border-[#D4AF37]/20 transition-all"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-[#B87333]/10 flex items-center justify-center shrink-0 border border-[#D4AF37]/20">
                <svg className="w-7 h-7 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold truncate">{cert.modulo_titulo}</h3>
                <p className="text-sm text-neutral-500 mt-0.5">
                  {cert.nome} • {cert.modulo_carga_horaria ? `${cert.modulo_carga_horaria}h` : 'Sem carga horária definida'}
                </p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-xs text-neutral-600">
                    Emitido em {new Date(cert.emitido_em).toLocaleDateString('pt-PT')}
                  </span>
                  <span className="text-xs text-neutral-600 font-mono">
                    #{cert.codigo}
                  </span>
                </div>
              </div>

              <a
                href={cert.pdf_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all shrink-0 ${
                  cert.pdf_url
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#B87333] text-black hover:shadow-[0_0_25px_rgba(212,175,55,0.3)]'
                    : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                }`}
              >
                {cert.pdf_url ? 'Baixar PDF' : 'Indisponível'}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
