'use client';

import type { Conteudo } from '@/types';

interface TextRendererProps {
  conteudo: Conteudo;
}

export function TextRenderer({ conteudo }: TextRendererProps) {
  const dados = conteudo.dados as { content?: string } | undefined;
  const content = dados?.content;

  if (!content) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <p className="text-gray-400">Conteúdo de texto vazio</p>
      </div>
    );
  }

  return (
    <div
      className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-img:rounded-lg prose-img:mx-auto prose-blockquote:border-l-blue-500 prose-blockquote:bg-gray-50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-gray-900 prose-pre:text-gray-100"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
