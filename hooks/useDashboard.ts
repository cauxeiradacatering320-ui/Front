'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchDashboardData } from '@/services/dashboard';

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData,
    refetchInterval: 60_000,
  });
}
