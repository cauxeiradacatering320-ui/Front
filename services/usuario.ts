import { apiRequest } from './api';
import type { User } from '@/types';

export interface CreateUsuarioData {
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
  role: 'admin' | 'produtor' | 'aluno';
}

export interface UpdateUsuarioData {
  nome: string;
  email: string;
  telefone: string | null;
  role: 'admin' | 'produtor' | 'aluno';
  ativo: boolean;
}

export async function fetchUsuariosAdmin(): Promise<User[]> {
  const data: any[] = await apiRequest('/admin/usuarios');
  return data.map((u) => ({
    id: u.id,
    nome: u.nome,
    email: u.email,
    telefone: u.telefone ?? null,
    role: u.role,
    ativo: u.ativo,
    criado_em: u.criado_em,
  }));
}

export async function fetchUsuarioAdmin(id: string): Promise<User> {
  const data: any = await apiRequest(`/admin/usuarios/${id}`);
  return {
    id: data.id,
    nome: data.nome,
    email: data.email,
    telefone: data.telefone ?? null,
    role: data.role,
    ativo: data.ativo,
    criado_em: data.criado_em,
  };
}

export async function createUsuario(data: CreateUsuarioData): Promise<User> {
  const result: any = await apiRequest('/admin/usuarios', 'POST', data);
  return {
    id: result.id,
    nome: result.nome,
    email: result.email,
    telefone: result.telefone ?? null,
    role: result.role,
    ativo: result.ativo,
    criado_em: result.criado_em,
  };
}

export async function updateUsuario(id: string, data: UpdateUsuarioData): Promise<User> {
  const result: any = await apiRequest(`/admin/usuarios/${id}`, 'PUT', data);
  return {
    id: result.id,
    nome: result.nome,
    email: result.email,
    telefone: result.telefone ?? null,
    role: result.role,
    ativo: result.ativo,
    criado_em: result.criado_em,
  };
}

export async function toggleUsuarioActive(id: string): Promise<User> {
  const result: any = await apiRequest(`/admin/usuarios/${id}/toggle-active`, 'PATCH');
  return {
    id: result.id,
    nome: result.nome,
    email: result.email,
    telefone: result.telefone ?? null,
    role: result.role,
    ativo: result.ativo,
    criado_em: result.criado_em,
  };
}

export async function deleteUsuario(id: string): Promise<void> {
  await apiRequest(`/admin/usuarios/${id}`, 'DELETE');
}
