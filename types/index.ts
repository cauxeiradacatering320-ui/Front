export interface User {
  id: string;
  nome: string;
  email: string;
  telefone?: string | null;
  role: 'admin' | 'produtor' | 'aluno';
  ativo?: boolean;
  criado_em?: string;
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
  carga_horaria: number | null;
  status: 'rascunho' | 'publicado' | 'arquivado';
  criado_em: string;
  atualizado_em: string;
  deletado_em: string | null;
  total_alunos?: number;
}

export interface CreateModuloData {
  titulo: string;
  descricao?: string;
  preco_centavos: number;
  gratuito: boolean;
  duracao_acesso_dias?: number;
  carga_horaria?: number;
  status: 'rascunho' | 'publicado' | 'arquivado';
}

export interface UpdateModuloData {
  titulo: string;
  descricao: string | null;
  preco_centavos: number;
  gratuito: boolean;
  duracao_acesso_dias: number | null;
  carga_horaria: number | null;
  status: 'rascunho' | 'publicado' | 'arquivado';
}

export interface UpdateConteudoData {
  titulo?: string;
  content?: string;
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

export interface TextoDados {
  content: string;
}

export interface MeuModulo extends Modulo {
  acesso_id: string;
  acesso_status: string;
  iniciado_em: string;
  expira_em: string | null;
  origem_acesso: string;
}

export interface ConteudoComProgresso extends Conteudo {
  progresso_id: string | null;
  progresso_completo: boolean | null;
  progresso_porcentagem: number | null;
  progresso_completado_em: string | null;
}

export interface Certificado {
  id: string;
  usuario_id: string;
  nome: string;
  modulo_id: string;
  codigo: string;
  pdf_url: string | null;
  emitido_em: string;
  criado_em: string;
  modulo_titulo: string;
  modulo_carga_horaria: number | null;
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
