"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505] text-white pt-20">
      {/* Dynamic Background Glow */}
      <motion.div 
        className="absolute w-[800px] h-[800px] rounded-full blur-[120px] opacity-30 pointer-events-none"
        animate={{
          x: mousePosition.x - 400,
          y: mousePosition.y - 400,
        }}
        transition={{ type: "tween", ease: "backOut", duration: 1.5 }}
        style={{
          background: "radial-gradient(circle, rgba(212,175,55,0.4) 0%, rgba(184,115,51,0.1) 50%, rgba(0,0,0,0) 70%)"
        }}
      />

      <div className="container relative z-10 mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="max-w-2xl"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-block px-4 py-1.5 mb-6 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 backdrop-blur-md text-[#D4AF37] text-sm font-medium tracking-wider uppercase"
          >
            A Maior de Angola
          </motion.div>
          
          <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white via-neutral-200 to-neutral-500">
            A Escola de Gastronomia Online <br className="hidden lg:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#D4AF37] to-[#B87333]">Mais Completa</span>
          </h1>
          
          <p className="text-lg lg:text-xl text-neutral-400 mb-10 leading-relaxed font-light">
            Arte, sabor e exclusividade. Transforme sua paixão em status com a experiência educacional mais sofisticada de Angola.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(212,175,55,0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B87333] text-black font-semibold text-lg transition-all"
            >
              Começar Jornada
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-xl border border-white/10 text-white font-semibold text-lg backdrop-blur-sm transition-all"
            >
              Explorar Módulos
            </motion.button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="relative perspective-1000"
        >
          {/* Floating Image / Mockup placeholder */}
          <motion.div 
            animate={{ 
              y: [0, -20, 0],
              rotateX: [0, 5, 0],
              rotateY: [0, -5, 0]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-full aspect-square rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-2xl shadow-2xl"
          >
            <div className="absolute inset-0 flex items-center justify-center text-neutral-600 font-light">
              <span className="text-sm border border-neutral-800 px-4 py-2 rounded-full">Mockup 3D App & Chef</span>
            </div>
            
            {/* Glossy Reflection overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-50 pointer-events-none" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
