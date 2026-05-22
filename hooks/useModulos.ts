'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchModulosAdmin,
  fetchModulosPublic,
  fetchModuloAdmin,
  fetchModuloPublic,
  createModulo,
  updateModulo,
  uploadThumbnail,
} from '@/services/modulo';
import type { CreateModuloData, UpdateModuloData } from '@/types';

export function useModulosAdmin() {
  return useQuery({
    queryKey: ['modulos', 'admin'],
    queryFn: fetchModulosAdmin,
  });
}

export function useModulosPublic() {
  return useQuery({
    queryKey: ['modulos', 'public'],
    queryFn: fetchModulosPublic,
  });
}

export function useModuloAdmin(id: string) {
  return useQuery({
    queryKey: ['modulo', 'admin', id],
    queryFn: () => fetchModuloAdmin(id),
    enabled: !!id,
  });
}

export function useModuloPublic(id: string) {
  return useQuery({
    queryKey: ['modulo', 'public', id],
    queryFn: () => fetchModuloPublic(id),
    enabled: !!id,
  });
}

export function useCreateModulo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, file }: { data: CreateModuloData; file?: File }) => createModulo(data, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modulos', 'admin'] });
    },
  });
}

export function useUpdateModulo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateModuloData }) => updateModulo(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['modulo', 'admin', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['modulos', 'admin'] });
    },
  });
}

export function useUploadThumbnail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ moduloId, file }: { moduloId: string; file: File }) =>
      uploadThumbnail(moduloId, file),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['modulo', 'admin', variables.moduloId] });
      queryClient.invalidateQueries({ queryKey: ['modulos', 'admin'] });
    },
  });
}
