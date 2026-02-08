"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const navLinks = [
  { href: "/#home", label: "Home" },
  { href: "/#sobre", label: "Sobre Nós" },
  { href: "/#projetos", label: "Projetos" },
  { href: "/#contato", label: "Contato" },
  { href: "/#pos-venda", label: "Pós-venda" },
  { href: "/financiamento", label: "Financiamento" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/#home" className="flex items-center">
              <span
                className={`font-[var(--font-playfair)] text-2xl font-bold tracking-tight transition-colors ${
                  isScrolled ? "text-[#1a1a1a]" : "text-white"
                }`}
              >
                PLENUS
              </span>
              <span
                className={`ml-1 text-sm font-light tracking-widest transition-colors ${
                  isScrolled ? "text-[#737373]" : "text-white/80"
                }`}
              >
                OBRAS
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-[#c41e3a] ${
                    isScrolled ? "text-[#525252]" : "text-white/90"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden lg:block">
              <Link
                href="/#contato"
                className="inline-flex items-center px-6 py-3 bg-[#c41e3a] text-white text-sm font-semibold rounded-full hover:bg-[#a01830] transition-colors"
              >
                Solicitar Orçamento
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2"
              aria-label="Menu"
            >
              <div className="w-6 h-5 relative flex flex-col justify-between">
                <span
                  className={`w-full h-0.5 transition-all ${
                    isScrolled ? "bg-[#1a1a1a]" : "bg-white"
                  } ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}
                />
                <span
                  className={`w-full h-0.5 transition-all ${
                    isScrolled ? "bg-[#1a1a1a]" : "bg-white"
                  } ${isMobileMenuOpen ? "opacity-0" : ""}`}
                />
                <span
                  className={`w-full h-0.5 transition-all ${
                    isScrolled ? "bg-[#1a1a1a]" : "bg-white"
                  } ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
                />
              </div>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute right-0 top-0 bottom-0 w-72 bg-white/95 backdrop-blur-xl shadow-xl p-8 pt-24"
            >
              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-medium text-[#1a1a1a] hover:text-[#c41e3a] transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/#contato"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-4 inline-flex items-center justify-center px-6 py-3 bg-[#c41e3a] text-white text-sm font-semibold rounded-full hover:bg-[#a01830] transition-colors"
                >
                  Solicitar Orçamento
                </Link>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
