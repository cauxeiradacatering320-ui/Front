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
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
      <h3 className="font-semibold text-lg">Adicionar Vídeo</h3>

      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm border border-red-100">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Título do vídeo</label>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
          placeholder="Ex: Introdução ao módulo"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Arquivo de vídeo</label>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          required
          className="block text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <p className="text-xs text-gray-400 mt-1">MP4, WebM, etc. Upload direto para Bunny.</p>
      </div>

      <button
        type="submit"
        disabled={creating || !!uploadProgress}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
      >
        {creating ? 'Criando...' : uploadProgress ? 'Enviando...' : 'Adicionar Vídeo'}
      </button>

      {uploadProgress && (
        <p className="text-sm text-blue-600">{uploadProgress}</p>
      )}
    </form>
  );
}
