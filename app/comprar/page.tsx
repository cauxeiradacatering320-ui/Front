"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiCheck, FiShield, FiCreditCard } from "react-icons/fi";

export default function ComprarPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white flex flex-col pt-24 pb-16 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-[#D4AF37]/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 flex-1 flex flex-col items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-[#D4AF37]/30 text-[#D4AF37] text-sm mb-6">
            <FiShield className="w-4 h-4" /> Compra 100% Segura
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            Torne-se um <span className="text-[#D4AF37]">Mestre</span>
          </h1>
          <p className="text-neutral-400 text-lg font-light max-w-xl mx-auto">
            Acesso vitalício à maior plataforma de gastronomia online de Angola.
          </p>
        </motion.div>

        <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-2xl font-bold mb-6">Resumo do Pedido</h2>
              
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#1a1a1a] to-black border border-white/10 flex items-center justify-center text-[#D4AF37]">
                  <FiStarIcon />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Acesso Premium Completo</h3>
                  <p className="text-neutral-400 text-sm">Todos os +7 Módulos Inclusos</p>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  "Mais de 150 horas de conteúdo em 4K",
                  "Certificado de Conclusão Internacional",
                  "Comunidade exclusiva de alunos",
                  "Suporte direto com os Chefs",
                  "Acesso a novas aulas mensalmente"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-neutral-300 text-sm">
                    <div className="w-5 h-5 rounded-full bg-[#D4AF37]/20 flex items-center justify-center shrink-0">
                      <FiCheck className="w-3 h-3 text-[#D4AF37]" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex justify-between text-neutral-400 text-sm mb-2">
                <span>Subtotal</span>
                <span>AOA 250.000</span>
              </div>
              <div className="flex justify-between text-[#D4AF37] font-medium text-sm mb-6">
                <span>Desconto Especial (Lote 1)</span>
                <span>- AOA 50.000</span>
              </div>
              <div className="flex justify-between items-end border-t border-white/10 pt-4">
                <span className="text-lg font-medium">Total</span>
                <span className="text-4xl font-bold">AOA 200.000</span>
              </div>
            </div>
          </motion.div>

          {/* Checkout Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-gradient-to-br from-[#111] to-[#050505] border border-white/10 rounded-3xl p-8 relative"
          >
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-3xl pointer-events-none" />

            <h2 className="text-2xl font-bold mb-6 relative z-10">Dados de Pagamento</h2>
            
            <form className="space-y-4 relative z-10">
              <div className="space-y-2">
                <label className="text-sm text-neutral-400 ml-1">Nome Completo</label>
                <input 
                  type="text" 
                  placeholder="Seu nome" 
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-neutral-400 ml-1">E-mail</label>
                <input 
                  type="email" 
                  placeholder="seu@email.com" 
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
                />
              </div>

              <div className="space-y-2 pt-4">
                <label className="text-sm text-neutral-400 ml-1">Método de Pagamento</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-[#D4AF37] bg-[#D4AF37]/10 rounded-xl p-4 flex items-center justify-center gap-2 cursor-pointer text-[#D4AF37]">
                    <FiCreditCard /> Cartão
                  </div>
                  <div className="border border-white/10 bg-black rounded-xl p-4 flex items-center justify-center gap-2 cursor-pointer text-neutral-400 hover:border-white/30 transition-colors">
                    Multicaixa Express
                  </div>
                </div>
              </div>

              <button 
                type="button"
                className="w-full mt-8 py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B87333] text-black font-bold text-lg hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all transform active:scale-95"
              >
                Finalizar Compra
              </button>

              <p className="text-center text-xs text-neutral-600 mt-4 flex items-center justify-center gap-1">
                <FiShield /> Seus dados estão criptografados e seguros.
              </p>
            </form>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12"
        >
          <Link href="/" className="text-neutral-500 hover:text-white transition-colors text-sm underline underline-offset-4">
            Voltar para a página inicial
          </Link>
        </motion.div>
      </div>
    </main>
  );
}

function FiStarIcon() {
  return (
    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
  );
}
