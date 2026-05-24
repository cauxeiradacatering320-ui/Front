import { apiRequest } from './api';
import type { Modulo } from '@/types';

export interface AcessoModulo {
  id: string;
  usuario_id: string;
  modulo_id: string;
  compra_id: string | null;
  status: 'ativo' | 'expirado' | 'cancelado' | 'bloqueado';
  iniciado_em: string;
  expira_em: string | null;
  criado_em: string;
  origem_acesso: string;
  modulo_titulo: string;
  modulo_duracao_acesso_dias: number | null;
}

export async function fetchAcessosUsuario(usuarioId: string): Promise<AcessoModulo[]> {
  return apiRequest<AcessoModulo[]>(`/admin/usuarios/${usuarioId}/acessos`);
}

export async function fetchModulosDisponiveis(usuarioId: string): Promise<Modulo[]> {
  return apiRequest<Modulo[]>(`/admin/usuarios/${usuarioId}/acessos/disponiveis`);
}

export async function createAcesso(usuarioId: string, data: { modulo_id: string; expira_em: string | null }): Promise<AcessoModulo> {
  return apiRequest<AcessoModulo>(`/admin/usuarios/${usuarioId}/acessos`, 'POST', data);
}

export async function updateAcesso(usuarioId: string, acessoId: string, data: { expira_em: string | null; status?: string }): Promise<AcessoModulo> {
  return apiRequest<AcessoModulo>(`/admin/usuarios/${usuarioId}/acessos/${acessoId}`, 'PUT', data);
}

export async function deleteAcesso(usuarioId: string, acessoId: string): Promise<void> {
  await apiRequest(`/admin/usuarios/${usuarioId}/acessos/${acessoId}`, 'DELETE');
}
