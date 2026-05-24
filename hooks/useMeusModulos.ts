'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchMeusModulos, fetchRecomendados } from '@/services/meus-modulos';

export function useMeusModulos() {
  return useQuery({
    queryKey: ['meus-modulos'],
    queryFn: fetchMeusModulos,
  });
}

export function useRecomendados() {
  return useQuery({
    queryKey: ['meus-modulos', 'recomendados'],
    queryFn: fetchRecomendados,
  });
}
