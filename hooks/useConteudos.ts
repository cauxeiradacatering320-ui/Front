'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchConteudos,
  createVideoConteudo,
  updateConteudo,
  reorderConteudos,
  syncConteudoStatus,
  deleteConteudo,
} from '@/services/conteudo';
import type { Conteudo, UpdateConteudoData, VideoDados } from '@/types';

function needsPolling(conteudos: Conteudo[]): boolean {
  return conteudos.some((c) => {
    if (c.tipo !== 'video') return false;
    const dados = c.dados as VideoDados;
    return dados.status === 'pending_upload' || dados.status === 'processing' || dados.status === 'uploaded';
  });
}

export function useConteudos(moduloId: string) {
  return useQuery({
    queryKey: ['conteudos', moduloId],
    queryFn: () => fetchConteudos(moduloId),
    enabled: !!moduloId,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return false;
      return needsPolling(data) ? 5000 : false;
    },
  });
}

export function useCreateVideoConteudo(moduloId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (titulo: string) => createVideoConteudo(moduloId, titulo),
    onSuccess: (result) => {
      const { uploadUrl: _uploadUrl, ...conteudo } = result;
      queryClient.setQueryData<Conteudo[]>(['conteudos', moduloId], (old) =>
        old ? [...old, conteudo as Conteudo] : [conteudo as Conteudo]
      );
    },
  });
}

export function useUpdateConteudo(moduloId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateConteudoData }) =>
      updateConteudo(moduloId, id, data),
    onSuccess: (updatedConteudo) => {
      queryClient.setQueryData<Conteudo[]>(['conteudos', moduloId], (old) =>
        old ? old.map((c) => (c.id === updatedConteudo.id ? updatedConteudo : c)) : [updatedConteudo]
      );
    },
  });
}

export function useReorderConteudos(moduloId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderedIds: string[]) => reorderConteudos(moduloId, orderedIds),
    onSuccess: (conteudos) => {
      queryClient.setQueryData(['conteudos', moduloId], conteudos);
    },
  });
}

export function useSyncConteudoStatus(moduloId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => syncConteudoStatus(moduloId, id),
    onSuccess: (updatedConteudo) => {
      queryClient.setQueryData<Conteudo[]>(['conteudos', moduloId], (old) =>
        old ? old.map((c) => (c.id === updatedConteudo.id ? updatedConteudo : c)) : [updatedConteudo]
      );
    },
  });
}

export function useDeleteConteudo(moduloId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteConteudo(moduloId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conteudos', moduloId] });
    },
  });
}
