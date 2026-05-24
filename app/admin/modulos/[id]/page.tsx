'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useModuloAdmin, useUpdateModulo, useUploadThumbnail } from '@/hooks/useModulos';
import { useConteudos, useDeleteConteudo, useSyncConteudoStatus, useUpdateConteudo, useReorderConteudos, useCreateTextConteudo } from '@/hooks/useConteudos';
import { VideoUploadForm } from '@/components/VideoUploadForm';
import { RichTextEditor } from '@/components/RichTextEditor';
import { VideoRenderer, TextRenderer } from '@/components/content-renderers';
import { formatKz, formatPriceMask } from '@/utils/format';
import type { Conteudo } from '@/types';
import { PiEngine } from 'react-icons/pi';

export default function AdminModuloDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: modulo, isLoading, error } = useModuloAdmin(id);
  const { data: conteudos, isLoading: loadingConteudos, refetch: refetchConteudos, isRefetching } = useConteudos(id);
  const { mutateAsync: salvar, isPending: saving } = useUpdateModulo();
  const { mutateAsync: upload, isPending: uploading } = useUploadThumbnail();
  const { mutateAsync: deletarConteudo } = useDeleteConteudo(id);
  const { mutateAsync: syncStatus, isPending: syncing } = useSyncConteudoStatus(id);
  const { mutateAsync: atualizarConteudo } = useUpdateConteudo(id);
  const { mutateAsync: reordenarConteudos } = useReorderConteudos(id);

  const [editando, setEditando] = useState(false);
  const [watchingConteudo, setWatchingConteudo] = useState<Conteudo | null>(null);
  const [watchingTextConteudo, setWatchingTextConteudo] = useState<Conteudo | null>(null);
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [editingTitleValue, setEditingTitleValue] = useState('');
  const [syncError, setSyncError] = useState('');
  const [textModalOpen, setTextModalOpen] = useState(false);
  const [textTitulo, setTextTitulo] = useState('');
  const [textContent, setTextContent] = useState('');
  const { mutateAsync: criarTexto, isPending: creatingText } = useCreateTextConteudo(id);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [precoCentavos, setPrecoCentavos] = useState('');
  const [gratuito, setGratuito] = useState(false);
  const [duracaoAcessoDias, setDuracaoAcessoDias] = useState('');
  const [status, setStatus] = useState<'rascunho' | 'publicado' | 'arquivado'>('rascunho');
  const [saveError, setSaveError] = useState('');
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    if (modulo) {
      setTitulo(modulo.titulo);
      setDescricao(modulo.descricao || '');
      setPrecoCentavos(String(modulo.preco_centavos));
      setGratuito(modulo.gratuito);
      setDuracaoAcessoDias(modulo.duracao_acesso_dias ? String(modulo.duracao_acesso_dias) : '');
      setStatus(modulo.status);
    }
  }, [modulo]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError('');

    try {
      await salvar({
        id,
        data: {
          titulo,
          descricao: descricao || null,
          preco_centavos: gratuito ? 0 : Number(precoCentavos),
          gratuito,
          duracao_acesso_dias: duracaoAcessoDias ? Number(duracaoAcessoDias) : null,
          status,
        },
      });
      setEditando(false);
    } catch (err: any) {
      setSaveError(err.message);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');

    try {
      await upload({ moduloId: id, file });
    } catch (err: any) {
      setUploadError(err.message);
    }
  };

  const handleMoveConteudo = async (index: number, direction: 'up' | 'down') => {
    if (!conteudos) return;
    const orderedIds = conteudos.map((c) => c.id);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= orderedIds.length) return;
    [orderedIds[index], orderedIds[targetIndex]] = [orderedIds[targetIndex], orderedIds[index]];
    await reordenarConteudos(orderedIds);
  };

  const handleSaveTitle = async (conteudoId: string) => {
    if (!editingTitleValue.trim()) return;
    await atualizarConteudo({ id: conteudoId, data: { titulo: editingTitleValue.trim() } });
    setEditingTitleId(null);
    setEditingTitleValue('');
  };

  if (isLoading) return <p className="text-gray-500">Carregando...</p>;
  if (error) return <p className="text-red-500">Erro: {error.message}</p>;
  if (!modulo) return <p className="text-gray-500">Módulo não encontrado.</p>;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/modulos" className="text-sm text-blue-600 hover:underline">
          &larr; Voltar
        </Link>
        <h2 className="text-2xl font-bold">{editando ? 'Editar Módulo' : modulo.titulo}</h2>
        <button
          onClick={() => setEditando(!editando)}
          className="ml-auto px-4 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {editando ? 'Cancelar' : 'Editar'}
        </button>
      </div>

      {saveError && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm border border-red-100">
          {saveError}
        </div>
      )}

      {editando ? (
        <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="edit-gratuito"
              checked={gratuito}
              onChange={(e) => setGratuito(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="edit-gratuito" className="text-sm font-medium text-gray-700">Módulo gratuito</label>
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
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duração acesso (dias)</label>
            <input
              type="number"
              value={duracaoAcessoDias}
              onChange={(e) => setDuracaoAcessoDias(e.target.value)}
              min={1}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Vazio = vitalício"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'rascunho' | 'publicado' | 'arquivado')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="rascunho">Rascunho</option>
              <option value="publicado">Publicado</option>
              <option value="arquivado">Arquivado</option>
            </select>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
            <button
              type="button"
              onClick={() => setEditando(false)}
              className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          {modulo.thumbnail_url && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail</label>
              <img
                src={modulo.thumbnail_url}
                alt={modulo.titulo}
                className="w-full max-w-md h-48 object-cover rounded-lg border"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alterar Thumbnail</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleUpload}
              disabled={uploading}
              className="block text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {uploading && <p className="text-sm text-blue-600 mt-1">Enviando...</p>}
            {uploadError && <p className="text-sm text-red-500 mt-1">{uploadError}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Slug</label>
              <p className="text-gray-900">{modulo.slug}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                modulo.status === 'publicado'
                  ? 'bg-green-100 text-green-700'
                  : modulo.status === 'rascunho'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {modulo.status}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Preço</label>
              <p className="text-gray-900">
                {modulo.gratuito ? 'Grátis' : formatPriceMask(String(modulo.preco_centavos))}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Duração de acesso</label>
              <p className="text-gray-900">
                {modulo.duracao_acesso_dias ? `${modulo.duracao_acesso_dias} dias` : 'Vitalício'}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <p className="text-gray-900 whitespace-pre-wrap">{modulo.descricao || 'Sem descrição'}</p>
          </div>

              <div className="text-xs text-gray-400 space-y-1">
                <p>Criado em: {new Date(modulo.criado_em).toLocaleString('pt-BR')}</p>
                <p>Atualizado em: {new Date(modulo.atualizado_em).toLocaleString('pt-BR')}</p>
              </div>
            </div>
          )}

          {/* Conteúdos do Módulo */}
          <section className="mt-10 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Conteúdos</h3>
              <button
                onClick={() => refetchConteudos()}
                disabled={isRefetching}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                title="Atualizar status dos conteúdos"
              >
                <svg className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {isRefetching ? 'Atualizando...' : 'Atualizar'}
              </button>
            </div>

            <VideoUploadForm moduloId={id} />

            <div className="flex gap-3">
              <button
                onClick={() => setTextModalOpen(true)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
              >
                Adicionar Texto
              </button>
            </div>

            {syncError && (
              <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm border border-red-100">
                {syncError}
              </div>
            )}

            {loadingConteudos && (
              <p className="text-gray-500 text-sm">Carregando conteúdos...</p>
            )}

            {conteudos && conteudos.length === 0 && (
              <p className="text-gray-400 text-sm">Nenhum conteúdo ainda. Adicione um vídeo acima.</p>
            )}

            {conteudos && conteudos.length > 0 && (
              <div className="space-y-3">
                {conteudos.map((conteudo: Conteudo, index: number) => (
                  <div
                    key={conteudo.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                  >
                    <div className="p-4 flex items-start gap-4">
                      <span className="text-sm font-medium text-gray-400 min-w-[2rem]">
                        {conteudo.posicao}
                      </span>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs uppercase tracking-wide font-medium text-gray-400">
                            {conteudo.tipo}
                          </span>
                          <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${
                            conteudo.tipo === 'video'
                              ? statusBadgeColor(conteudo.dados as Record<string, unknown>)
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {conteudo.tipo === 'video'
                              ? statusLabel(conteudo.dados as Record<string, unknown>)
                              : 'disponível'}
                          </span>
                          {conteudo.tipo === 'video' && (
                            <span className="text-xs text-gray-400">
                              {(conteudo.dados as Record<string, unknown>).duration
                                ? Math.round(Number((conteudo.dados as Record<string, unknown>).duration)) > 60 ? `${Math.round(Number((conteudo.dados as Record<string, unknown>).duration) / 60)}m` : `${Math.round(Number((conteudo.dados as Record<string, unknown>).duration) )}s`
                                : ''}

                            </span>
                          )}
                        </div>
                        {editingTitleId === conteudo.id ? (
                          <input
                            type="text"
                            value={editingTitleValue}
                            onChange={(e) => setEditingTitleValue(e.target.value)}
                            onBlur={() => handleSaveTitle(conteudo.id)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveTitle(conteudo.id);
                              if (e.key === 'Escape') setEditingTitleId(null);
                            }}
                            autoFocus
                            className="w-full px-2 py-1 border border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium mt-1"
                          />
                        ) : (
                          <h4 className="font-medium text-gray-900 mt-1 truncate">
                            {conteudo.titulo}
                          </h4>
                        )}

                        {conteudo.tipo === 'video' && (() => {
                          const dados = conteudo.dados as Record<string, unknown>;
                          const thumb = dados.thumbnailUrl;
                          if (!thumb) return null;
                          return (
                            <img
                              src={String(thumb)}
                              alt={conteudo.titulo}
                              className="mt-2 w-full max-w-xs h-20 object-cover rounded border"
                            />
                          );
                        })()}
                      </div>

                      <div className="flex flex-col gap-1">
                        {index > 0 && (
                          <button
                            onClick={() => handleMoveConteudo(index, 'up')}
                            className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Mover para cima"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          </button>
                        )}
                        {index < conteudos.length - 1 && (
                          <button
                            onClick={() => handleMoveConteudo(index, 'down')}
                            className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Mover para baixo"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setEditingTitleId(conteudo.id);
                            setEditingTitleValue(conteudo.titulo);
                          }}
                          className="p-1.5 text-gray-400 hover:text-orange-600 transition-colors"
                          title="Editar título"
                        >
                          <PiEngine/>
                        </button>
                        {conteudo.tipo === 'texto' && (
                          <button
                            onClick={() => setWatchingTextConteudo(conteudo)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Visualizar conteúdo"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        )}
                        {(conteudo.tipo === 'video' &&
                          (conteudo.dados as Record<string, unknown>).status === 'ready') && (
                          <button
                            onClick={() => setWatchingConteudo(conteudo)}
                            className="p-1.5 text-gray-400 hover:text-green-600 transition-colors"
                            title="Assistir vídeo"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={async () => {
                            setSyncError('');
                            try {
                              await syncStatus(conteudo.id);
                            } catch (err: any) {
                              setSyncError(err.message);
                            }
                          }}
                          disabled={syncing}
                          className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-50"
                          title="Sincronizar status com Bunny"
                        >
                          <svg className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Deletar "${conteudo.titulo}"?`)) {
                              deletarConteudo(conteudo.id);
                            }
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                          title="Remover conteúdo"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Modal Assistir Vídeo */}
          {watchingConteudo && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
              onClick={() => setWatchingConteudo(null)}
            >
              <div
                className="relative w-full max-w-4xl bg-black rounded-xl overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setWatchingConteudo(null)}
                  className="absolute top-3 right-3 z-10 p-1.5 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <VideoRenderer conteudo={watchingConteudo} />
              </div>
            </div>
          )}

          {/* Modal Visualizar Conteúdo de Texto */}
          {watchingTextConteudo && (
            <div
              className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-4 pt-12 overflow-y-auto"
              onClick={() => setWatchingTextConteudo(null)}
            >
              <div
                className="relative w-full max-w-3xl bg-white rounded-xl overflow-hidden shadow-2xl mb-12"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                  <h3 className="text-lg font-bold truncate">{watchingTextConteudo.titulo}</h3>
                  <button
                    onClick={() => setWatchingTextConteudo(null)}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-6">
                  <TextRenderer conteudo={watchingTextConteudo} />
                </div>
              </div>
            </div>
          )}

          {/* Modal Criar Conteúdo de Texto */}
          {textModalOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
              onClick={() => setTextModalOpen(false)}
            >
              <div
                className="relative w-full max-w-3xl bg-white rounded-xl overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-bold">Adicionar Conteúdo de Texto</h3>
                  <button
                    onClick={() => setTextModalOpen(false)}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                    <input
                      type="text"
                      value={textTitulo}
                      onChange={(e) => setTextTitulo(e.target.value)}
                      placeholder="Ex: Introdução ao módulo"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Conteúdo</label>
                    <RichTextEditor
                      content={textContent}
                      onChange={setTextContent}
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={async () => {
                        if (!textTitulo.trim()) return;
                        try {
                          await criarTexto({ titulo: textTitulo.trim(), content: textContent });
                          setTextModalOpen(false);
                          setTextTitulo('');
                          setTextContent('');
                        } catch (err: any) {
                          alert(err.message);
                        }
                      }}
                      disabled={creatingText || !textTitulo.trim()}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
                    >
                      {creatingText ? 'Criando...' : 'Criar Conteúdo'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setTextModalOpen(false)}
                      className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

  );
}

function statusBadgeColor(dados: Record<string, unknown>): string {
  switch (dados.status) {
    case 'pending_upload': return 'bg-yellow-100 text-yellow-700';
    case 'uploaded':
    case 'processing': return 'bg-blue-100 text-blue-700';
    case 'ready': return 'bg-green-100 text-green-700';
    case 'error': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}

function statusLabel(dados: Record<string, unknown>): string {
  switch (dados.status) {
    case 'pending_upload': return 'Aguardando upload';
    case 'uploaded': return 'Upload feito';
    case 'processing': return 'Processando';
    case 'ready': return 'Pronto';
    case 'error': return 'Erro';
    default: return String(dados.status || 'desconhecido');
  }
}
