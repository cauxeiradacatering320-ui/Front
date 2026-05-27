'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useModuloAdmin, useUpdateModulo, useUploadThumbnail } from '@/hooks/useModulos';
import { useConteudos, useDeleteConteudo, useSyncConteudoStatus, useUpdateConteudo, useReorderConteudos, useCreateTextConteudo } from '@/hooks/useConteudos';
import { VideoUploadForm } from '@/components/VideoUploadForm';
import { RichTextEditor } from '@/components/RichTextEditor';
import { VideoRenderer, TextRenderer } from '@/components/content-renderers';
import { formatPriceMask } from '@/utils/format';
import type { Conteudo } from '@/types';
import {
  PiEngine,
  PiCaretUp,
  PiCaretDown,
  PiEye,
  PiPlay,
  PiArrowsClockwise,
  PiTrash,
  PiXBold,
  PiFilmStrip,
  PiFileText,
} from 'react-icons/pi';
import { MdEdit } from "react-icons/md";

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

  const [editTextModalOpen, setEditTextModalOpen] = useState(false);
  const [editingTextConteudoId, setEditingTextConteudoId] = useState<string | null>(null);
  const [editTextTitulo, setEditTextTitulo] = useState('');
  const [editTextContent, setEditTextContent] = useState('');

  const { mutateAsync: criarTexto, isPending: creatingText } = useCreateTextConteudo(id);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [precoCentavos, setPrecoCentavos] = useState('');
  const [gratuito, setGratuito] = useState(false);
  const [duracaoAcessoDias, setDuracaoAcessoDias] = useState('');
  const [cargaHoraria, setCargaHoraria] = useState('');
  const [status, setStatus] = useState<'rascunho' | 'publicado' | 'arquivado'>('rascunho');
  const [saveError, setSaveError] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [showAddChoice, setShowAddChoice] = useState(false);
  const [showVideoForm, setShowVideoForm] = useState(false);

  useEffect(() => {
    if (modulo) {
      setTitulo(modulo.titulo);
      setDescricao(modulo.descricao || '');
      setPrecoCentavos(String(modulo.preco_centavos));
      setGratuito(modulo.gratuito);
      setDuracaoAcessoDias(modulo.duracao_acesso_dias ? String(modulo.duracao_acesso_dias) : '');
      setCargaHoraria(modulo.carga_horaria ? String(modulo.carga_horaria) : '');
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
          carga_horaria: cargaHoraria ? Number(cargaHoraria) : null,
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

  const handleOpenEditText = (conteudo: Conteudo) => {
    setEditingTextConteudoId(conteudo.id);
    setEditTextTitulo(conteudo.titulo);
    setEditTextContent((conteudo.dados as Record<string, unknown>)?.content as string || '');
    setEditTextModalOpen(true);
  };

  const handleSaveEditText = async () => {
    if (!editingTextConteudoId || !editTextTitulo.trim()) return;
    const data: Record<string, string> = { titulo: editTextTitulo.trim() };
    if (editTextContent) data.content = editTextContent;
    await atualizarConteudo({ id: editingTextConteudoId, data });
    setEditTextModalOpen(false);
    setEditingTextConteudoId(null);
    setEditTextTitulo('');
    setEditTextContent('');
  };

  const handleCloseEditText = () => {
    setEditTextModalOpen(false);
    setEditingTextConteudoId(null);
    setEditTextTitulo('');
    setEditTextContent('');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#0a0a0a] border border-red-900/30 rounded-xl p-6">
        <p className="text-red-400">Erro: {error.message}</p>
      </div>
    );
  }

  if (!modulo) {
    return (
      <div className="bg-[#0a0a0a] border border-[#D4AF37]/20 rounded-2xl p-8 text-center">
        <p className="text-neutral-400">Módulo não encontrado.</p>
      </div>
    );
  }

  const totalConteudos = conteudos?.length ?? 0;

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/modulos"
          className="text-sm text-[#D4AF37] hover:text-[#B87333] transition-colors"
        >
          &larr; Voltar
        </Link>
        <h2 className="text-2xl font-bold text-white flex-1 truncate">
          {editando ? 'Editar Módulo' : modulo.titulo}
        </h2>
        <button
          onClick={() => setEditando(!editando)}
          className="px-4 py-1.5 text-sm border border-[#D4AF37]/30 text-[#D4AF37] rounded-lg hover:bg-[#D4AF37]/10 transition-all"
        >
          {editando ? 'Cancelar' : 'Editar'}
        </button>
      </div>

      {saveError && (
        <div className="p-3 bg-red-900/20 border border-red-900/30 text-red-400 rounded-lg text-sm">
          {saveError}
        </div>
      )}

      {/* Metrics */}
      {!editando && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#0a0a0a] border border-[#D4AF37]/20 rounded-xl p-5">
            <p className="text-xs uppercase tracking-wider text-neutral-500 mb-1">Alunos</p>
            <p className="text-2xl font-bold text-[#D4AF37]">{modulo.total_alunos ?? 0}</p>
          </div>
          <div className="bg-[#0a0a0a] border border-[#D4AF37]/20 rounded-xl p-5">
            <p className="text-xs uppercase tracking-wider text-neutral-500 mb-1">Conteúdos</p>
            <p className="text-2xl font-bold text-white">{totalConteudos}</p>
          </div>
          <div className="bg-[#0a0a0a] border border-[#D4AF37]/20 rounded-xl p-5">
            <p className="text-xs uppercase tracking-wider text-neutral-500 mb-1">Preço</p>
            <p className="text-2xl font-bold text-white">
              {modulo.gratuito ? 'Grátis' : formatPriceMask(String(modulo.preco_centavos))}
            </p>
          </div>
          <div className="bg-[#0a0a0a] border border-[#D4AF37]/20 rounded-xl p-5">
            <p className="text-xs uppercase tracking-wider text-neutral-500 mb-1">Status</p>
            <span className={`inline-block mt-1 text-xs px-3 py-1 rounded-full font-medium ${
              modulo.status === 'publicado'
                ? 'bg-green-900/30 text-green-400 border border-green-900/30'
                : modulo.status === 'rascunho'
                ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-900/30'
                : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
            }`}>
              {modulo.status}
            </span>
          </div>
        </div>
      )}

      {/* Edit Form */}
      {editando ? (
        <form onSubmit={handleSave} className="bg-[#0a0a0a] border border-[#D4AF37]/20 rounded-2xl p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">Título</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-[#050505] border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/30 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">Descrição</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 bg-[#050505] border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/30 transition-all resize-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="edit-gratuito"
              checked={gratuito}
              onChange={(e) => setGratuito(e.target.checked)}
              className="rounded border-neutral-700 bg-[#050505] text-[#D4AF37] focus:ring-[#D4AF37]/30"
            />
            <label htmlFor="edit-gratuito" className="text-sm font-medium text-neutral-300">Módulo gratuito</label>
          </div>

          {!gratuito && (
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1.5">Preço</label>
              <input
                type="text"
                inputMode="numeric"
                value={formatPriceMask(precoCentavos)}
                onChange={(e) => setPrecoCentavos(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-2.5 bg-[#050505] border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/30 transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">Duração acesso (dias)</label>
            <input
              type="number"
              value={duracaoAcessoDias}
              onChange={(e) => setDuracaoAcessoDias(e.target.value)}
              min={1}
              className="w-full px-4 py-2.5 bg-[#050505] border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/30 transition-all"
              placeholder="Vazio = vitalício"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">Carga horária (horas)</label>
            <input
              type="number"
              value={cargaHoraria}
              onChange={(e) => setCargaHoraria(e.target.value)}
              min={1}
              className="w-full px-4 py-2.5 bg-[#050505] border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/30 transition-all"
              placeholder="Ex: 40"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'rascunho' | 'publicado' | 'arquivado')}
              className="w-full px-4 py-2.5 bg-[#050505] border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/30 transition-all"
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
              className="px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B87333] text-black font-semibold rounded-lg text-sm hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
            <button
              type="button"
              onClick={() => setEditando(false)}
              className="px-6 py-2.5 text-neutral-400 hover:text-white font-medium text-sm transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <>
          {/* Module Info */}
          <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-6 space-y-6">
            {modulo.thumbnail_url && (
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">Thumbnail</label>
                <img
                  src={modulo.thumbnail_url}
                  alt={modulo.titulo}
                  className="w-full max-w-md h-48 object-cover rounded-xl border border-neutral-800"
                />
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1.5">Alterar Thumbnail</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleUpload}
                disabled={uploading}
                className="block text-sm text-neutral-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#D4AF37]/10 file:text-[#D4AF37] hover:file:bg-[#D4AF37]/20 file:transition-colors"
              />
              {uploading && <p className="text-sm text-[#D4AF37] mt-1">Enviando...</p>}
              {uploadError && <p className="text-sm text-red-400 mt-1">{uploadError}</p>}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-500">Slug</label>
                <p className="text-white mt-0.5">{modulo.slug}</p>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-500">Duração de acesso</label>
                <p className="text-white mt-0.5">
                  {modulo.duracao_acesso_dias ? `${modulo.duracao_acesso_dias} dias` : 'Vitalício'}
                </p>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-500">Carga horária</label>
                <p className="text-white mt-0.5">
                  {modulo.carga_horaria ? `${modulo.carga_horaria}h` : 'Não definida'}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1">Descrição</label>
              <p className="text-neutral-300 whitespace-pre-wrap">{modulo.descricao || 'Sem descrição'}</p>
            </div>

            <div className="text-xs text-neutral-600 space-y-0.5">
              <p>Criado em: {new Date(modulo.criado_em).toLocaleString('pt-BR')}</p>
              <p>Atualizado em: {new Date(modulo.atualizado_em).toLocaleString('pt-BR')}</p>
            </div>
          </div>
        </>
      )}

      {/* Conteúdos do Módulo */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Conteúdos</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={() => refetchConteudos()}
              disabled={isRefetching}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-neutral-700 text-neutral-400 rounded-lg hover:bg-neutral-800 transition-all disabled:opacity-50"
              title="Atualizar status dos conteúdos"
            >
              <svg className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {isRefetching ? 'Atualizando...' : 'Atualizar'}
            </button>
            <button
              onClick={() => {
                setShowVideoForm(false);
                setShowAddChoice(!showAddChoice);
              }}
              className="px-4 py-1.5 bg-gradient-to-r from-[#D4AF37] to-[#B87333] text-black font-semibold rounded-lg text-sm hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-all"
            >
              + Adicionar Conteúdo
            </button>
          </div>
        </div>

        {/* Content Type Choice */}
        {showAddChoice && (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => {
                setShowVideoForm(true);
                setShowAddChoice(false);
              }}
              className="bg-[#0a0a0a] border border-[#D4AF37]/20 rounded-xl p-6 text-left hover:border-[#D4AF37]/50 transition-all group"
            >
              <div className="w-12 h-12 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center mb-3 group-hover:bg-[#D4AF37]/20 transition-colors">
                <svg className="w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-white font-semibold mb-1">Vídeo</h4>
              <p className="text-sm text-neutral-500">Upload de arquivo de vídeo via Bunny CDN</p>
            </button>
            <button
              onClick={() => {
                setTextModalOpen(true);
                setShowAddChoice(false);
              }}
              className="bg-[#0a0a0a] border border-[#D4AF37]/20 rounded-xl p-6 text-left hover:border-[#D4AF37]/50 transition-all group"
            >
              <div className="w-12 h-12 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center mb-3 group-hover:bg-[#D4AF37]/20 transition-colors">
                <svg className="w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="text-white font-semibold mb-1">Texto</h4>
              <p className="text-sm text-neutral-500">Criar conteúdo escrito com editor rich text</p>
            </button>
          </div>
        )}

        {/* Video Upload Form */}
        {showVideoForm && (
          <div className="relative">
            <button
              onClick={() => setShowVideoForm(false)}
              className="absolute top-4 right-4 p-1 text-neutral-500 hover:text-white transition-colors z-10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-6">
              <VideoUploadForm moduloId={id} />
            </div>
          </div>
        )}

        {syncError && (
          <div className="p-3 bg-red-900/20 border border-red-900/30 text-red-400 rounded-lg text-sm">
            {syncError}
          </div>
        )}

        {loadingConteudos && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
          </div>
        )}

        {conteudos && conteudos.length === 0 && (
          <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-neutral-700 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
            <p className="text-neutral-500 text-sm">Nenhum conteúdo ainda. Adicione vídeos ou textos.</p>
          </div>
        )}

        {conteudos && conteudos.length > 0 && (
          <div className="space-y-3">
            {conteudos.map((conteudo: Conteudo, index: number) => (
              <ConteudoCard
                key={conteudo.id}
                conteudo={conteudo}
                index={index}
                total={conteudos.length}
                editingTitleId={editingTitleId}
                editingTitleValue={editingTitleValue}
                syncing={syncing}
                onMoveUp={handleMoveConteudo}
                onMoveDown={handleMoveConteudo}
                onStartEditTitle={(c) => { setEditingTitleId(c.id); setEditingTitleValue(c.titulo); }}
                onSaveTitle={handleSaveTitle}
                onEditingTitleChange={setEditingTitleValue}
                onCancelEditTitle={() => setEditingTitleId(null)}
                onWatchVideo={setWatchingConteudo}
                onWatchText={setWatchingTextConteudo}
                onEditText={handleOpenEditText}
                onSync={async (c) => {
                  setSyncError('');
                  try { await syncStatus(c.id); } catch (err: any) { setSyncError(err.message); }
                }}
                onDelete={(c) => {
                  if (window.confirm(`Deletar "${c.titulo}"?`)) { deletarConteudo(c.id); }
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* Modal Assistir Vídeo */}
      {watchingConteudo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setWatchingConteudo(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-black rounded-xl overflow-hidden shadow-2xl border border-neutral-800"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setWatchingConteudo(null)}
              className="absolute top-3 right-3 z-10 p-1.5 bg-black/50 hover:bg-black/80 rounded-full text-white transition-all hover:text-[#D4AF37]"
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
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 p-4 pt-12 overflow-y-auto"
          onClick={() => setWatchingTextConteudo(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-[#0a0a0a] border border-neutral-800 rounded-xl overflow-hidden shadow-2xl mb-12"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 sticky top-0 bg-[#0a0a0a] z-10">
              <h3 className="text-lg font-bold text-white truncate">{watchingTextConteudo.titulo}</h3>
              <button
                onClick={() => setWatchingTextConteudo(null)}
                className="p-1 text-neutral-500 hover:text-white transition-colors shrink-0"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 text-neutral-300">
              <TextRenderer conteudo={watchingTextConteudo} />
            </div>
          </div>
        </div>
      )}

      {/* Modal Criar Conteúdo de Texto */}
      {textModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setTextModalOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl bg-[#0a0a0a] border border-neutral-800 rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
              <h3 className="text-lg font-bold text-white">Adicionar Conteúdo de Texto</h3>
              <button
                onClick={() => {
                  setTextModalOpen(false);
                  setTextTitulo('');
                  setTextContent('');
                }}
                className="p-1 text-neutral-500 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Título</label>
                <input
                  type="text"
                  value={textTitulo}
                  onChange={(e) => setTextTitulo(e.target.value)}
                  placeholder="Ex: Introdução ao módulo"
                  className="w-full px-4 py-2.5 bg-[#050505] border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/30 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Conteúdo</label>
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
                  className="px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B87333] text-black font-semibold rounded-lg text-sm hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creatingText ? 'Criando...' : 'Criar Conteúdo'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTextModalOpen(false);
                    setTextTitulo('');
                    setTextContent('');
                  }}
                  className="px-6 py-2.5 text-neutral-400 hover:text-white font-medium text-sm transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Conteúdo de Texto */}
      {editTextModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={handleCloseEditText}
        >
          <div
            className="relative w-full max-w-3xl bg-[#0a0a0a] border border-neutral-800 rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
              <h3 className="text-lg font-bold text-white">Editar Conteúdo</h3>
              <button
                onClick={handleCloseEditText}
                className="p-1 text-neutral-500 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Título</label>
                <input
                  type="text"
                  value={editTextTitulo}
                  onChange={(e) => setEditTextTitulo(e.target.value)}
                  placeholder="Título do conteúdo"
                  className="w-full px-4 py-2.5 bg-[#050505] border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/30 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Conteúdo</label>
                <RichTextEditor
                  content={editTextContent}
                  onChange={setEditTextContent}
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleSaveEditText}
                  disabled={!editTextTitulo.trim()}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B87333] text-black font-semibold rounded-lg text-sm hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={handleCloseEditText}
                  className="px-6 py-2.5 text-neutral-400 hover:text-white font-medium text-sm transition-colors"
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

interface ConteudoCardProps {
  conteudo: Conteudo;
  index: number;
  total: number;
  editingTitleId: string | null;
  editingTitleValue: string;
  syncing: boolean;
  onMoveUp: (index: number, direction: 'up' | 'down') => void;
  onMoveDown: (index: number, direction: 'up' | 'down') => void;
  onStartEditTitle: (conteudo: Conteudo) => void;
  onSaveTitle: (id: string) => void;
  onEditingTitleChange: (value: string) => void;
  onCancelEditTitle: () => void;
  onWatchVideo: (conteudo: Conteudo) => void;
  onWatchText: (conteudo: Conteudo) => void;
  onEditText: (conteudo: Conteudo) => void;
  onSync: (conteudo: Conteudo) => void;
  onDelete: (conteudo: Conteudo) => void;
}

function ConteudoCard({
  conteudo,
  index,
  total,
  editingTitleId,
  editingTitleValue,
  syncing,
  onMoveUp,
  onMoveDown,
  onStartEditTitle,
  onSaveTitle,
  onEditingTitleChange,
  onCancelEditTitle,
  onWatchVideo,
  onWatchText,
  onEditText,
  onSync,
  onDelete,
}: ConteudoCardProps) {
  const dados = conteudo.dados as Record<string, unknown>;
  const isVideo = conteudo.tipo === 'video';
  const isTexto = conteudo.tipo === 'texto';

  return (
    <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl overflow-hidden hover:border-neutral-700 transition-all">
      <div className="p-4 flex items-start gap-4">
        <span className="text-sm font-bold text-[#D4AF37] min-w-[2rem] mt-0.5">
          #{conteudo.posicao}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs uppercase tracking-wider font-medium px-2 py-0.5 rounded ${
              isVideo ? 'bg-blue-900/30 text-blue-400' : 'bg-purple-900/30 text-purple-400'
            }`}>
              {isVideo ? <PiFilmStrip className="inline w-3 h-3 mr-1 -mt-0.5" /> : <PiFileText className="inline w-3 h-3 mr-1 -mt-0.5" />}
              {conteudo.tipo}
            </span>
            <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${
              isVideo ? statusBadgeColor(dados) : 'bg-green-900/30 text-green-400'
            }`}>
              {isVideo ? statusLabel(dados) : 'disponível'}
            </span>
            {isVideo && (
              <span className="text-xs text-neutral-500">
                {dados.duration
                  ? Math.round(Number(dados.duration)) > 60
                    ? `${Math.round(Number(dados.duration) / 60)}m`
                    : `${Math.round(Number(dados.duration))}s`
                  : ''}
              </span>
            )}
          </div>

          {editingTitleId === conteudo.id ? (
            <input
              type="text"
              value={editingTitleValue}
              onChange={(e) => onEditingTitleChange(e.target.value)}
              onBlur={() => onSaveTitle(conteudo.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSaveTitle(conteudo.id);
                if (e.key === 'Escape') onCancelEditTitle();
              }}
              autoFocus
              className="w-full px-3 py-1.5 mt-1.5 bg-[#050505] border border-[#D4AF37]/30 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4AF37]"
            />
          ) : (
            <h4
              className="font-medium text-white mt-1.5 truncate cursor-pointer hover:text-[#D4AF37] transition-colors"
              onClick={() => onStartEditTitle(conteudo)}
              title="Clique para editar o título"
            >
              {conteudo.titulo}
            </h4>
          )}

          {isVideo && (() => {
            const thumb = dados.thumbnailUrl;
            if (!thumb) return null;
            return (
              <img
                src={String(thumb)}
                alt={conteudo.titulo}
                className="mt-2 w-full max-w-xs h-20 object-cover rounded-lg border border-neutral-800"
              />
            );
          })()}
        </div>

        <div className="flex flex-col gap-1">
          {index > 0 && (
            <button
              onClick={() => onMoveUp(index, 'up')}
              className="p-1.5 text-neutral-600 hover:text-[#D4AF37] transition-colors"
              title="Mover para cima"
            >
              <PiCaretUp className="w-4 h-4" />
            </button>
          )}
          {index < total - 1 && (
            <button
              onClick={() => onMoveDown(index, 'down')}
              className="p-1.5 text-neutral-600 hover:text-[#D4AF37] transition-colors"
              title="Mover para baixo"
            >
              <PiCaretDown className="w-4 h-4" />
            </button>
          )}
          {isTexto ? (
            <button
              onClick={() => onEditText(conteudo)}
              className="p-1.5 text-neutral-600 hover:text-[#D4AF37] transition-colors"
              title="Editar conteúdo"
            >
              <MdEdit className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => onStartEditTitle(conteudo)}
              className="p-1.5 text-neutral-600 hover:text-[#D4AF37] transition-colors"
              title="Editar título"
            >
              <MdEdit className="w-4 h-4" />
            </button>
          )}
          {isTexto && (
            <button
              onClick={() => onWatchText(conteudo)}
              className="p-1.5 text-neutral-600 hover:text-blue-400 transition-colors"
              title="Visualizar conteúdo"
            >
              <PiEye className="w-4 h-4" />
            </button>
          )}
          {isVideo && dados.status === 'ready' && (
            <button
              onClick={() => onWatchVideo(conteudo)}
              className="p-1.5 text-neutral-600 hover:text-green-400 transition-colors"
              title="Assistir vídeo"
            >
              <PiPlay className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onSync(conteudo)}
            disabled={syncing}
            className="p-1.5 text-neutral-600 hover:text-blue-400 transition-colors disabled:opacity-50"
            title="Sincronizar status com Bunny"
          >
            <PiArrowsClockwise className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => onDelete(conteudo)}
            className="p-1.5 text-neutral-600 hover:text-red-400 transition-colors"
            title="Remover conteúdo"
          >
            <PiTrash className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function statusBadgeColor(dados: Record<string, unknown>): string {
  switch (dados.status) {
    case 'pending_upload': return 'bg-yellow-900/30 text-yellow-400 border border-yellow-900/30';
    case 'uploaded':
    case 'processing': return 'bg-blue-900/30 text-blue-400 border border-blue-900/30';
    case 'ready': return 'bg-green-900/30 text-green-400 border border-green-900/30';
    case 'error': return 'bg-red-900/30 text-red-400 border border-red-900/30';
    default: return 'bg-neutral-800 text-neutral-400 border border-neutral-700';
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
