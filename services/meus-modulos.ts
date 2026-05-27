import { apiRequest } from './api';
import type { MeuModulo, Modulo } from '@/types';

export interface ModuloProgresso {
  id: string;
  titulo: string;
  thumbnail_url: string | null;
  total_aulas: number;
  aulas_completas: number;
}

export interface ProximaAula {
  conteudo_id: string;
  aula_titulo: string;
  posicao: number;
  modulo_id: string;
  modulo_titulo: string;
  thumbnail_url: string | null;
}

export interface StudentDashboardData {
  total_modulos: number;
  total_aulas: number;
  aulas_completas: number;
  porcentagem: number;
  proxima_aula: ProximaAula | null;
  modulos: ModuloProgresso[];
}

export async function fetchMeusModulos(): Promise<MeuModulo[]> {
  return apiRequest<MeuModulo[]>('/meus-modulos');
}

export async function fetchRecomendados(): Promise<Modulo[]> {
  return apiRequest<Modulo[]>('/meus-modulos/recomendados');
}

export async function fetchStudentDashboard(): Promise<StudentDashboardData> {
  return apiRequest<StudentDashboardData>('/meus-modulos/dashboard');
}
