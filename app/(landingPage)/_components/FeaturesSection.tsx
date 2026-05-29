"use client";

import { motion } from "framer-motion";
import { FiBookOpen, FiAward, FiUsers, FiMonitor, FiSmartphone } from "react-icons/fi";

const features = [
  {
    title: "Aprendizagem\nCom Elegância",
    desc: "Conteúdo exclusivo com curadoria impecável.",
    icon: <FiBookOpen size={32} />
  },
  {
    title: "Certificado\nDe Participação",
    desc: "Reconhecimento para cada conquista.",
    icon: <FiAward size={32} />
  },
  {
    title: "Comunidade\nExclusiva",
    desc: "Mulheres que inspiram e transformam.",
    icon: <FiUsers size={32} />
  },
  {
    title: "Aulas\nEm Alta Qualidade",
    desc: "Experiência visual e prática refinada.",
    icon: <FiMonitor size={32} />
  },
  {
    title: "Acesso\nVitalício",
    desc: "Aprenda no seu tempo, para sempre.",
    icon: <FiSmartphone size={32} />
  }
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-[#f5f2eb] text-[#2c2c2c] w-full border-t border-[#e2dcc8]">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 divide-x divide-[#e2dcc8]">
          {features.map((feat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center px-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                className="text-[#cba774] mb-6"
              >
                {feat.icon}
              </motion.div>
              <h3 className="font-serif text-sm tracking-widest uppercase mb-3 whitespace-pre-line leading-relaxed">
                {feat.title}
              </h3>
              <p className="text-xs text-gray-500 font-light leading-relaxed max-w-[180px]">
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
