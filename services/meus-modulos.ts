import { apiRequest } from './api';
import type { MeuModulo, Modulo } from '@/types';

export async function fetchMeusModulos(): Promise<MeuModulo[]> {
  return apiRequest<MeuModulo[]>('/meus-modulos');
}

export async function fetchRecomendados(): Promise<Modulo[]> {
  return apiRequest<Modulo[]>('/meus-modulos/recomendados');
}
