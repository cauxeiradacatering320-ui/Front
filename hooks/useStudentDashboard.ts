'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchStudentDashboard } from '@/services/meus-modulos';

export function useStudentDashboard() {
  return useQuery({
    queryKey: ['student-dashboard'],
    queryFn: fetchStudentDashboard,
  });
}
