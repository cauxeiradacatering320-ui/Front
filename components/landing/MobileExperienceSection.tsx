"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function MobileExperienceSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  return (
    <section ref={containerRef} className="py-32 bg-[#050505] text-white overflow-hidden relative">
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div className="order-2 lg:order-1 relative h-[600px] flex justify-center items-center">
          {/* Floating Mobile Mockups */}
          <motion.div 
            style={{ y: y1 }}
            className="absolute left-[10%] w-[240px] h-[500px] rounded-[2.5rem] border-[6px] border-[#1a1a1a] bg-black shadow-2xl overflow-hidden z-10"
          >
            {/* Phone Screen Mockup */}
            <div className="absolute top-0 w-full h-6 bg-black rounded-b-3xl flex justify-center">
              <div className="w-20 h-4 bg-[#1a1a1a] rounded-b-2xl" />
            </div>
            <div className="pt-8 px-4 h-full flex flex-col gap-4">
              <div className="w-full aspect-video bg-[#1a1a1a] rounded-xl border border-white/5" />
              <div className="w-3/4 h-6 bg-white/5 rounded-md" />
              <div className="w-1/2 h-4 bg-white/5 rounded-md" />
              <div className="flex-1 rounded-t-2xl bg-gradient-to-t from-white/10 to-transparent border-t border-white/5" />
            </div>
          </motion.div>

          <motion.div 
            style={{ y: y2 }}
            className="absolute right-[10%] top-[10%] w-[220px] h-[460px] rounded-[2.5rem] border-[6px] border-[#1a1a1a] bg-black shadow-2xl opacity-60 scale-90 overflow-hidden"
          >
            {/* Secondary Phone Mockup */}
             <div className="pt-8 px-4 h-full flex flex-col gap-4">
              <div className="w-full h-12 bg-white/5 rounded-xl border border-white/5" />
              <div className="w-full h-12 bg-white/5 rounded-xl border border-white/5" />
              <div className="w-full h-12 bg-white/5 rounded-xl border border-white/5" />
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="order-1 lg:order-2"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            App Nativo
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            A Academia Caxueirada <br />
            <span className="text-neutral-500">no seu bolso.</span>
          </h2>
          <p className="text-xl text-neutral-400 mb-8 font-light leading-relaxed">
            Nossa plataforma foi desenhada com tecnologia PWA para oferecer a melhor experiência mobile do mercado. Assista aulas no trânsito, na cozinha ou onde estiver com a fluidez de um aplicativo premium.
          </p>
          <ul className="space-y-4">
            {['Player Otimizado para Mobile', 'Dashboard Intuitivo', 'Acompanhamento de Progresso'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-neutral-300">
                <div className="w-6 h-6 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] text-sm">✓</div>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
