"use client";

import { motion } from "framer-motion";

export function ExperienceSection() {
  return (
    <section className="relative py-32 bg-[#020202] text-white overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-[#D4AF37]/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Experiência <span className="text-[#D4AF37] italic font-serif">Fine Dining</span> Digital
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto font-light">
            Navegue por uma interface desenhada com a mesma precisão de um chef premiado. 
            Uma plataforma imersiva estilo Netflix e Apple TV, focada na alta gastronomia.
          </p>
        </motion.div>

        {/* Dashboard Mockup */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, rotateX: 10 }}
          whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, type: "spring", bounce: 0.2 }}
          style={{ transformPerspective: 1200 }}
          className="relative max-w-5xl mx-auto rounded-3xl border border-white/10 bg-gradient-to-b from-[#111] to-[#050505] p-2 md:p-4 shadow-2xl shadow-black"
        >
          {/* Top Bar Fake */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
            <div className="ml-auto px-4 py-1 rounded-full bg-white/5 text-xs text-neutral-400 border border-white/5">
              Academia Caxueirada Platform
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-2 md:p-6">
            {/* Sidebar Fake */}
            <div className="hidden md:flex flex-col gap-4 border-r border-white/5 pr-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={`h-10 rounded-lg ${i === 1 ? 'bg-gradient-to-r from-[#D4AF37]/20 to-transparent border-l-2 border-[#D4AF37]' : 'bg-white/5'} transition-colors`} />
              ))}
            </div>

            {/* Main Content Fake */}
            <div className="col-span-3 space-y-6">
              <div className="w-full aspect-video rounded-xl bg-[#1a1a1a] border border-white/5 overflow-hidden relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                <div className="absolute bottom-6 left-6 z-20">
                  <h3 className="text-2xl font-bold mb-2">Masterclass: Sobremesas Francesas</h3>
                  <div className="flex items-center gap-3 text-sm text-neutral-400">
                    <span className="px-2 py-1 rounded bg-[#D4AF37]/20 text-[#D4AF37]">Novo</span>
                    <span>1h 45m</span>
                    <span>Chef Maria</span>
                  </div>
                </div>
                {/* Play Button Hover */}
                <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-white border-b-[10px] border-b-transparent ml-2" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-video rounded-lg bg-[#111] border border-white/5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 text-sm font-medium">Aula {i}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
