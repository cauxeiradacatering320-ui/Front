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
      <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-8 text-center">
        <p className="text-neutral-500">Conteúdo de texto vazio</p>
      </div>
    );
  }

  return (
    <div
      className="prose prose-sm max-w-none prose-headings:text-white prose-p:text-neutral-300 prose-a:text-[#D4AF37] prose-a:underline hover:prose-a:text-[#B87333] prose-img:rounded-lg prose-img:mx-auto prose-blockquote:border-l-[#D4AF37] prose-blockquote:bg-neutral-900/50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-strong:text-white prose-code:text-neutral-300 prose-code:bg-neutral-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-neutral-900 prose-pre:text-neutral-300 prose-li:text-neutral-300 prose-ol:text-neutral-300 prose-ul:text-neutral-300 prose-hr:border-neutral-800"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
