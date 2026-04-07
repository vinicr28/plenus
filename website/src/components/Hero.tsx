"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, animate } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "./ScrollAnimations";

const defaultStats = [
  { value: "150+", label: "Obras Entregues", prefix: null },
  { value: "40%", label: "de Economia Garantida", prefix: "Até " },
  { value: "9", label: "Anos de Mercado", prefix: null },
];

interface HeroProps {
  stats?: { value: string; label: string; prefix?: string | null }[];
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);
  return isMobile;
}

export default function Hero({ stats: propStats }: HeroProps) {
  const stats = propStats && propStats.length === 3 ? propStats : defaultStats;
  const { scrollY } = useScroll();
  const [introComplete, setIntroComplete] = useState(false);
  const isMobile = useIsMobile();

  // Intro animation scale (12x -> 0.6x on page load) — desktop only
  const introScale = useMotionValue(isMobile ? 0.6 : 12);
  const introOpacity = useMotionValue(isMobile ? 0.65 : 0);

  useEffect(() => {
    if (isMobile) {
      setIntroComplete(true);
      return;
    }

    const scaleAnimation = animate(introScale, 0.6, {
      duration: 1.5,
      ease: [0.22, 1, 0.36, 1],
      onComplete: () => setIntroComplete(true),
    });

    const opacityAnimation = animate(introOpacity, 0.65, {
      duration: 0.8,
      ease: "easeOut",
    });

    return () => {
      scaleAnimation.stop();
      opacityAnimation.stop();
    };
  }, [introScale, introOpacity, isMobile]);

  // Parallax and scroll effects — desktop only
  const backgroundYRaw = useTransform(scrollY, [0, 1000], [0, isMobile ? 0 : 300]);
  const backgroundY = useSpring(backgroundYRaw, { stiffness: 200, damping: 40, restDelta: 0.5 });

  const scrollLogoScale = useTransform(scrollY, [0, 600], [0.6, 6]);
  const scrollLogoOpacity = useTransform(scrollY, [0, 500], [0.65, 0]);
  const logoY = useTransform(scrollY, [0, 600], [0, -200]);
  const smoothScrollLogoScale = useSpring(scrollLogoScale, { stiffness: 100, damping: 30, restDelta: 0.01 });
  const smoothLogoY = useSpring(logoY, { stiffness: 100, damping: 30, restDelta: 0.01 });

  const logoScale = introComplete ? smoothScrollLogoScale : introScale;
  const logoOpacity = introComplete ? scrollLogoOpacity : introOpacity;

  const foregroundYRaw = useTransform(scrollY, [0, 1000], [0, isMobile ? 0 : 500]);
  const foregroundY = useSpring(foregroundYRaw, { stiffness: 200, damping: 40, restDelta: 0.5 });

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Layer 1: Background image */}
      {isMobile ? (
        <div className="absolute inset-0">
          <div className="absolute inset-0">
            <Image
              src="/hero-background.webp"
              alt="Casa moderna construída pela Construtora Plenus em condomínio fechado em Indaiatuba"
              fill
              priority
              quality={60}
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e]/40 via-transparent to-[#0a0a0a]/80" />
        </div>
      ) : (
        <motion.div
          className="absolute inset-0"
          style={{ y: backgroundY }}
        >
          <div className="absolute inset-0 scale-110">
            <Image
              src="/hero-background.webp"
              alt="Casa moderna construída pela Construtora Plenus em condomínio fechado em Indaiatuba"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e]/40 via-transparent to-[#0a0a0a]/80" />
        </motion.div>
      )}

      {/* Layer 2: Atmospheric glows — hidden on mobile */}
      <div className="absolute inset-0 pointer-events-none hidden md:block">
        <div
          className="absolute top-10 right-20 w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(ellipse at center, rgba(196,30,58,0.4) 0%, transparent 60%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute bottom-20 left-20 w-[400px] h-[400px] rounded-full opacity-15"
          style={{
            background: "radial-gradient(ellipse at center, rgba(15,52,96,0.5) 0%, transparent 60%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* Layer 3: Large PLENUS logo with scroll effect — hidden on mobile */}
      {!isMobile && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          style={{
            scale: logoScale,
            opacity: logoOpacity,
            y: introComplete ? smoothLogoY : 0,
          }}
        >
          <span
            className="font-[var(--font-playfair)] text-[30vw] font-bold text-white/20 whitespace-nowrap"
            style={{
              WebkitTextStroke: "1px rgba(255,255,255,0.6)",
            }}
          >
            PLENUS
          </span>
        </motion.div>
      )}

      {/* Layer 4: Foreground gradient overlay */}
      {isMobile ? (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        </div>
      ) : (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ y: foregroundY }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        </motion.div>
      )}

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0,0,0,0.4) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-32">
        {/* Glass container — no backdrop-blur on mobile */}
        <div
          className="backdrop-blur-xl md:backdrop-blur-2xl rounded-3xl p-8 md:p-12 lg:p-16 shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 100%)',
            border: '1px solid rgba(255,255,255,0.3)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.1)',
          }}
        >
          <div className="text-center">
            <FadeIn delay={isMobile ? 0 : 0.2}>
              <h1 className="text-[#000000] text-sm font-semibold tracking-[0.3em] uppercase mb-6">
                <span className="md:hidden">Construtora em Indaiatuba e Jundiaí</span>
                <span className="hidden md:inline">Construtora de Casas Personalizadas em Indaiatuba e Jundiaí</span>
              </h1>
            </FadeIn>

            <FadeIn delay={isMobile ? 0 : 0.4}>
              <h2 className="font-[var(--font-playfair)] text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4">
                Construção personalizada
                <br />
                <span className="text-[#000000]">com qualidade premium.</span>
              </h2>
            </FadeIn>

            <FadeIn delay={isMobile ? 0 : 0.6}>
              <p className="font-[var(--font-playfair)] text-2xl md:text-3xl text-white/90 font-light mb-8">
                Economize até {stats[1]?.value} no seu investimento.
              </p>
            </FadeIn>

            <FadeIn delay={isMobile ? 0 : 0.8}>
              <p className="max-w-2xl mx-auto text-lg text-white/80 leading-relaxed mb-12">
                <span className="md:hidden">
                  Casas personalizadas em Indaiatuba e Jundiaí. Solução completa
                  com qualidade premium e {stats[2]?.value} anos de mercado.
                </span>
                <span className="hidden md:inline">
                  Especialistas em casas personalizadas em Indaiatuba e Jundiaí.
                  Solução completa: terreno, projeto e obra entregues com qualidade
                  premium. {stats[2]?.value} anos de experiência.
                </span>
              </p>
            </FadeIn>

            {/* CTA Buttons */}
            <FadeIn delay={isMobile ? 0.1 : 1}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Link
                  href="https://wa.me/5519992937486?text=Olá! Gostaria de solicitar um orçamento gratuito."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-4 bg-[#c41e3a] text-white text-base font-semibold rounded-full hover:bg-[#a01830] transition-all hover:scale-105"
                >
                  <span className="md:hidden">Orçamento Grátis</span>
                  <span className="hidden md:inline">Solicitar Orçamento Gratuito</span>
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
                  href="/projetos"
                  className="inline-flex items-center justify-center px-8 py-4 text-white text-base font-semibold rounded-full hover:scale-105 transition-all backdrop-blur-none md:backdrop-blur-lg"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)',
                  }}
                >
                  Ver Projetos Realizados
                </Link>
              </div>
            </FadeIn>

            {/* Stats */}
            <StaggerContainer
              className="hidden sm:grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto"
              staggerDelay={0.15}
            >
              {stats.map((stat, index) => (
                <StaggerItem key={index}>
                  <div
                    className="text-center backdrop-blur-none md:backdrop-blur-lg rounded-2xl p-4"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
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
                    <p className="text-sm text-white/70">{stat.label}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
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
