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
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/modulos" className="text-sm text-blue-600 hover:underline">
          &larr; Voltar
        </Link>
        <h2 className="text-2xl font-bold">Novo Módulo</h2>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail</label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            required
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="Nome do módulo"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="Descrição do módulo"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="gratuito"
            checked={gratuito}
            onChange={(e) => setGratuito(e.target.checked)}
            className="rounded border-gray-300"
          />
          <label htmlFor="gratuito" className="text-sm font-medium text-gray-700">
            Módulo gratuito
          </label>
        </div>

        {!gratuito && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preço (centavos)</label>
            <input
              type="text"
              inputMode="numeric"
              value={formatPriceMask(precoCentavos)}
              onChange={(e) => setPrecoCentavos(e.target.value.replace(/\D/g, ''))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="1000 = 10.00 AOA"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Duração de acesso (dias)</label>
          <input
            type="number"
            value={duracaoAcessoDias}
            onChange={(e) => setDuracaoAcessoDias(e.target.value)}
            min={1}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="Deixe vazio para acesso vitalício"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'rascunho' | 'publicado')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="rascunho">Rascunho</option>
            <option value="publicado">Publicado</option>
          </select>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {isPending ? 'Criando...' : 'Criar Módulo'}
          </button>
          <Link
            href="/admin/modulos"
            className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
