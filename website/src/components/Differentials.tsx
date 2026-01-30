"use client";

import { FadeIn, StaggerContainer, StaggerItem } from "./ScrollAnimations";

const differentials = [
  {
    title: "Integridade",
    description: "Transparência e honestidade em cada etapa",
    icon: (
      <svg
        className="w-8 h-8"
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
  },
  {
    title: "Excelência",
    description: "Compromisso com a mais alta qualidade",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
        />
      </svg>
    ),
  },
  {
    title: "Parceria",
    description: "Construímos junto com nossos clientes",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
  {
    title: "Compromisso",
    description: "Entregas dentro do prazo e orçamento",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];

export default function Differentials() {
  return (
    <section id="diferenciais" className="py-24 lg:py-32 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <FadeIn>
            <p className="text-[#c41e3a] text-sm font-semibold tracking-[0.2em] uppercase mb-4">
              Por que escolher a Plenus
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="font-[var(--font-playfair)] text-3xl md:text-5xl font-bold text-[#1a1a1a] mb-6">
              Nossos <span className="text-[#c41e3a]">Diferenciais</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-lg text-[#525252] leading-relaxed">
              O que nos torna a escolha certa para realizar o sonho da sua casa
              própria.
            </p>
          </FadeIn>
        </div>

        {/* Differentials grid */}
        <StaggerContainer
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          staggerDelay={0.15}
        >
          {differentials.map((item, index) => (
            <StaggerItem key={index}>
              <div className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 h-full border border-[#e5e5e5] hover:border-[#c41e3a]/20">
                <div className="w-16 h-16 bg-[#c41e3a]/10 rounded-2xl flex items-center justify-center mb-6 text-[#c41e3a] group-hover:bg-[#c41e3a] group-hover:text-white transition-all duration-300">
                  {item.icon}
                </div>
                <h3 className="font-[var(--font-playfair)] text-xl font-bold text-[#1a1a1a] mb-3">
                  {item.title}
                </h3>
                <p className="text-[#525252] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
