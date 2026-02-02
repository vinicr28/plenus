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
      <div className="absolute inset-0">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero-background.png')" }}
        />
        {/* Lighter overlay to keep photo visible */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a]/30 via-[#262626]/20 to-[#171717]/30" />
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
        {/* Glass container */}
        <div
          className="backdrop-blur-2xl rounded-3xl p-8 md:p-12 lg:p-16 shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 100%)',
            border: '1px solid rgba(255,255,255,0.3)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.1)',
          }}
        >
          <div className="text-center">
            {/* Main headline */}
            <FadeIn delay={0.2}>
              <p className="text-[#000000] text-sm font-semibold tracking-[0.3em] uppercase mb-6">
                Construção de Casas Personalizadas
              </p>
            </FadeIn>

            <FadeIn delay={0.4}>
              <h1 className="font-[var(--font-playfair)] text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4">
                Você sonha,
                <br />
                <span className="text-[#000000]">a Plenus realiza</span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.6}>
              <h2 className="font-[var(--font-playfair)] text-2xl md:text-3xl text-white/90 font-light mb-8">
                Sua Casa do Sonho à Realidade
              </h2>
            </FadeIn>

            <FadeIn delay={0.8}>
              <p className="max-w-2xl mx-auto text-lg text-white/80 leading-relaxed mb-12">
                Oferecemos a solução completa: terreno selecionado e construção
                personalizada. Qualidade premium com economia de até 40% no seu
                investimento.
              </p>
            </FadeIn>

            {/* CTA Buttons */}
            <FadeIn delay={1}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
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
                  className="inline-flex items-center justify-center px-8 py-4 text-white text-base font-semibold rounded-full hover:scale-105 transition-all backdrop-blur-lg"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)',
                  }}
                >
                  Ver Projetos
                </Link>
              </div>
            </FadeIn>

            {/* Stats with glass effect */}
            <StaggerContainer
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
              staggerDelay={0.15}
            >
              {stats.map((stat, index) => (
                <StaggerItem key={index}>
                  <div
                    className="text-center backdrop-blur-lg rounded-2xl p-4"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0) 0%, rgbrgba(255, 255, 255, 0)0%)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
                    }}
                  >
                    <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                      {stat.prefix && (
                        <span className="text-lg font-normal text-white/80">
                          {stat.prefix}
                        </span>
                      )}
                      <span className="text-white">{stat.value}</span>
                    </div>
                    <p className="text-sm text-[#000000]">{stat.label}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
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
