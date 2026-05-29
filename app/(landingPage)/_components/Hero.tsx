"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export function Hero() {
  return (
    <section className="relative w-full h-screen min-h-[600px] flex items-center pt-20">
      <div className="absolute inset-0 z-0">
        <Image
          src="/imagemFundoHero.png"
          alt="Mesa posta elegante"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-8">
        <div className="max-w-2xl text-[#e8e2d2]">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-serif mb-6 leading-tight"
          >
            A arte de <br /> receber bem.
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center gap-4 mb-6 opacity-80"
          >
            <div className="h-[1px] w-12 bg-[#cba774]"></div>
            <div className="w-2 h-2 rounded-full border border-[#cba774]"></div>
            <div className="h-[1px] w-12 bg-[#cba774]"></div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-lg md:text-xl font-light mb-10 max-w-md leading-relaxed text-white/90"
          >
            Aprenda culinária, mesa posta, drinks e hospitalidade com elegância e transforme momentos em memórias.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Link
              href="#comecar"
              className="inline-flex items-center gap-4 px-8 py-4 bg-[#cba774] text-black font-semibold text-sm tracking-wider uppercase hover:bg-[#b5925d] transition-colors"
            >
              Começar Agora
              <FiArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
