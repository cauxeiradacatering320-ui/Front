"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function FinancialProjectionSection() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => (prev < 100 ? prev + 1 : 100));
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-32 bg-[#020202] text-white relative border-t border-white/5">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Um Investimento de <span className="text-[#D4AF37]">Alto Retorno</span>
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            A gastronomia é um dos mercados que mais cresce em Angola. Capacite-se e transforme seu conhecimento em um negócio altamente rentável.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#111] to-[#050505] rounded-3xl border border-white/10 p-8 shadow-[0_0_50px_rgba(212,175,55,0.05)]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 space-y-8">
              <div>
                <div className="text-sm text-neutral-400 mb-1">Crescimento do Setor</div>
                <div className="text-5xl font-bold text-[#D4AF37]">+{count}%</div>
              </div>
              <div className="space-y-4">
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "85%" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-[#B87333] to-[#D4AF37]" 
                  />
                </div>
                <div className="flex justify-between text-xs text-neutral-500">
                  <span>Demanda por Profissionais</span>
                  <span>Alta</span>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full relative">
              {/* Fake animated chart */}
              <div className="aspect-[4/3] rounded-xl bg-black border border-white/10 p-4 relative overflow-hidden flex items-end gap-2">
                {[40, 60, 45, 80, 65, 100].map((height, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${height}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="flex-1 bg-gradient-to-t from-[#D4AF37]/20 to-[#D4AF37]/80 rounded-t-sm"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
