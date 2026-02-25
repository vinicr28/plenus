"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring, useMotionValue, animate } from "framer-motion";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ScrollAnimations";

const ChatBot = dynamic(() => import("@/components/ChatBot"));

const defaultStats = [
  { value: "150+", label: "Obras Entregues", prefix: null },
  { value: "40%", label: "de Economia Garantida", prefix: "Até " },
  { value: "9", label: "Anos de Mercado", prefix: null },
  { value: "150+", label: "Famílias Satisfeitas", prefix: null },
];

interface CityPageClientProps {
  stats?: { value: string; label: string; prefix?: string | null }[];
}

export default function CityPageClient({ stats: propStats }: CityPageClientProps) {
  const stats = propStats && propStats.length === 4 ? propStats : defaultStats;
  const economyValue = stats[1]?.value || "40%";

  const { scrollY } = useScroll();
  const [introComplete, setIntroComplete] = useState(false);

  const introScale = useMotionValue(12);
  const introOpacity = useMotionValue(0);

  useEffect(() => {
    const scaleAnimation = animate(introScale, 0.6, {
      duration: 1.5,
      ease: [0.22, 1, 0.36, 1],
      onComplete: () => setIntroComplete(true),
    });
    const opacityAnimation = animate(introOpacity, 0.65, {
      duration: 0.8,
      ease: "easeOut",
    });
    return () => { scaleAnimation.stop(); opacityAnimation.stop(); };
  }, [introScale, introOpacity]);

  const scrollLogoScale = useTransform(scrollY, [0, 600], [0.6, 6]);
  const scrollLogoOpacity = useTransform(scrollY, [0, 500], [0.65, 0]);
  const logoY = useTransform(scrollY, [0, 600], [0, -200]);
  const smoothScrollLogoScale = useSpring(scrollLogoScale, { stiffness: 100, damping: 30, restDelta: 0.01 });
  const smoothLogoY = useSpring(logoY, { stiffness: 100, damping: 30, restDelta: 0.01 });

  const logoScale = introComplete ? smoothScrollLogoScale : introScale;
  const logoOpacity = introComplete ? scrollLogoOpacity : introOpacity;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-black">
          <div className="absolute inset-0">
            <div className="absolute inset-0 scale-110">
              <Image
                src="/hero-background.webp"
                alt="Casa moderna construída pela Construtora Plenus em Jundiaí"
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e]/40 via-transparent to-[#0a0a0a]/80" />
          </div>

          <div className="absolute inset-0 pointer-events-none">
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

          {/* PLENUS watermark */}
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
              style={{ WebkitTextStroke: "1px rgba(255,255,255,0.6)" }}
            >
              PLENUS
            </span>
          </motion.div>

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0,0,0,0.4) 100%)",
            }}
          />

          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-32 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <Breadcrumbs items={[{ label: "Construtora em Jundiaí" }]} />
            </motion.div>

            <div
              className="backdrop-blur-2xl rounded-3xl p-5 sm:p-8 md:p-12 lg:p-16 shadow-2xl"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 100%)",
                border: "1px solid rgba(255,255,255,0.3)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.1)",
              }}
            >
              <div className="text-center">
                <FadeIn delay={0.1}>
                  <h1 className="text-white text-sm font-semibold tracking-[0.3em] uppercase mb-6">
                    Construtora de Casas Personalizadas em Jundiaí
                  </h1>
                </FadeIn>

                <FadeIn delay={0.2}>
                  <h2 className="font-[var(--font-playfair)] text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4">
                    Sua casa dos sonhos
                    <br />
                    <span className="text-[#000000] drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">em Jundiaí</span>
                  </h2>
                </FadeIn>

                <FadeIn delay={0.3}>
                  <p className="max-w-2xl mx-auto text-lg text-white/80 leading-relaxed mb-12">
                    Projetos personalizados com qualidade premium a 60km de São Paulo. Economia de até 40% com o modelo terreno + construção.
                  </p>
                </FadeIn>

                <FadeIn delay={0.4}>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                    <Link
                      href="/#contato"
                      className="inline-flex items-center justify-center px-8 py-4 bg-[#c41e3a] text-white text-base font-semibold rounded-full hover:bg-[#a01830] transition-all hover:scale-105"
                    >
                      Solicitar Orçamento
                      <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                    <Link
                      href="/#projetos"
                      className="inline-flex items-center justify-center px-8 py-4 text-white text-base font-semibold rounded-full hover:scale-105 transition-all backdrop-blur-lg"
                      style={{
                        background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)",
                        border: "1px solid rgba(255,255,255,0.3)",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)",
                      }}
                    >
                      Ver Projetos
                    </Link>
                  </div>
                </FadeIn>

                <StaggerContainer className="hidden sm:grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto" staggerDelay={0.15}>
                  {stats.map((stat, i) => (
                    <StaggerItem key={i}>
                      <div
                        className="text-center backdrop-blur-lg rounded-2xl p-4"
                        style={{
                          background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
                          border: "1px solid rgba(255,255,255,0.2)",
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
                        }}
                      >
                        <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                          {stat.prefix && <span className="text-lg font-normal text-white/80">{stat.prefix}</span>}
                          <span>{stat.value}</span>
                        </div>
                        <p className="text-sm text-white/70">{stat.label}</p>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </div>
          </div>
        </section>

        {/* Diferenciais */}
        <section className="py-24 lg:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-20">
              <FadeIn>
                <p className="text-[#737373] text-sm font-semibold tracking-[0.2em] uppercase mb-4">
                  Nossos Diferenciais
                </p>
              </FadeIn>
              <FadeIn delay={0.1}>
                <h2 className="font-[var(--font-playfair)] text-3xl md:text-5xl font-bold text-[#1a1a1a] mb-6">
                  Por Que Construir
                  <br />
                  <span className="text-[#525252]">com a Plenus?</span>
                </h2>
              </FadeIn>
              <FadeIn delay={0.2}>
                <p className="text-lg text-[#525252] leading-relaxed">
                  Jundiaí combina proximidade com São Paulo e qualidade de vida cercada pela Serra do Japi. A Plenus é a construtora que entende a região e entrega excelência.
                </p>
              </FadeIn>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-stretch">
              {[
                {
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  ),
                  title: "Projeto Exclusivo",
                  desc: "Casa única, projetada para o seu terreno, estilo de vida e necessidades da sua família.",
                },
                {
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  ),
                  title: `Economia de até ${economyValue}`,
                  desc: "Modelo terreno + construção com custo muito menor que imóveis prontos na região.",
                },
                {
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  ),
                  title: "Transparência Total",
                  desc: "Orçamento detalhado, cronograma claro e acompanhamento constante da sua obra.",
                },
                {
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  ),
                  title: "Qualidade Garantida",
                  desc: "Materiais premium e acabamentos de primeira linha com garantia em cada detalhe.",
                },
              ].map((item, i) => (
                <FadeIn key={i} delay={0.1 * (i + 1)} className="h-full">
                  <div className="bg-white rounded-2xl p-8 h-full flex flex-col text-center border border-gray-100 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_32px_-4px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300">
                    <div className="w-12 h-12 bg-[#c41e3a]/10 rounded-xl flex items-center justify-center mb-6 mx-auto">
                      <svg className="w-6 h-6 text-[#c41e3a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {item.icon}
                      </svg>
                    </div>
                    <h3 className="font-[var(--font-playfair)] text-lg font-bold text-[#1a1a1a] mb-3">
                      {item.title}
                    </h3>
                    <p className="text-[#525252] text-sm leading-relaxed flex-1">
                      {item.desc}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* CTA + navegação */}
        <section className="bg-[#1a1a1a] rounded-t-[2rem]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32">
            <div className="max-w-3xl mx-auto text-center">
              <FadeIn>
                <p className="text-[#c41e3a] text-sm font-semibold tracking-[0.2em] uppercase mb-4">
                  Comece Agora
                </p>
              </FadeIn>
              <FadeIn delay={0.1}>
                <h2 className="font-[var(--font-playfair)] text-3xl md:text-5xl font-bold text-white mb-6">
                  Pronto para construir
                  <br />
                  <span className="text-white/50">em Jundiaí?</span>
                </h2>
              </FadeIn>
              <FadeIn delay={0.2}>
                <p className="text-lg text-white/60 leading-relaxed mb-10">
                  Converse com nossa equipe e receba um orçamento personalizado sem compromisso.
                </p>
              </FadeIn>

              <FadeIn delay={0.3}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                  <Link
                    href="/#contato"
                    className="inline-flex items-center justify-center px-8 py-4 bg-[#c41e3a] text-white text-base font-semibold rounded-full hover:bg-[#a01830] transition-all hover:scale-105"
                  >
                    Solicitar Orçamento
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                  <a
                    href="https://wa.me/5519992937486?text=Olá! Vim do site e gostaria de saber mais sobre construção em Jundiaí."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-8 py-4 text-white text-base font-semibold rounded-full hover:scale-105 transition-all backdrop-blur-lg"
                    style={{
                      background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
                    }}
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp
                  </a>
                </div>
              </FadeIn>

              <StaggerContainer className="flex flex-wrap justify-center gap-3" staggerDelay={0.08}>
                {[
                  { href: "/#projetos", label: "Projetos", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /> },
                  { href: "/financiamento", label: "Financiamento", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /> },
                  { href: "/#mapa", label: "Mapa 3D", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> },
                  { href: "/#depoimentos", label: "Depoimentos", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /> },
                  { href: "/#sobre", label: "Sobre Nós", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> },
                ].map((link, i) => (
                  <StaggerItem key={i}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2.5 px-5 py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-[#c41e3a] hover:border-[#c41e3a] transition-all duration-300"
                    >
                      <svg className="w-4 h-4 text-[#c41e3a] group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {link.icon}
                      </svg>
                      <span className="text-white/70 text-sm font-medium group-hover:text-white transition-colors duration-300">
                        {link.label}
                      </span>
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </div>

          {/* SEO text */}
          <div className="border-t border-white/5">
            <div className="max-w-3xl mx-auto px-6 lg:px-8 py-12">
              <article className="text-sm text-white/30 space-y-3 leading-relaxed">
                <p>
                  Jundiaí combina proximidade com São Paulo (60km pelas rodovias Anhanguera e Bandeirantes) e qualidade de vida cercada pela Serra do Japi. Com 430 mil habitantes, a cidade oferece centros comerciais completos, hospitais de referência e uma vida cultural vibrante — ideal para famílias que valorizam natureza e conectividade.
                </p>
                <p>
                  A Construtora Plenus atua em Jundiaí com projetos personalizados, execução impecável e total transparência. Terreno + construção com economia de até 40%.{" "}
                  <Link href="/projetos" className="text-white/50 underline underline-offset-2 hover:text-white/70 transition-colors">Projetos</Link>{" · "}
                  <Link href="/blog/construir-ou-comprar-casa-pronta" className="text-white/50 underline underline-offset-2 hover:text-white/70 transition-colors">Construir ou comprar pronto?</Link>{" · "}
                  <Link href="/blog/como-escolher-construtora-ideal-indaiatuba-jundiai" className="text-white/50 underline underline-offset-2 hover:text-white/70 transition-colors">Como escolher a construtora ideal</Link>
                </p>
              </article>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ChatBot />
    </>
  );
}
