"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, animate } from "framer-motion";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "./ScrollAnimations";

const stats = [
  { value: "150+", label: "Obras Entregues" },
  { value: "40%", label: "de Economia Garantida", prefix: "Até " },
  { value: "8", label: "Anos de Mercado" },
  { value: "150+", label: "Famílias Satisfeitas" },
];

export default function Hero() {
  const { scrollY } = useScroll();
  const [introComplete, setIntroComplete] = useState(false);

  // Intro animation scale (12x -> 0.6x on page load)
  const introScale = useMotionValue(12);
  const introOpacity = useMotionValue(0);

  useEffect(() => {
    // Animate logo from 12x to 0.6x on page load
    const scaleAnimation = animate(introScale, 0.6, {
      duration: 1.5,
      ease: [0.22, 1, 0.36, 1], // Custom easing for smooth deceleration
      onComplete: () => setIntroComplete(true),
    });

    // Fade in the logo
    const opacityAnimation = animate(introOpacity, 0.65, {
      duration: 0.8,
      ease: "easeOut",
    });

    return () => {
      scaleAnimation.stop();
      opacityAnimation.stop();
    };
  }, [introScale, introOpacity]);

  // Background parallax - subtle movement
  const backgroundY = useTransform(scrollY, [0, 1000], [0, 300]);
  const smoothBackgroundY = useSpring(backgroundY, { stiffness: 100, damping: 30 });

  // Logo scroll effect - scales up from 0.6x to 6x as you scroll (after intro)
  const scrollLogoScale = useTransform(scrollY, [0, 600], [0.6, 6]);
  const scrollLogoOpacity = useTransform(scrollY, [0, 500], [0.65, 0]);
  const logoY = useTransform(scrollY, [0, 600], [0, -200]);
  const smoothScrollLogoScale = useSpring(scrollLogoScale, { stiffness: 100, damping: 30 });
  const smoothLogoY = useSpring(logoY, { stiffness: 100, damping: 30 });

  // Use intro values until intro is complete, then switch to scroll values
  const logoScale = introComplete ? smoothScrollLogoScale : introScale;
  const logoOpacity = introComplete ? scrollLogoOpacity : introOpacity;

  // Foreground elements parallax
  const foregroundY = useTransform(scrollY, [0, 1000], [0, 500]);
  const smoothForegroundY = useSpring(foregroundY, { stiffness: 100, damping: 30 });

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Layer 1: Background image with parallax */}
      <motion.div
        className="absolute inset-0"
        style={{ y: smoothBackgroundY }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
          style={{ backgroundImage: "url('/hero-background.png')" }}
        />
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e]/40 via-transparent to-[#0a0a0a]/80" />
      </motion.div>

      {/* Layer 2: Atmospheric glows */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Red accent glow */}
        <div
          className="absolute top-10 right-20 w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(ellipse at center, rgba(196,30,58,0.4) 0%, transparent 60%)",
            filter: "blur(60px)",
          }}
        />
        {/* Blue ambient */}
        <div
          className="absolute bottom-20 left-20 w-[400px] h-[400px] rounded-full opacity-15"
          style={{
            background: "radial-gradient(ellipse at center, rgba(15,52,96,0.5) 0%, transparent 60%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* Layer 3: Large PLENUS logo with scroll effect */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        style={{
          scale: logoScale,
          opacity: logoOpacity,
          y: introComplete ? smoothLogoY : 0,
        }}
      >
        <span
          className="font-[var(--font-playfair)] text-[30vw] font-bold text-white/30 whitespace-nowrap"
          style={{
            WebkitTextStroke: "3px rgba(255,255,255,0.8)",
            textShadow: "0 0 60px rgba(255,255,255,0.5), 0 0 120px rgba(196,30,58,0.4)",
          }}
        >
          PLENUS
        </span>
      </motion.div>

      {/* Layer 4: Foreground gradient overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: smoothForegroundY }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      </motion.div>

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0,0,0,0.4) 100%)",
        }}
      />

      {/* Content - completely static, no motion transforms */}
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
                  href="#mapa"
                  className="inline-flex items-center justify-center px-8 py-4 text-white text-base font-semibold rounded-full hover:scale-105 transition-all backdrop-blur-lg"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)',
                  }}
                >
                  Explorar no Mapa
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
