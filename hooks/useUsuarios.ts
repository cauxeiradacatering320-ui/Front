'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchUsuariosAdmin,
  fetchUsuarioAdmin,
  createUsuario,
  updateUsuario,
  toggleUsuarioActive,
  deleteUsuario,
} from '@/services/usuario';
import type { CreateUsuarioData, UpdateUsuarioData } from '@/services/usuario';

export function useUsuariosAdmin() {
  return useQuery({
    queryKey: ['usuarios', 'admin'],
    queryFn: fetchUsuariosAdmin,
  });
}

export function useUsuarioAdmin(id: string) {
  return useQuery({
    queryKey: ['usuario', 'admin', id],
    queryFn: () => fetchUsuarioAdmin(id),
    enabled: !!id,
  });
}

export function useCreateUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUsuarioData) => createUsuario(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios', 'admin'] });
    },
  });
}

export function useUpdateUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUsuarioData }) => updateUsuario(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['usuario', 'admin', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['usuarios', 'admin'] });
    },
  });
}

export function useToggleUsuarioActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => toggleUsuarioActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios', 'admin'] });
    },
  });
}

export function useDeleteUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteUsuario(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios', 'admin'] });
    },
  });
}
