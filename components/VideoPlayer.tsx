'use client';

import { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { useVideoPlayback } from '@/hooks/useVideoPlayback';

interface VideoPlayerProps {
  conteudoId: string;
  poster?: string;
}

export function VideoPlayer({ conteudoId, poster }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { data, isLoading, error, refetch } = useVideoPlayback(conteudoId);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !data?.url) return;

    let hls: Hls | null = null;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = data.url;
    } else if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(data.url);
      hls.attachMedia(video);
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [data?.url]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleError = () => {
      const isAuthError =
        video.error?.message?.includes('403') ||
        video.error?.message?.includes('401');

      if (isAuthError) {
        refetch();
      }
    };

    video.addEventListener('error', handleError);
    return () => video.removeEventListener('error', handleError);
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Carregando vídeo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center p-6">
        <p className="text-red-400 text-sm text-center">
          {error.message.includes('não está pronto')
            ? 'Vídeo ainda está sendo processado.'
            : error.message.includes('não tem acesso')
            ? 'Você não tem acesso a este conteúdo.'
            : 'Erro ao carregar vídeo.'}
        </p>
      </div>
    );
  }

  return (
    <div className="aspect-video bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        className="w-full h-full"
        controls
        poster={poster}
        playsInline
      />
    </div>
  );
}
