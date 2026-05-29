"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiInstagram, FiFacebook, FiYoutube } from "react-icons/fi";

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-[#f5f2eb] text-gray-500 py-8 border-t border-[#e2dcc8] w-full text-xs tracking-wider"
    >
      <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="uppercase"
        >
          © 2024 ACADEMIA CAXUEIRADA. TODOS OS DIREITOS RESERVADOS.
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex items-center gap-4 uppercase font-medium"
        >
          <Link href="#" className="hover:text-[#cba774] transition-colors">Sobre Nós</Link>
          <span className="text-[#e2dcc8]">|</span>
          <Link href="#" className="hover:text-[#cba774] transition-colors">FAQ</Link>
          <span className="text-[#e2dcc8]">|</span>
          <Link href="#" className="hover:text-[#cba774] transition-colors">Termos</Link>
          <span className="text-[#e2dcc8]">|</span>
          <Link href="#" className="hover:text-[#cba774] transition-colors">Privacidade</Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex items-center gap-4"
        >
          <Link href="#" className="hover:text-[#cba774] transition-colors" aria-label="Instagram">
            <FiInstagram size={18} />
          </Link>
          <Link href="#" className="hover:text-[#cba774] transition-colors" aria-label="Facebook">
            <FiFacebook size={18} />
          </Link>
          <Link href="#" className="hover:text-[#cba774] transition-colors" aria-label="YouTube">
            <FiYoutube size={18} />
          </Link>
        </motion.div>

      </div>
    </motion.footer>
  );
}
