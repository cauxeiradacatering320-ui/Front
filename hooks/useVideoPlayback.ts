'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchPlaybackUrl } from '@/services/conteudo';

export function useVideoPlayback(conteudoId: string | null) {
  return useQuery({
    queryKey: ['video-playback', conteudoId],
    queryFn: () => fetchPlaybackUrl(conteudoId!),
    enabled: !!conteudoId,
    refetchOnMount: 'always',
    staleTime: 4 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error.message.includes('403') || error.message.includes('não tem acesso')) return false;
      return failureCount < 2;
    },
  });
}
