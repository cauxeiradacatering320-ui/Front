import { apiRequest, API_BASE } from './api';
import type { Modulo, CreateModuloData, UpdateModuloData } from '@/types';

async function authHeaders(): Promise<Record<string, string>> {
  const { useAuthStore } = await import('../store/authStore');
  const token = useAuthStore.getState().accessToken;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchModulosAdmin(): Promise<Modulo[]> {
  return apiRequest<Modulo[]>('/admin/modulos');
}

export async function fetchModulosPublic(): Promise<Modulo[]> {
  return apiRequest<Modulo[]>('/modulos');
}

export async function fetchModuloAdmin(id: string): Promise<Modulo> {
  return apiRequest<Modulo>(`/admin/modulos/${id}`);
}

export async function fetchModuloPublic(id: string): Promise<Modulo> {
  return apiRequest<Modulo>(`/modulos/${id}`);
}

export async function createModulo(
  data: CreateModuloData,
  file?: File
): Promise<Modulo> {
  const formData = new FormData();
  formData.append('titulo', data.titulo);
  if (data.descricao) formData.append('descricao', data.descricao);
  formData.append('preco_centavos', String(data.preco_centavos));
  formData.append('gratuito', String(data.gratuito));
  if (data.duracao_acesso_dias) formData.append('duracao_acesso_dias', String(data.duracao_acesso_dias));
  if (data.carga_horaria) formData.append('carga_horaria', String(data.carga_horaria));
  formData.append('status', data.status);
  if (file) formData.append('file', file);

  const headers = await authHeaders();

  const resp = await fetch(`${API_BASE}/admin/modulos`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ error: 'Erro ao criar módulo' }));
    throw new Error(err.error || 'Erro ao criar módulo');
  }

  return resp.json();
}

export async function updateModulo(id: string, data: UpdateModuloData): Promise<Modulo> {
  return apiRequest<Modulo>(`/admin/modulos/${id}`, 'PUT', data);
}

export async function deleteModulo(id: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/admin/modulos/${id}`, 'DELETE');
}

export async function uploadThumbnail(moduloId: string, file: File): Promise<{ thumbnail_url: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const headers = await authHeaders();

  const resp = await fetch(`${API_BASE}/admin/modulos/${moduloId}/thumbnail`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ error: 'Erro no upload' }));
    throw new Error(err.error || 'Erro no upload');
  }

  return resp.json();
}
