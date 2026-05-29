"use client";

import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

export function CTASection() {
  return (
    <section className="py-24 bg-black text-[#e8e2d2] w-full relative overflow-hidden" id="comecar">
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "url('/imagemFundoHero.png')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/70"></div>

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center lg:justify-start mb-6 text-[#cba774]"
            >
              <span className="text-3xl font-serif">⚜</span>
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-serif leading-relaxed font-light italic">
              " Mais do que receitas,<br />
              ensinamos a arte de viver<br />
              e receber bem. "
            </h2>
            <div className="flex justify-center lg:justify-start mt-6 text-[#cba774]">
              <div className="flex items-center opacity-60">
                <div className="h-[1px] w-8 bg-[#cba774]"></div>
                <div className="w-1.5 h-1.5 rounded-full border border-[#cba774]"></div>
                <div className="h-[1px] w-8 bg-[#cba774]"></div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="lg:pl-16 lg:border-l border-[#cba774]/20 flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            <h3 className="text-xl tracking-widest uppercase font-medium mb-4 text-[#cba774]">
              Faça parte da academia
            </h3>
            <p className="text-lg font-light mb-2 text-white/80">Transforme o seu quotidiano.</p>
            <p className="text-lg font-light mb-10 text-white/80">Viva a arte de receber.</p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-4 px-10 py-4 bg-[#cba774] text-black font-semibold text-sm tracking-wider uppercase hover:bg-[#b5925d] transition-colors w-full sm:w-auto justify-center"
            >
              Quero Fazer Parte
              <FiArrowRight size={18} />
            </motion.button>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
