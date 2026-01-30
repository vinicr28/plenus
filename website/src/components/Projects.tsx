"use client";

import { motion } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem } from "./ScrollAnimations";

const projects = [
  {
    title: "Residência Moderna",
    location: "Indaiatuba, SP",
    area: "250m²",
    category: "Casa Térrea",
  },
  {
    title: "Casa Contemporânea",
    location: "Jundiaí, SP",
    area: "320m²",
    category: "Sobrado",
  },
  {
    title: "Projeto Personalizado",
    location: "Indaiatuba, SP",
    area: "280m²",
    category: "Casa Térrea",
  },
  {
    title: "Residência Premium",
    location: "Jundiaí, SP",
    area: "400m²",
    category: "Sobrado",
  },
  {
    title: "Casa Elegante",
    location: "Indaiatuba, SP",
    area: "220m²",
    category: "Casa Térrea",
  },
  {
    title: "Projeto Exclusivo",
    location: "Jundiaí, SP",
    area: "350m²",
    category: "Sobrado",
  },
];

export default function Projects() {
  return (
    <section id="projetos" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <FadeIn>
            <p className="text-[#c41e3a] text-sm font-semibold tracking-[0.2em] uppercase mb-4">
              Portfólio
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="font-[var(--font-playfair)] text-3xl md:text-5xl font-bold text-[#1a1a1a] mb-6">
              Nossos <span className="text-[#c41e3a]">Projetos</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-lg text-[#525252] leading-relaxed">
              Conheça alguns dos sonhos que já realizamos para famílias como a
              sua.
            </p>
          </FadeIn>
        </div>

        {/* Projects grid */}
        <StaggerContainer
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          staggerDelay={0.1}
        >
          {projects.map((project, index) => (
            <StaggerItem key={index}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                className="group cursor-pointer"
              >
                {/* Image placeholder */}
                <div className="aspect-[4/3] bg-gradient-to-br from-[#e5e5e5] to-[#d4d4d4] rounded-2xl mb-4 overflow-hidden relative">
                  <div className="absolute inset-0 bg-[#1a1a1a]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white font-medium">Ver Projeto</span>
                  </div>
                  {/* Placeholder pattern */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="w-16 h-16 text-[#a3a3a3]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                  </div>
                </div>

                {/* Project info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-[#c41e3a] bg-[#c41e3a]/10 px-3 py-1 rounded-full">
                      {project.category}
                    </span>
                    <span className="text-xs text-[#737373]">
                      {project.area}
                    </span>
                  </div>
                  <h3 className="font-[var(--font-playfair)] text-lg font-bold text-[#1a1a1a] group-hover:text-[#c41e3a] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-[#737373] flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {project.location}
                  </p>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* CTA */}
        <FadeIn delay={0.3}>
          <div className="text-center mt-12">
            <a
              href="#contato"
              className="inline-flex items-center text-[#c41e3a] font-semibold hover:underline"
            >
              Ver todos os projetos
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
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
