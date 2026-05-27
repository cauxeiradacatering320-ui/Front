import { apiRequest } from './api';
import type { Certificado } from '@/types';

export async function fetchCertificados(): Promise<Certificado[]> {
  return apiRequest<Certificado[]>('/certificados');
}

export async function verificarCertificado(moduloId: string): Promise<{ certificado: Certificado | null }> {
  return apiRequest<{ certificado: Certificado | null }>(`/certificados/${moduloId}/verificar`);
}

export async function gerarCertificado(moduloId: string, nome: string): Promise<Certificado> {
  return apiRequest<Certificado>(`/certificados/${moduloId}/gerar`, 'POST', { nome });
}
