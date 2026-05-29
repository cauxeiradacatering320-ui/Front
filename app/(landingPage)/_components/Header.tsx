"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export function Header() {
  const { user, isLoading } = useAuthStore();
  const pathname = usePathname();

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navLinks = [
    { label: "Início", href: "/" },
    { label: "Cursos", href: "#modulos", scrollId: "modulos" },
    { label: "Contato", href: "#contato", scrollId: "contato" },
  ];

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 bg-gradient-to-b from-black/80 to-transparent text-[#e8e2d2]"
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex items-center"
      >
        <Link href="/">
          <Image src="/logo.preta.jpeg" alt="Academia Caxueirada" width={60} height={60} className="object-contain" />
        </Link>
      </motion.div>
      
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-widest uppercase">
        {navLinks.map((link) =>
          link.scrollId ? (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                if (pathname === "/") {
                  handleScroll(e, link.scrollId!);
                }
              }}
              className="hover:text-[#cba774] transition-colors"
            >
              {link.label}
            </a>
          ) : (
            <Link
              key={link.label}
              href={link.href}
              className={pathname === link.href ? "border-b border-[#cba774] pb-1 text-[#cba774]" : "hover:text-[#cba774] transition-colors"}
            >
              {link.label}
            </Link>
          )
        )}
      </nav>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex items-center gap-4"
      >
        {isLoading ? null : user ? (
          <Link
            href={user.role === "admin" ? "/admin" : "/home"}
            className="hidden md:inline-block px-5 py-2 bg-[#cba774] text-black text-sm font-semibold tracking-wider uppercase hover:bg-[#b5925d] transition-colors"
          >
            Meu Painel
          </Link>
        ) : (
          <Link
            href="/login"
            className="hidden md:inline-block px-5 py-2 bg-[#cba774] text-black text-sm font-semibold tracking-wider uppercase hover:bg-[#b5925d] transition-colors"
          >
            Entrar
          </Link>
        )}
      </motion.div>
    </motion.header>
  );
}
