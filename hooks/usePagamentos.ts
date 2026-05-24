'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchPagamentos, type PagamentoFiltros } from '@/services/pagamento';

export function usePagamentos(filtros?: PagamentoFiltros) {
  return useQuery({
    queryKey: ['pagamentos', 'admin', filtros],
    queryFn: () => fetchPagamentos(filtros),
  });
}
