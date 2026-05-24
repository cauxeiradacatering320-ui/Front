'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchAcessosUsuario,
  fetchModulosDisponiveis,
  createAcesso,
  updateAcesso,
  deleteAcesso,
} from '@/services/usuarioAcesso';

export function useAcessosUsuario(usuarioId: string) {
  return useQuery({
    queryKey: ['usuario', 'acessos', usuarioId],
    queryFn: () => fetchAcessosUsuario(usuarioId),
    enabled: !!usuarioId,
  });
}

export function useModulosDisponiveis(usuarioId: string) {
  return useQuery({
    queryKey: ['usuario', 'acessos', 'disponiveis', usuarioId],
    queryFn: () => fetchModulosDisponiveis(usuarioId),
    enabled: !!usuarioId,
  });
}

export function useCreateAcesso(usuarioId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { modulo_id: string; expira_em: string | null }) => createAcesso(usuarioId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuario', 'acessos', usuarioId] });
      queryClient.invalidateQueries({ queryKey: ['usuario', 'acessos', 'disponiveis', usuarioId] });
    },
  });
}

export function useUpdateAcesso(usuarioId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ acessoId, data }: { acessoId: string; data: { expira_em: string | null; status?: string } }) =>
      updateAcesso(usuarioId, acessoId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuario', 'acessos', usuarioId] });
    },
  });
}

export function useDeleteAcesso(usuarioId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (acessoId: string) => deleteAcesso(usuarioId, acessoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuario', 'acessos', usuarioId] });
      queryClient.invalidateQueries({ queryKey: ['usuario', 'acessos', 'disponiveis', usuarioId] });
    },
  });
}
