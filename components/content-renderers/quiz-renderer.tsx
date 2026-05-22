'use client';

import type { Conteudo } from '@/types';

interface QuizRendererProps {
  conteudo: Conteudo;
}

export function QuizRenderer({ conteudo }: QuizRendererProps) {
  return (
    <div className="p-6 border border-dashed border-gray-300 rounded-lg">
      <p className="text-gray-500">Questão (em breve)</p>
    </div>
  );
}
