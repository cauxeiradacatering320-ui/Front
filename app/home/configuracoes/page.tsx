'use client';

import { useAuthStore } from '@/store/authStore';
import { apiRequest } from '@/services/api';
import { useState, useCallback } from 'react';
import { mascaraTelefone } from '@/utils/format';

const paises = [
  { codigo: '244', label: '+244 (Angola)' },
  { codigo: '55', label: '+55 (Brasil)' },
];

export default function StudentConfig() {
  const { user, setAuth, accessToken } = useAuthStore();

  const [nome, setNome] = useState(user?.nome || '');
  const [email, setEmail] = useState(user?.email || '');

  const telInicial = user?.telefone || '';
  const paisInicial = paises.find((p) => telInicial.startsWith(p.codigo));
  const codigoInicial = paisInicial?.codigo || '244';
  const [codigoPais, setCodigoPais] = useState(codigoInicial);
  const [telefone, setTelefone] = useState(
    paisInicial ? telInicial.slice(codigoInicial.length) : telInicial
  );

  const handleSelectPais = useCallback((codigo: string) => {
    setCodigoPais(codigo);
  }, []);

  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [saving, setSaving] = useState(false);
  const [savingSenha, setSavingSenha] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [msgSenha, setMsgSenha] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const telefoneCompleto = codigoPais + telefone;

  const handleSalvarPerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    try {
      const body: Record<string, string> = {};
      if (nome !== user?.nome) body.nome = nome;
      if (email !== user?.email) body.email = email;
      if (telefoneCompleto !== (user?.telefone || '')) body.telefone = telefoneCompleto;

      if (Object.keys(body).length === 0) {
        setMsg({ type: 'error', text: 'Nenhum dado foi alterado.' });
        setSaving(false);
        return;
      }

      const data = await apiRequest<{ user: { id: string; nome: string; email: string; telefone: string | null; role: 'admin' | 'produtor' | 'aluno' } }>(
        '/auth/me', 'PUT', body
      );

      setAuth(data.user, accessToken!);
      setMsg({ type: 'success', text: 'Perfil atualizado com sucesso!' });
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleAlterarSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsgSenha(null);

    if (novaSenha !== confirmarSenha) {
      setMsgSenha({ type: 'error', text: 'As novas senhas não coincidem.' });
      return;
    }

    if (novaSenha.length < 6) {
      setMsgSenha({ type: 'error', text: 'A nova senha deve ter no mínimo 6 caracteres.' });
      return;
    }

    setSavingSenha(true);

    try {
      await apiRequest('/auth/change-password', 'POST', {
        senha_atual: senhaAtual,
        nova_senha: novaSenha,
      });

      setMsgSenha({ type: 'success', text: 'Senha alterada com sucesso! Faça login novamente.' });
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');

      setTimeout(() => {
        useAuthStore.getState().clearAuth();
        window.location.href = '/login';
      }, 2000);
    } catch (err: any) {
      setMsgSenha({ type: 'error', text: err.message });
    } finally {
      setSavingSenha(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Configurações</h1>
        <p className="text-neutral-400 mt-1">Gerencie suas informações pessoais e segurança.</p>
      </div>

      {/* Perfil */}
      <form onSubmit={handleSalvarPerfil} className="bg-[#0a0a0a] border border-[#D4AF37]/10 rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[#D4AF37]/10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-[#B87333]/10 flex items-center justify-center border border-[#D4AF37]/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-white">Dados do Perfil</h2>
        </div>

        {msg && (
          <div className={`px-4 py-3 rounded-lg text-sm ${
            msg.type === 'success'
              ? 'bg-green-900/20 text-green-400 border border-green-900/30'
              : 'bg-red-900/20 text-red-400 border border-red-900/30'
          }`}>
            {msg.text}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-neutral-300">Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#121212] border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/20 transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-neutral-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#121212] border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/20 transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-neutral-300">Telefone</label>
            <div className="flex gap-2">
              <select
                value={codigoPais}
                onChange={(e) => handleSelectPais(e.target.value)}
                className="w-28 shrink-0 px-3 py-2.5 bg-[#121212] border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/20 transition-all appearance-none"
              >
                {paises.map((p) => (
                  <option key={p.codigo} value={p.codigo}>{p.label}</option>
                ))}
              </select>
              <input
                type="text"
                value={mascaraTelefone(telefone)}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="000 000 000"
                className="flex-1 px-4 py-2.5 bg-[#121212] border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/20 transition-all"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B87333] text-black font-semibold rounded-lg text-sm hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving && (
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            )}
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>

      {/* Senha */}
      <form onSubmit={handleAlterarSenha} className="bg-[#0a0a0a] border border-[#D4AF37]/10 rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[#D4AF37]/10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-[#B87333]/10 flex items-center justify-center border border-[#D4AF37]/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-white">Alterar Senha</h2>
        </div>

        {msgSenha && (
          <div className={`px-4 py-3 rounded-lg text-sm ${
            msgSenha.type === 'success'
              ? 'bg-green-900/20 text-green-400 border border-green-900/30'
              : 'bg-red-900/20 text-red-400 border border-red-900/30'
          }`}>
            {msgSenha.text}
          </div>
        )}

        <div className="max-w-md space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-neutral-300">Senha Atual</label>
            <input
              type="password"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#121212] border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/20 transition-all"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-neutral-300">Nova Senha</label>
            <input
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#121212] border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/20 transition-all"
              required
              minLength={6}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-neutral-300">Confirmar Nova Senha</label>
            <input
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#121212] border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/20 transition-all"
              required
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={savingSenha}
            className="px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B87333] text-black font-semibold rounded-lg text-sm hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {savingSenha && (
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            )}
            {savingSenha ? 'Alterando...' : 'Alterar Senha'}
          </button>
        </div>
      </form>
    </div>
  );
}
