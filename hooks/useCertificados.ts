'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCertificados, verificarCertificado, gerarCertificado } from '@/services/certificado';

export function useCertificados() {
  return useQuery({
    queryKey: ['certificados'],
    queryFn: fetchCertificados,
  });
}

export function useVerificarCertificado(moduloId: string) {
  return useQuery({
    queryKey: ['certificado', moduloId],
    queryFn: () => verificarCertificado(moduloId),
    enabled: !!moduloId,
  });
}

export function useGerarCertificado() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ moduloId, nome }: { moduloId: string; nome: string }) =>
      gerarCertificado(moduloId, nome),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificados'] });
    },
  });
}
