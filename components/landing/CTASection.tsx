"use client";

import { motion } from "framer-motion";

export function CTASection() {
  return (
    <section className="relative py-40 bg-black text-white overflow-hidden flex items-center justify-center">
      {/* Epic background elements */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#B87333]/10 blur-[100px] pointer-events-none"
        />
      </div>

      {/* Floating Particles Placeholder */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 pointer-events-none mix-blend-overlay" />

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400">
            Seja Sócio da <span className="text-[#D4AF37]">Maior</span> Escola <br className="hidden md:block" />
            de Gastronomia Online de Angola.
          </h2>
          
          <p className="text-xl text-neutral-400 mb-12 font-light max-w-2xl mx-auto">
            Vagas limitadas para a primeira turma. Garanta seu acesso vitalício às atualizações e torne-se um mestre na arte da culinária.
          </p>

          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(212,175,55,0.6)" }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B87333] text-black font-bold text-xl uppercase tracking-widest transition-all relative overflow-hidden group"
          >
            <span className="relative z-10">Entrar Agora</span>
            <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-out skew-x-12" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
