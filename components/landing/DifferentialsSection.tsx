"use client";

import { motion } from "framer-motion";
import { FiAward, FiClock, FiUsers, FiVideo, FiStar } from "react-icons/fi";

const differentials = [
  { icon: FiVideo, title: "Aulas Práticas", desc: "Qualidade cinematográfica 4K" },
  { icon: FiStar, title: "Chefs Especialistas", desc: "Os maiores nomes do mercado" },
  { icon: FiAward, title: "Certificado Automático", desc: "Reconhecimento internacional" },
  { icon: FiClock, title: "Acesso 12 Meses", desc: "Aprenda no seu próprio ritmo" },
  { icon: FiUsers, title: "Comunidade Exclusiva", desc: "Networking de alto valor" },
];

export function DifferentialsSection() {
  return (
    <section className="py-32 bg-[#020202] text-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Padrão <span className="text-[#D4AF37]">Ouro</span> de Ensino
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {differentials.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-[#D4AF37]/10 group-hover:border-[#D4AF37]/30 transition-all duration-300">
                <item.icon className="text-2xl text-neutral-400 group-hover:text-[#D4AF37] transition-colors" />
              </div>
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-neutral-500 font-light">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
