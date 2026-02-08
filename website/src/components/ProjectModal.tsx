"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";
import { Project } from "@/components/Projects";

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          onClick={onClose}
        >
          {/* Backdrop with blur */}
          <motion.div
            initial={{ backdropFilter: "blur(0px)" }}
            animate={{ backdropFilter: "blur(20px)" }}
            exit={{ backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-black/60"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 100, rotateX: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
              duration: 0.5,
            }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl"
            style={{ perspective: "1000px" }}
          >
            {/* Glassmorphism background */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)",
                backdropFilter: "blur(40px)",
              }}
            />

            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 500 }}
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/10 backdrop-blur-sm flex items-center justify-center hover:bg-black/20 transition-colors"
            >
              <svg className="w-5 h-5 text-[#1a1a1a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>

            {/* Content wrapper */}
            <div className="relative z-10 flex flex-col md:flex-row h-full max-h-[90vh] overflow-y-auto">
              {/* Image section */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="relative w-full md:w-1/2 aspect-[4/3] md:aspect-auto md:min-h-[500px] overflow-hidden"
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Image overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-white/20" />

                {/* Category badge on image */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="absolute bottom-4 left-4 md:bottom-6 md:left-6"
                >
                  <span
                    className="text-sm font-medium px-4 py-2 rounded-full backdrop-blur-md"
                    style={{
                      background: "rgba(255,255,255,0.2)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      color: "#fff",
                    }}
                  >
                    {project.category}
                  </span>
                </motion.div>
              </motion.div>

              {/* Info section */}
              <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-4"
                >
                  {project.title}
                </motion.h2>

                {/* Location */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="flex items-center gap-2 text-[#525252] mb-6"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{project.location}</span>
                </motion.div>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="grid grid-cols-2 gap-4 mb-8"
                >
                  <div className="bg-[#fafafa] rounded-2xl p-4">
                    <p className="text-sm text-[#737373] mb-1">Area Total</p>
                    <p className="text-2xl font-bold text-[#1a1a1a]">{project.area}</p>
                  </div>
                  <div className="bg-[#fafafa] rounded-2xl p-4">
                    <p className="text-sm text-[#737373] mb-1">Tipo</p>
                    <p className="text-2xl font-bold text-[#1a1a1a]">{project.category}</p>
                  </div>
                </motion.div>

                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="mb-8"
                >
                  <h3 className="text-sm font-semibold text-[#737373] uppercase tracking-wider mb-3">
                    Sobre o Projeto
                  </h3>
                  <p className="text-[#525252] leading-relaxed">
                    {project.description ||
                      "Um projeto exclusivo desenvolvido com atenção aos mínimos detalhes, combinando design contemporâneo com funcionalidade. Cada espaço foi cuidadosamente planejado para proporcionar conforto e qualidade de vida para toda a família."}
                  </p>
                </motion.div>

                {/* Features */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="mb-8"
                >
                  <h3 className="text-sm font-semibold text-[#737373] uppercase tracking-wider mb-3">
                    Diferenciais
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {["Acabamento Premium", "Projeto Personalizado", "Entrega no Prazo", "Garantia"].map(
                      (feature, index) => (
                        <motion.span
                          key={feature}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.8 + index * 0.1 }}
                          className="text-sm px-3 py-1.5 rounded-full bg-[#1a1a1a]/5 text-[#525252]"
                        >
                          {feature}
                        </motion.span>
                      )
                    )}
                  </div>
                </motion.div>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                >
                  <a
                    href="#contato"
                    onClick={onClose}
                    className="inline-flex items-center justify-center w-full md:w-auto px-8 py-4 bg-[#1a1a1a] text-white font-semibold rounded-xl hover:bg-[#333] transition-colors"
                  >
                    Quero um Projeto Assim
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </motion.div>
              </div>
            </div>

            {/* Decorative elements */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.5 }}
              className="absolute -top-20 -right-20 w-40 h-40 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(196,30,58,0.1) 0%, transparent 70%)",
              }}
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 0.6 }}
              className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(26,26,26,0.1) 0%, transparent 70%)",
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
