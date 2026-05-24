import { apiRequest } from './api';

export interface Pagamento {
  id: string;
  usuario_id: string;
  cliente_nome: string;
  cliente_email: string;
  provider: string;
  transacao_provider_id: string | null;
  valor_pago_centavos: number;
  moeda: string;
  status: string;
  aprovado_em: string | null;
  criado_em: string;
  modulos: string;
}

export interface PagamentosResponse {
  pagamentos: Pagamento[];
  totalCentavos: number;
  total: number;
}

export interface PagamentoFiltros {
  dataInicio?: string;
  dataFim?: string;
  cliente?: string;
}

export async function fetchPagamentos(filtros?: PagamentoFiltros): Promise<PagamentosResponse> {
  const params = new URLSearchParams();
  if (filtros?.dataInicio) params.set('dataInicio', filtros.dataInicio);
  if (filtros?.dataFim) params.set('dataFim', filtros.dataFim);
  if (filtros?.cliente) params.set('cliente', filtros.cliente);

  const qs = params.toString();
  return apiRequest<PagamentosResponse>(`/admin/pagamentos${qs ? `?${qs}` : ''}`);
}
