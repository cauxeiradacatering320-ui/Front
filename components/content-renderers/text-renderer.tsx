'use client';

import type { Conteudo } from '@/types';

interface TextRendererProps {
  conteudo: Conteudo;
}

export function TextRenderer({ conteudo }: TextRendererProps) {
  return (
    <div className="prose max-w-none">
      <p className="text-gray-500">Conteúdo de texto (em breve)</p>
    </div>
  );
}
