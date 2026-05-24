import { apiRequest } from './api';

export interface ItemCompra {
  modulo_id: string;
  preco_centavos: number;
}

export interface Compra {
  id: string;
  usuario_id: string;
  provider: string;
  transacao_provider_id: string | null;
  valor_pago_centavos: number;
  moeda: string;
  status: string;
  aprovado_em: string | null;
  criado_em: string;
  itens: {
    id: string;
    modulo_id: string;
    preco_pago_centavos: number;
    modulo_titulo: string;
    modulo_thumbnail?: string | null;
  }[];
}

export async function criarCompraManual(usuarioId: string, itens: ItemCompra[]): Promise<Compra> {
  return apiRequest<Compra>(`/admin/usuarios/${usuarioId}/compras/manual`, 'POST', { itens });
}

export async function fetchMinhasCompras(): Promise<Compra[]> {
  return apiRequest<Compra[]>('/minhas-compras');
}
