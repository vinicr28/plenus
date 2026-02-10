"use client";

import { motion } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem } from "./ScrollAnimations";

const features = [
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
        />
      </svg>
    ),
    title: "Mapa Interativo",
    description: "Navegue pelo mapa 3D e explore cada projeto",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
    ),
    title: "Obras ao Vivo",
    description: "Acompanhe o progresso em tempo real",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
    title: "Total Transparência",
    description: "Segurança e confiança do início ao fim",
  },
];

export default function Map3D() {
  return (
    <section id="mapa" className="py-24 lg:py-32 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left column - Content */}
          <div>
            <FadeIn>
              <div className="inline-flex items-center gap-2 bg-[#c41e3a]/10 border border-[#c41e3a]/20 rounded-full px-4 py-2 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c41e3a] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c41e3a]"></span>
                </span>
                <span className="text-[#c41e3a] text-sm font-medium">
                  Tecnologia Exclusiva
                </span>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h2 className="font-[var(--font-playfair)] text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Mapa 3D das
                <br />
                <span className="text-[#c41e3a]">Obras Plenus</span>
              </h2>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="text-lg text-white/70 leading-relaxed mb-8">
                Explore nossos projetos através de um mapa 3D interativo
                exclusivo. Visualize a localização de cada obra e acompanhe o
                progresso da construção em tempo real, com total transparência e
                segurança.
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <p className="text-white/60 leading-relaxed mb-10">
                Uma inovação da Plenus Obras que aproxima você do seu sonho.
                Tecnologia aplicada à construção civil para garantir sua
                tranquilidade do início ao fim da obra.
              </p>
            </FadeIn>

            {/* Features */}
            <StaggerContainer className="space-y-4 mb-10" staggerDelay={0.1}>
              {features.map((feature, index) => (
                <StaggerItem key={index}>
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-[#c41e3a] group-hover:bg-[#c41e3a] group-hover:text-white transition-all duration-300 flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-white/50">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* CTA */}
            <FadeIn delay={0.5}>
              <a
                href="https://www.indaiatuba360.com.br/plenus/tourvirtual.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#c41e3a] text-white font-semibold rounded-full hover:bg-[#a01830] transition-all hover:scale-105 group"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
                Explore o Mapa 3D
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
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
              </a>
            </FadeIn>
          </div>

          {/* Right column - 3D Map Preview */}
          <FadeIn delay={0.2} direction="left">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-[#c41e3a]/20 rounded-3xl blur-3xl opacity-30" />

              {/* Main preview container */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative bg-gradient-to-br from-[#1a1a1a] to-[#262626] rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
              >
                {/* Browser-like header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-black/30 border-b border-white/5">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                    <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-white/5 rounded-lg px-3 py-1.5 text-xs text-white/40 text-center">
                      indaiatuba360.com.br/plenus
                    </div>
                  </div>
                </div>

                {/* Map preview area */}
                <div className="aspect-[4/3] relative bg-[#0a0a0a]">
                  {/* Simulated 3D map visualization */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* Grid pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <pattern
                            id="grid"
                            width="40"
                            height="40"
                            patternUnits="userSpaceOnUse"
                          >
                            <path
                              d="M 40 0 L 0 0 0 40"
                              fill="none"
                              stroke="white"
                              strokeWidth="0.5"
                            />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                      </svg>
                    </div>

                    {/* Animated location markers */}
                    <motion.div
                      whileInView={{ y: [0, -5, 0] }}
                      viewport={{ once: true }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute top-1/4 left-1/3"
                    >
                      <div className="relative">
                        <div className="w-4 h-4 bg-[#c41e3a] rounded-full" />
                        <div className="absolute inset-0 bg-[#c41e3a] rounded-full animate-ping opacity-50" />
                      </div>
                    </motion.div>

                    <motion.div
                      whileInView={{ y: [0, -5, 0] }}
                      viewport={{ once: true }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      className="absolute top-1/2 right-1/4"
                    >
                      <div className="relative">
                        <div className="w-4 h-4 bg-[#c41e3a] rounded-full" />
                        <div className="absolute inset-0 bg-[#c41e3a] rounded-full animate-ping opacity-50" />
                      </div>
                    </motion.div>

                    <motion.div
                      whileInView={{ y: [0, -5, 0] }}
                      viewport={{ once: true }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                      className="absolute bottom-1/3 left-1/2"
                    >
                      <div className="relative">
                        <div className="w-4 h-4 bg-[#c41e3a] rounded-full" />
                        <div className="absolute inset-0 bg-[#c41e3a] rounded-full animate-ping opacity-50" />
                      </div>
                    </motion.div>

                    {/* Center icon */}
                    <div className="relative z-10 flex flex-col items-center">
                      <motion.div
                        whileInView={{ rotateY: [0, 360] }}
                        viewport={{ once: true }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="w-24 h-24 bg-gradient-to-br from-[#c41e3a]/20 to-transparent rounded-full flex items-center justify-center border border-[#c41e3a]/30"
                      >
                        <svg
                          className="w-12 h-12 text-[#c41e3a]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </motion.div>
                      <p className="mt-4 text-white/60 text-sm font-medium">
                        Tour Virtual 360°
                      </p>
                    </div>
                  </div>

                  {/* Stats overlay */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                    <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
                      <p className="text-[10px] text-white/50 uppercase tracking-wider">
                        Obras Ativas
                      </p>
                      <p className="text-lg font-bold text-white">12</p>
                    </div>
                    <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
                      <p className="text-[10px] text-white/50 uppercase tracking-wider">
                        Concluídas
                      </p>
                      <p className="text-lg font-bold text-[#c41e3a]">150+</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl px-4 py-3 border border-[#e5e5e5]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#c41e3a]/10 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-[#c41e3a]"
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
                  <div>
                    <p className="text-xs text-[#737373]">Visualização</p>
                    <p className="font-semibold text-[#1a1a1a]">Tempo Real</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
