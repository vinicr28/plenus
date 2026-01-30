"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "./ScrollAnimations";

const stats = [
  { value: "150+", label: "Obras Entregues" },
  { value: "40%", label: "de Economia Garantida", prefix: "Até " },
  { value: "8", label: "Anos de Mercado" },
  { value: "150+", label: "Famílias Satisfeitas" },
];

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#262626] to-[#171717]">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%221%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]" />
      </div>

      {/* Decorative elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 2 }}
        className="absolute top-20 right-10 w-96 h-96 bg-[#c41e3a] rounded-full blur-[150px]"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.08 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute bottom-20 left-10 w-72 h-72 bg-white rounded-full blur-[120px]"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-32">
        <div className="text-center">
          {/* Main headline */}
          <FadeIn delay={0.2}>
            <p className="text-[#c41e3a] text-sm font-semibold tracking-[0.3em] uppercase mb-6">
              Construção de Casas Personalizadas
            </p>
          </FadeIn>

          <FadeIn delay={0.4}>
            <h1 className="font-[var(--font-playfair)] text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4">
              Você sonha,
              <br />
              <span className="text-[#c41e3a]">a Plenus realiza</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.6}>
            <h2 className="font-[var(--font-playfair)] text-2xl md:text-3xl text-white/80 font-light mb-8">
              Sua Casa do Sonho à Realidade
            </h2>
          </FadeIn>

          <FadeIn delay={0.8}>
            <p className="max-w-2xl mx-auto text-lg text-white/70 leading-relaxed mb-12">
              Oferecemos a solução completa: terreno selecionado e construção
              personalizada. Qualidade premium com economia de até 40% no seu
              investimento.
            </p>
          </FadeIn>

          {/* CTA Buttons */}
          <FadeIn delay={1}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
              <Link
                href="#contato"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#c41e3a] text-white text-base font-semibold rounded-full hover:bg-[#a01830] transition-all hover:scale-105"
              >
                Solicitar Orçamento
                <svg
                  className="ml-2 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
              <Link
                href="#projetos"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-white text-base font-semibold rounded-full hover:border-white/60 hover:bg-white/5 transition-all"
              >
                Ver Projetos
              </Link>
            </div>
          </FadeIn>

          {/* Stats */}
          <StaggerContainer
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            staggerDelay={0.15}
          >
            {stats.map((stat, index) => (
              <StaggerItem key={index}>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {stat.prefix && (
                      <span className="text-lg font-normal text-white/70">
                        {stat.prefix}
                      </span>
                    )}
                    <span className="text-[#c41e3a]">{stat.value}</span>
                  </div>
                  <p className="text-sm text-white/60">{stat.label}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.5, repeat: Infinity, repeatType: "reverse" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-white/60 rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}
