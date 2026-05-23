import { apiRequest, API_BASE } from './api';
import type { Conteudo, UpdateConteudoData } from '@/types';

async function authHeaders(): Promise<Record<string, string>> {
  const { useAuthStore } = await import('../store/authStore');
  const token = useAuthStore.getState().accessToken;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchConteudos(moduloId: string): Promise<Conteudo[]> {
  return apiRequest<Conteudo[]>(`/admin/modulos/${moduloId}/conteudos`);
}

export async function fetchConteudo(moduloId: string, id: string): Promise<Conteudo> {
  return apiRequest<Conteudo>(`/admin/modulos/${moduloId}/conteudos/${id}`);
}

export async function createVideoConteudo(
  moduloId: string,
  titulo: string
): Promise<Conteudo & { uploadUrl: string }> {
  return apiRequest<Conteudo & { uploadUrl: string }>(
    `/admin/modulos/${moduloId}/conteudos/video`,
    'POST',
    { titulo }
  );
}

export async function createTextConteudo(
  moduloId: string,
  titulo: string,
  content: string
): Promise<Conteudo> {
  return apiRequest<Conteudo>(
    `/admin/modulos/${moduloId}/conteudos/texto`,
    'POST',
    { titulo, content }
  );
}

export async function updateConteudo(
  moduloId: string,
  id: string,
  data: UpdateConteudoData
): Promise<Conteudo> {
  return apiRequest<Conteudo>(
    `/admin/modulos/${moduloId}/conteudos/${id}`,
    'PATCH',
    data
  );
}

export async function reorderConteudos(moduloId: string, orderedIds: string[]): Promise<Conteudo[]> {
  return apiRequest<Conteudo[]>(
    `/admin/modulos/${moduloId}/conteudos/reorder`,
    'PUT',
    { orderedIds }
  );
}

export async function syncConteudoStatus(moduloId: string, id: string): Promise<Conteudo> {
  return apiRequest<Conteudo>(
    `/admin/modulos/${moduloId}/conteudos/${id}/sync`,
    'POST'
  );
}

const BUNNY_ACCESS_KEY = process.env.NEXT_PUBLIC_BUNNY_ACCESS_KEY || "";

export async function uploadVideoToBunny(uploadUrl: string, file: File): Promise<void> {
  if (!BUNNY_ACCESS_KEY) {
    throw new Error('NEXT_PUBLIC_BUNNY_ACCESS_KEY não configurada');
  }

  const resp = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'AccessKey': BUNNY_ACCESS_KEY,
    },
    body: file,
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new Error(`Erro no upload: ${resp.status} ${text}`);
  }
}

export async function fetchPlaybackUrl(conteudoId: string): Promise<{ url: string }> {
  return apiRequest<{ url: string }>(`/videos/${conteudoId}/play`);
}

export async function deleteConteudo(moduloId: string, id: string): Promise<void> {
  const headers = await authHeaders();
  const resp = await fetch(`${API_BASE}/admin/modulos/${moduloId}/conteudos/${id}`, {
    method: 'DELETE',
    headers,
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ error: 'Erro ao deletar' }));
    throw new Error(err.error || 'Erro ao deletar');
  }
}
