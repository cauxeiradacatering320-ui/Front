'use client';

import type { Conteudo, VideoDados } from '@/types';
import { VideoPlayer } from '@/components/VideoPlayer';

interface VideoRendererProps {
  conteudo: Conteudo;
}

function isVideoDados(dados: unknown): dados is VideoDados {
  return (
    typeof dados === 'object' &&
    dados !== null &&
    'provider' in dados &&
    'videoId' in dados
  );
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending_upload: { label: 'Aguardando upload', color: 'bg-yellow-100 text-yellow-700' },
  uploaded: { label: 'Upload concluído, processando...', color: 'bg-blue-100 text-blue-700' },
  processing: { label: 'Processando...', color: 'bg-blue-100 text-blue-700' },
  ready: { label: 'Pronto', color: 'bg-green-100 text-green-700' },
  error: { label: 'Erro no processamento', color: 'bg-red-100 text-red-700' },
};

export function VideoRenderer({ conteudo }: VideoRendererProps) {
  if (!isVideoDados(conteudo.dados)) {
    return <p className="text-red-500">Dados de vídeo inválidos</p>;
  }

  const dados = conteudo.dados;
  const statusInfo = STATUS_LABELS[dados.status] || { label: dados.status, color: 'bg-gray-100 text-gray-700' };
  const isReady = dados.status === 'ready';

  if (!isReady) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center space-y-3">
        <div className="flex items-center justify-center gap-2">
          <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        </div>
        {(dados.status === 'uploaded' || dados.status === 'processing') && (
          <div className="flex justify-center">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    );
  }

  return <VideoPlayer conteudoId={conteudo.id} poster={dados.thumbnailUrl} />;
}
