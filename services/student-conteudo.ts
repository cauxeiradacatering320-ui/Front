import { apiRequest } from './api';
import type { ConteudoComProgresso } from '@/types';

export async function fetchConteudosComProgresso(moduloId: string): Promise<ConteudoComProgresso[]> {
  return apiRequest<ConteudoComProgresso[]>(`/modulos/${moduloId}/conteudos`);
}

export async function marcarConteudoCompleto(moduloId: string, conteudoId: string): Promise<void> {
  await apiRequest(`/modulos/${moduloId}/conteudos/${conteudoId}/progresso`, 'POST');
}
