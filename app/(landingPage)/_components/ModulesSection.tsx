"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { useModulosPublic } from "@/hooks/useModulos";

export function ModulesSection() {
  const { data: modulos, isLoading, error } = useModulosPublic();

  if (error) return null;

  const validModulos = modulos || [];
  const displayedModules = validModulos.slice(0, 4);
  const hasMore = validModulos.length > 4;

  return (
    <section id="modulos" className="py-24 bg-[#f5f2eb] text-[#2c2c2c] w-full">
      <div className="max-w-7xl mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-end mb-12"
        >
          <div className="flex items-center gap-4">
            <h2 className="text-xl md:text-2xl font-serif tracking-widest uppercase">Nossos Módulos</h2>
            <div className="flex items-center opacity-60">
              <div className="h-[1px] w-8 bg-[#cba774]"></div>
              <div className="w-1.5 h-1.5 rounded-full border border-[#cba774]"></div>
              <div className="h-[1px] w-8 bg-[#cba774]"></div>
            </div>
          </div>
          {hasMore && (
            <button className="text-sm tracking-widest uppercase font-medium flex items-center gap-2 hover:text-[#cba774] transition-colors">
              Ver Todos <FiArrowRight />
            </button>
          )}
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-[#cba774]/20 border-t-[#cba774] rounded-full animate-spin" />
          </div>
        ) : validModulos.length === 0 ? (
          <p className="text-gray-500 text-center py-12">Nenhum módulo disponível no momento.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedModules.map((mod, i) => (
              <Link key={mod.id} href={`/modulos/${mod.id}`}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative aspect-square overflow-hidden rounded-md cursor-pointer"
              >
                {mod.thumbnail_url ? (
                  <img
                    src={mod.thumbnail_url}
                    alt={mod.titulo}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 bg-neutral-800" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 group-hover:opacity-90"></div>

                <div className="absolute bottom-0 left-0 p-6 w-full">
                  {mod.gratuito && (
                    <span className="text-[#cba774] text-xs font-semibold tracking-widest uppercase mb-2 block">
                      Gratuito
                    </span>
                  )}
                  <h3 className="text-white font-serif text-lg tracking-wide uppercase leading-snug">
                    {mod.titulo}
                  </h3>
                  {mod.carga_horaria && (
                    <span className="text-[#cba774]/70 text-xs font-medium mt-1 block">
                      {mod.carga_horaria}h de conteúdo
                    </span>
                  )}
                  <p className="text-white/70 text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-3">
                    {mod.descricao || "Explore os segredos desta especialidade com chefs renomados."}
                  </p>
                </div>
              </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
