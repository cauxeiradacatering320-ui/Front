'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { criarCompraManual, fetchMinhasCompras } from '@/services/compra';
import type { ItemCompra } from '@/services/compra';

export function useCriarCompraManual(usuarioId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itens: ItemCompra[]) => criarCompraManual(usuarioId, itens),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuario', 'acessos', usuarioId] });
      queryClient.invalidateQueries({ queryKey: ['usuario', 'acessos', 'disponiveis', usuarioId] });
    },
  });
}

export function useMinhasCompras() {
  return useQuery({
    queryKey: ['minhas-compras'],
    queryFn: fetchMinhasCompras,
  });
}
