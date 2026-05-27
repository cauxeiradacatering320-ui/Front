'use client';

import { use, useState, useCallback } from 'react';
import Link from 'next/link';
import { useModuloPublic } from '@/hooks/useModulos';
import {  formatPriceMask } from '@/utils/format';
import { useAuthStore } from '@/store/authStore';
import { apiRequest } from '@/services/api';

export default function ModuloDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: modulo, isLoading, error } = useModuloPublic(id);
  const { user, setAuth } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: '' // Incluindo senha para o caso de registro real
  });
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [authError, setAuthError] = useState('');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
          <p className="text-neutral-400">Carregando módulo...</p>
        </div>
      </div>
    );
  }

  if (error || !modulo) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">{error ? `Erro: ${error.message}` : 'Módulo não encontrado.'}</p>
          <Link href="/" className="inline-flex items-center gap-2 text-[#D4AF37] hover:underline">
            &larr; Voltar para a página inicial
          </Link>
        </div>
      </div>
    );
  }

  const sendToWhatsapp = () => {
    const msg = encodeURIComponent(
      `Olá, quero comprar o módulo "${modulo.titulo}"${modulo.preco_centavos ? ` - ${formatPriceMask(String(modulo.preco_centavos))}kz` : ''}`
    );
    window.open(`https://wa.me/244926608579?text=${msg}`, '_blank');
  };

  const handleComprar = () => {
    if (!user) {
      setIsModalOpen(true);
    } else {
      sendToWhatsapp();
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAuth(true);
    setAuthError('');

    try {
      const endpoint = isLoginMode ? '/auth/login' : '/auth/register';
      const payload = isLoginMode 
        ? { email: formData.email, senha: formData.senha }
        : { 
            nome: formData.nome, 
            email: formData.email, 
            telefone: formData.telefone,
            senha: formData.senha || 'senha123' // Fallback caso não seja obrigatório na UI, mas adicionado por precaução
          };

      const data = await apiRequest<any>(endpoint, 'POST', payload);
      
      if (data.accessToken && data.user) {
        setAuth(data.user, data.accessToken);
        setIsModalOpen(false);
        sendToWhatsapp();
      }
    } catch (err: any) {
      setAuthError(err.message || 'Erro de autenticação.');
    } finally {
      setLoadingAuth(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <Link href="/#modulos" className="text-sm text-[#D4AF37] hover:underline mb-6 inline-block">
        &larr; Voltar para a Landing Page
      </Link>

      <div className="bg-[#201f1f] rounded-2xl shadow-2xl border border-white/10 overflow-hidden text-white relative">
        {modulo.thumbnail_url ? (
          <div className="relative w-full h-80">
            <div className="absolute inset-0   z-10" />
            <img
              src={modulo.thumbnail_url}
              alt={modulo.titulo}
              className="w-full h-full object-cover opacity-60"
            />
          </div>
        ) : (
          <div className="w-full h-80 bg-neutral-900 flex items-center justify-center text-gray-500">
            Sem imagem
          </div>
        )}

        <div className="p-8 relative z-20 -mt-20">
          <h1 className="text-4xl font-bold mb-4">{modulo.titulo}</h1>

          <div className="flex flex-wrap items-center gap-4 mb-8">
            <span className="text-3xl font-bold text-[#D4AF37]">
              {modulo.gratuito ? 'Grátis' : `${formatPriceMask(String(modulo.preco_centavos))}KZ`}
            </span>
            {modulo.carga_horaria && (
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-neutral-400">
                {modulo.carga_horaria}h
              </span>
            )}
            {modulo.duracao_acesso_dias ? (
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-neutral-400">
                Acesso: {modulo.duracao_acesso_dias} dias
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-neutral-400">
                Acesso Vitalício
              </span>
            )}
            <button
              onClick={handleShare}
              className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all text-sm"
            >
              {copied ? (
                <>Copiado!</>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M15 8a3 3 0 10-2.977-2.633l-4.94 2.47a3 3 0 100 4.326l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.748l4.94-2.47A3 3 0 0015 8z" />
                  </svg>
                  Compartilhar
                </>
              )}
            </button>
          </div>

          <div className="prose prose-invert prose-sm max-w-none mb-10">
            <p className="text-neutral-300 leading-relaxed whitespace-pre-wrap text-lg">
              {modulo.descricao || 'Nenhuma descrição detalhada disponível para este módulo.'}
            </p>
          </div>

          <button
            onClick={handleComprar}
            className="w-full md:w-auto px-12 cursor-pointer py-4 bg-gradient-to-r from-[#D4AF37] to-[#B87333] text-black font-bold text-lg rounded-xl hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all transform active:scale-95"
          >
            {modulo.gratuito ? 'Acessar Agora' : 'Comprar Módulo'}
          </button>
        </div>
      </div>

      {/* Auth Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111] border border-white/10 p-8 rounded-2xl w-full max-w-md shadow-2xl relative text-white">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-500 hover:text-white"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-6">
              {isLoginMode ? 'Acesse sua Conta' : 'Crie sua Conta'}
            </h2>
            
            {authError && <p className="text-red-500 text-sm mb-4">{authError}</p>}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {!isLoginMode && (
                <>
                  <div>
                    <label className="block text-sm text-neutral-400 mb-1">Nome Completo</label>
                    <input 
                      required 
                      type="text" 
                      value={formData.nome}
                      onChange={e => setFormData({...formData, nome: e.target.value})}
                      className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#D4AF37] outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-400 mb-1">Telefone (WhatsApp)</label>
                    <input 
                      required 
                      type="text" 
                      value={formData.telefone}
                      onChange={e => setFormData({...formData, telefone: e.target.value})}
                      className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#D4AF37] outline-none" 
                    />
                  </div>
                </>
              )}
              
              <div>
                <label className="block text-sm text-neutral-400 mb-1">E-mail</label>
                <input 
                  required 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#D4AF37] outline-none" 
                />
              </div>

              <div>
                <label className="block text-sm text-neutral-400 mb-1">Senha</label>
                <input 
                  required 
                  type="password" 
                  value={formData.senha}
                  onChange={e => setFormData({...formData, senha: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#D4AF37] outline-none" 
                />
              </div>

              <button 
                type="submit" 
                disabled={loadingAuth}
                className="w-full py-3 bg-[#D4AF37] text-black font-bold rounded-lg hover:bg-[#B87333] transition-colors disabled:opacity-50"
              >
                {loadingAuth ? 'Processando...' : (isLoginMode ? 'Entrar e Continuar' : 'Criar Conta e Continuar')}
              </button>
            </form>

            <p className="text-center mt-6 text-sm text-neutral-400">
              {isLoginMode ? 'Não tem uma conta?' : 'Já possui uma conta?'}{' '}
              <button 
                type="button" 
                onClick={() => {
                  setIsLoginMode(!isLoginMode);
                  setAuthError('');
                }}
                className="text-[#D4AF37] hover:underline"
              >
                {isLoginMode ? 'Criar agora' : 'Fazer login'}
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
