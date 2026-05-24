'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchConteudosComProgresso, marcarConteudoCompleto } from '@/services/student-conteudo';

export function useConteudosComProgresso(moduloId: string) {
  return useQuery({
    queryKey: ['conteudos', 'progresso', moduloId],
    queryFn: () => fetchConteudosComProgresso(moduloId),
    enabled: !!moduloId,
  });
}

export function useMarcarCompleto(moduloId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conteudoId: string) => marcarConteudoCompleto(moduloId, conteudoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conteudos', 'progresso', moduloId] });
    },
  });
}
