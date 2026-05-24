import { apiRequest } from './api';

export interface VendasPorModulo {
  titulo: string;
  total_vendas: number;
  faturamento: number;
}

export interface DashboardData {
  totalCursos: number;
  cursoMaisVendido: { titulo: string; total_vendas: number } | null;
  faturamentoTotal: number;
  totalAlunos: number;
  vendasPorModulo: VendasPorModulo[];
}

export async function fetchDashboardData(): Promise<DashboardData> {
  return apiRequest<DashboardData>('/admin/dashboard');
}
