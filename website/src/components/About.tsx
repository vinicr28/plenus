"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem } from "./ScrollAnimations";

const values = [
  "Gratidão",
  "Integridade",
  "Excelência",
  "Sustentabilidade",
  "Foco no Cliente",
  "Segurança",
  "Autorresponsabilidade",
];

function ParallaxCard({
  children,
}: {
  children: React.ReactNode;
  index?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, isMobile ? 0 : -50]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30, restDelta: 0.001 });

  if (isMobile) {
    return <div ref={ref} className="h-full">{children}</div>;
  }

  return (
    <motion.div ref={ref} style={{ y: smoothY }} className="h-full">
      {children}
    </motion.div>
  );
}

export default function About() {
  return (
    <section id="sobre" className="py-24 lg:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <FadeIn>
            <p className="text-[#737373] text-sm font-semibold tracking-[0.2em] uppercase mb-4">
              Sobre a Plenus
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="font-[var(--font-playfair)] text-3xl md:text-5xl font-bold text-[#1a1a1a] mb-6">
              9 Anos Transformando
              <br />
              <span className="text-[#525252]">Sonhos em Realidade</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-lg text-[#525252] leading-relaxed">
              A Plenus Obras nasceu da paixão por construir lares. Somos
              especialistas em oferecer a solução completa de terreno +
              construção com economia real.
            </p>
          </FadeIn>
        </div>

        {/* Mission, Vision, Essence */}
        <div className="grid md:grid-cols-3 gap-8 mb-20 items-stretch">
          <ParallaxCard>
            <FadeIn delay={0.1} className="h-full">
              <div className="bg-white rounded-2xl p-8 h-full flex flex-col text-center border border-gray-100 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_32px_-4px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-[#c41e3a]/10 rounded-xl flex items-center justify-center mb-6 mx-auto">
                  <svg
                    className="w-6 h-6 text-[#c41e3a]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="font-[var(--font-playfair)] text-xl font-bold text-[#1a1a1a] mb-4">
                  Missão
                </h3>
                <p className="text-[#525252] leading-relaxed flex-1">
                  Nossa missão é oferecer qualidade de vida através da construção
                  de sonhos, entregando obras com excelência, segurança e
                  custo-benefício, no prazo e com a tranquilidade que gera
                  conforto e plenitude de vida.
                </p>
              </div>
            </FadeIn>
          </ParallaxCard>

          <ParallaxCard>
            <FadeIn delay={0.2} className="h-full">
              <div className="bg-white rounded-2xl p-8 h-full flex flex-col text-center border border-gray-100 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_32px_-4px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-[#c41e3a]/10 rounded-xl flex items-center justify-center mb-6 mx-auto">
                  <svg
                    className="w-6 h-6 text-[#c41e3a]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
                <h3 className="font-[var(--font-playfair)] text-xl font-bold text-[#1a1a1a] mb-4">
                  Visão
                </h3>
                <p className="text-[#525252] leading-relaxed flex-1">
                  Ser a empresa de maior credibilidade dentro da construção civil
                  do mercado de Indaiatuba e Jundiaí.
                </p>
              </div>
            </FadeIn>
          </ParallaxCard>

          <ParallaxCard>
            <FadeIn delay={0.3} className="h-full">
              <div className="bg-white rounded-2xl p-8 h-full flex flex-col text-center border border-gray-100 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_32px_-4px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-[#c41e3a]/10 rounded-xl flex items-center justify-center mb-6 mx-auto">
                  <svg
                    className="w-6 h-6 text-[#c41e3a]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-[var(--font-playfair)] text-xl font-bold text-[#1a1a1a] mb-4">
                  Essência
                </h3>
                <p className="text-[#525252] leading-relaxed flex-1">
                  Cada projeto é único, assim como cada família. Trabalhamos com
                  dedicação para entregar não apenas uma casa, mas um lar repleto
                  de possibilidades.
                </p>
              </div>
            </FadeIn>
          </ParallaxCard>
        </div>

        {/* Values */}
        <div className="bg-[#1a1a1a] rounded-3xl p-8 lg:p-12">
          <FadeIn>
            <h3 className="font-[var(--font-playfair)] text-2xl md:text-3xl font-bold text-white text-center mb-10">
              Nossos <span className="text-[#c41e3a]">Valores</span>
            </h3>
          </FadeIn>

          <StaggerContainer
            className="flex flex-wrap justify-center gap-6"
            staggerDelay={0.1}
          >
            {values.map((value, index) => (
              <StaggerItem key={index}>
                <div className="flex items-center gap-2 px-4 py-2">
                  <div className="w-2 h-2 bg-[#c41e3a] rounded-full flex-shrink-0" />
                  <span className="text-white/90 text-sm whitespace-nowrap">{value}</span>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
