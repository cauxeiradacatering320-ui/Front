'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCreateModulo } from '@/hooks/useModulos';
import { formatPriceMask } from '@/utils/format';

export default function NovoModulo() {
  const router = useRouter();
  const { mutateAsync: criar, isPending } = useCreateModulo();

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [precoCentavos, setPrecoCentavos] = useState('');
  const [gratuito, setGratuito] = useState(false);
  const [duracaoAcessoDias, setDuracaoAcessoDias] = useState('');
  const [cargaHoraria, setCargaHoraria] = useState('');
  const [status, setStatus] = useState<'rascunho' | 'publicado'>('rascunho');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await criar({
        data: {
          titulo,
          descricao: descricao || undefined,
          preco_centavos: gratuito ? 0 : Number(precoCentavos),
          gratuito,
          duracao_acesso_dias: duracaoAcessoDias ? Number(duracaoAcessoDias) : undefined,
          carga_horaria: cargaHoraria ? Number(cargaHoraria) : undefined,
          status,
        },
        file: file || undefined,
      });
      router.push('/admin/modulos');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/modulos" className="text-sm text-[#D4AF37] hover:underline">
          &larr; Voltar
        </Link>
        <h2 className="text-2xl md:text-3xl font-bold text-white">Novo Módulo</h2>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/20 text-red-400 rounded-lg text-sm border border-red-900/30">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#0a0a0a] border border-[#D4AF37]/10 rounded-2xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1">Thumbnail</label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            required
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block text-sm text-neutral-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#D4AF37]/10 file:text-[#D4AF37] hover:file:bg-[#D4AF37]/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1">Título *</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            className="w-full px-3 py-2 bg-transparent border border-[#D4AF37]/20 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none text-white placeholder-neutral-600"
            placeholder="Nome do módulo"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1">Descrição</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 bg-transparent border border-[#D4AF37]/20 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none text-white placeholder-neutral-600"
            placeholder="Descrição do módulo"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="gratuito"
            checked={gratuito}
            onChange={(e) => setGratuito(e.target.checked)}
            className="rounded border-[#D4AF37]/20 bg-transparent text-[#D4AF37] focus:ring-[#D4AF37]"
          />
          <label htmlFor="gratuito" className="text-sm font-medium text-neutral-300">
            Módulo gratuito
          </label>
        </div>

        {!gratuito && (
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Preço (centavos)</label>
            <input
              type="text"
              inputMode="numeric"
              value={formatPriceMask(precoCentavos)}
              onChange={(e) => setPrecoCentavos(e.target.value.replace(/\D/g, ''))}
              className="w-full px-3 py-2 bg-transparent border border-[#D4AF37]/20 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none text-white placeholder-neutral-600"
              placeholder="1000 = 10.00 AOA"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1">Duração de acesso (dias)</label>
          <input
            type="number"
            value={duracaoAcessoDias}
            onChange={(e) => setDuracaoAcessoDias(e.target.value)}
            min={1}
            className="w-full px-3 py-2 bg-transparent border border-[#D4AF37]/20 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none text-white placeholder-neutral-600"
            placeholder="Deixe vazio para acesso vitalício"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1">Carga horária (horas)</label>
          <input
            type="number"
            value={cargaHoraria}
            onChange={(e) => setCargaHoraria(e.target.value)}
            min={1}
            className="w-full px-3 py-2 bg-transparent border border-[#D4AF37]/20 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none text-white placeholder-neutral-600"
            placeholder="Ex: 40"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'rascunho' | 'publicado')}
            className="w-full px-3 py-2 bg-transparent border border-[#D4AF37]/20 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none text-white"
          >
            <option value="rascunho" className="bg-[#0a0a0a] text-neutral-300">Rascunho</option>
            <option value="publicado" className="bg-[#0a0a0a] text-neutral-300">Publicado</option>
          </select>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B87333] text-black font-semibold rounded-lg text-sm hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Criando...' : 'Criar Módulo'}
          </button>
          <Link
            href="/admin/modulos"
            className="px-6 py-2 text-neutral-400 hover:text-white font-medium transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
