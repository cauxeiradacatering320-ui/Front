export interface User {
  id: string;
  nome: string;
  email: string;
  role: 'admin' | 'produtor' | 'aluno';
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface Modulo {
  id: string;
  produtor_id: string;
  titulo: string;
  slug: string;
  descricao: string | null;
  thumbnail_url: string | null;
  preco_centavos: number;
  moeda: string;
  gratuito: boolean;
  duracao_acesso_dias: number | null;
  status: 'rascunho' | 'publicado' | 'arquivado';
  criado_em: string;
  atualizado_em: string;
  deletado_em: string | null;
}

export interface CreateModuloData {
  titulo: string;
  descricao?: string;
  preco_centavos: number;
  gratuito: boolean;
  duracao_acesso_dias?: number;
  status: 'rascunho' | 'publicado' | 'arquivado';
}

export interface UpdateModuloData {
  titulo: string;
  descricao: string | null;
  preco_centavos: number;
  gratuito: boolean;
  duracao_acesso_dias: number | null;
  status: 'rascunho' | 'publicado' | 'arquivado';
}

export interface UpdateConteudoData {
  titulo?: string;
}

export type TipoConteudo = 'video' | 'texto' | 'questao';

export interface VideoDados {
  provider: string;
  videoId: string;
  libraryId: string;
  thumbnailUrl: string;
  duration: number;
  status: string;
}

export interface Conteudo {
  id: string;
  modulo_id: string;
  tipo: TipoConteudo;
  titulo: string;
  posicao: number;
  preview: boolean;
  dados: VideoDados | Record<string, unknown>;
  criado_em: string;
  atualizado_em: string;
}
