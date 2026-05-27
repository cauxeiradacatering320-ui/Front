"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { useModulosPublic } from "@/hooks/useModulos";

export function ModulesSection() {
  const { data: modulos, isLoading, error } = useModulosPublic();

  // Se houver erro, podemos omitir a seção ou mostrar fallback
  if (error) return null;

  const validModulos = modulos || [];
  const displayedModules = validModulos.slice(0, 4);
  const hasMore = validModulos.length > 4;

  return (
    <section id="modulos" className="py-32 bg-[#050505] text-white relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-20">
          <motion.h2 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Módulos <span className="text-[#D4AF37]">Premium</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-neutral-400 text-lg max-w-xl"
          >
            Uma jornada meticulosamente desenhada para elevar seu nível na cozinha.
          </motion.p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {validModulos.length === 0 ? (
              <p className="text-gray-500 text-center py-12">Nenhum módulo disponível no momento.</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                {displayedModules.map((mod: any, i: number) => (
                  <Link href={`/modulos/${mod.id}`} key={mod.id}>
                    <ModuleCard module={mod} index={i} />
                  </Link>
                ))}
              </div>
            )}
            
            {hasMore && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="mt-16 flex justify-center"
              >
                <Link href="/comprar" passHref>
                  <motion.button 
                    whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(212,175,55,0.3)" }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-4 rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/10 text-[#D4AF37] font-semibold tracking-wider uppercase backdrop-blur-md transition-all hover:bg-[#D4AF37]/20"
                  >
                    Ver Todos os Módulos
                  </motion.button>
                </Link>
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function ModuleCard({ module, index }: { module: any, index: number }) {
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group h-80 rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0a] cursor-pointer"
    >
      <motion.div
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: isHovered 
            ? `radial-gradient(400px circle at ${hoverPosition.x}px ${hoverPosition.y}px, rgba(212,175,55,0.15), transparent 40%)` 
            : "",
        }}
      />

      {module.thumbnail_url ? (
         <img 
            src={module.thumbnail_url} 
            alt={module.titulo}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-50 group-hover:opacity-70"
         />
      ) : (
        <div className="absolute inset-0 bg-neutral-900 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-40 opacity-20" />
      )}
      
      <div className="relative z-10 p-8 h-full flex flex-col justify-end bg-gradient-to-t from-black via-black/80 to-transparent">
        <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          {module.gratuito ? (
            <span className="text-[#D4AF37] text-xs font-bold tracking-widest uppercase mb-2 block">
              Gratuito
            </span>
          ) : (
             <span className="text-[#D4AF37] text-xs font-bold tracking-widest uppercase mb-2 block">
              Premium
            </span>
          )}
          <h3 className="text-2xl font-bold mb-1 line-clamp-2">{module.titulo}</h3>
          {module.carga_horaria && (
            <span className="text-xs text-[#D4AF37]/70 font-medium">
              {module.carga_horaria}h de conteúdo
            </span>
          )}
          <p className="text-neutral-400 text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-3">
            {module.descricao || "Explore os segredos desta especialidade com chefs renomados."}
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
    </motion.div>
  );
}
