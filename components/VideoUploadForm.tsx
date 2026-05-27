'use client';

import { useState } from 'react';
import { uploadVideoToBunny } from '@/services/conteudo';
import { useCreateVideoConteudo } from '@/hooks/useConteudos';

interface VideoUploadFormProps {
  moduloId: string;
}

export function VideoUploadForm({ moduloId }: VideoUploadFormProps) {
  const [titulo, setTitulo] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [error, setError] = useState('');
  const { mutateAsync: createConteudo, isPending: creating } = useCreateVideoConteudo(moduloId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!titulo.trim()) {
      setError('Título é obrigatório');
      return;
    }

    if (!file) {
      setError('Selecione um arquivo de vídeo');
      return;
    }

    try {
      setUploadProgress('Criando conteúdo...');
      const result = await createConteudo(titulo.trim());

      setUploadProgress('Enviando vídeo para Bunny...');
      await uploadVideoToBunny(result.uploadUrl, file);

      setUploadProgress('Upload concluído!');
      setTitulo('');
      setFile(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploadProgress(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-semibold text-lg text-white">Adicionar Vídeo</h3>

      {error && (
        <div className="p-3 bg-red-900/20 border border-red-900/30 text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-1.5">Título do vídeo</label>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
          placeholder="Ex: Introdução ao módulo"
          className="w-full px-4 py-2.5 bg-[#050505] border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/30 transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-1.5">Arquivo de vídeo</label>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          required
          className="block text-sm text-neutral-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#D4AF37]/10 file:text-[#D4AF37] hover:file:bg-[#D4AF37]/20 file:transition-colors"
        />
        <p className="text-xs text-neutral-600 mt-1">MP4, WebM, etc. Upload direto para Bunny.</p>
      </div>

      <button
        type="submit"
        disabled={creating || !!uploadProgress}
        className="px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B87333] text-black font-semibold rounded-lg text-sm hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {creating ? 'Criando...' : uploadProgress ? 'Enviando...' : 'Adicionar Vídeo'}
      </button>

      {uploadProgress && (
        <p className="text-sm text-[#D4AF37]">{uploadProgress}</p>
      )}
    </form>
  );
}
