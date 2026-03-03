"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { FadeIn, StaggerContainer, StaggerItem } from "./ScrollAnimations";
import { useScrollLock } from "@/lib/useScrollLock";

const steps = [
  {
    number: 1,
    title: "Consulta",
    description: "Entendemos seu sonho e necessidades",
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
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
  },
  {
    number: 2,
    title: "Projeto",
    description: "Desenvolvemos o projeto personalizado",
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
          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
        />
      </svg>
    ),
  },
  {
    number: 3,
    title: "Aprovação",
    description: "Documentação e aprovações legais",
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
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />
      </svg>
    ),
  },
  {
    number: 4,
    title: "Construção",
    description: "Execução com qualidade e transparência",
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
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
        />
      </svg>
    ),
  },
  {
    number: 5,
    title: "Entrega",
    description: "Sua casa pronta para morar",
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
          d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
        />
      </svg>
    ),
  },
  {
    number: 6,
    title: "Pós-Venda",
    description: "Suporte contínuo após a entrega",
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
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    ),
  },
];

export default function Process() {
  const [isOpen, setIsOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, []);

  useScrollLock(isOpen);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, closeModal]);

  return (
    <section id="processo" className="py-24 lg:py-32 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <FadeIn>
            <p className="text-[#737373] text-sm font-semibold tracking-[0.2em] uppercase mb-4">
              Etapas do seu projeto
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="font-[var(--font-playfair)] text-3xl md:text-5xl font-bold text-[#1a1a1a] mb-6">
              Como <span className="text-[#525252]">Funciona</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-lg text-[#525252] leading-relaxed">
              Conheça as etapas do seu projeto com a Plenus
            </p>
          </FadeIn>
        </div>

        {/* Desktop Timeline - Horizontal */}
        <div className="hidden lg:block">
          <StaggerContainer className="relative" staggerDelay={0.1}>
            {/* Connecting line */}
            <div className="absolute top-8 left-[8.33%] right-[8.33%] h-0.5 bg-gray-200">
              <div className="absolute inset-0 bg-gradient-to-r from-[#c41e3a]/20 via-[#c41e3a]/40 to-[#c41e3a]/20" />
            </div>

            {/* Steps */}
            <div className="grid grid-cols-6 gap-4">
              {steps.map((step, index) => (
                <StaggerItem key={index} className="relative">
                  <div className="flex flex-col items-center text-center">
                    {/* Step number circle */}
                    <div className="relative z-10 w-16 h-16 bg-white rounded-full border-2 border-[#c41e3a] flex items-center justify-center mb-4 shadow-lg group hover:bg-[#c41e3a] transition-all duration-300">
                      <span className="text-[#c41e3a] font-bold text-xl group-hover:hidden">
                        {step.number}
                      </span>
                      <span className="text-white hidden group-hover:block">
                        {step.icon}
                      </span>
                    </div>

                    {/* Content */}
                    <h3 className="font-[var(--font-playfair)] text-lg font-bold text-[#1a1a1a] mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[#525252] leading-relaxed px-2">
                      {step.description}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>

        {/* Mobile Timeline - Vertical */}
        <div className="lg:hidden">
          <StaggerContainer className="relative" staggerDelay={0.15}>
            {/* Connecting line */}
            <div className="absolute top-0 bottom-0 left-8 w-0.5 bg-gray-200">
              <div className="absolute inset-0 bg-gradient-to-b from-[#c41e3a]/20 via-[#c41e3a]/40 to-[#c41e3a]/20" />
            </div>

            {/* Steps */}
            <div className="space-y-8">
              {steps.map((step, index) => (
                <StaggerItem key={index} className="relative">
                  <div className="flex items-start gap-6">
                    {/* Step number circle */}
                    <div className="relative z-10 flex-shrink-0 w-16 h-16 bg-white rounded-full border-2 border-[#c41e3a] flex items-center justify-center shadow-lg">
                      <span className="text-[#c41e3a] font-bold text-xl">
                        {step.number}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="pt-3">
                      <h3 className="font-[var(--font-playfair)] text-xl font-bold text-[#1a1a1a] mb-1">
                        {step.title}
                      </h3>
                      <p className="text-[#525252] leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>

        {/* Video Thumbnail */}
        <FadeIn delay={0.3}>
          <div
            className="mt-16 max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-lg cursor-pointer group relative"
            onClick={() => setIsOpen(true)}
          >
            <video
              className="w-full aspect-video object-cover"
              muted
              playsInline
              preload="metadata"
              src="/0113-compressed.mp4#t=26"
            />
            {/* Play button overlay */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
              <div className="w-20 h-20 bg-white/90 group-hover:bg-white group-hover:scale-110 transition-all duration-300 rounded-full flex items-center justify-center shadow-xl">
                <svg
                  className="w-8 h-8 text-[#c41e3a] ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Video Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          {/* Modal content */}
          <div
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 text-white/80 hover:text-white transition-colors"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <video
                ref={videoRef}
                className="w-full aspect-video"
                controls
                autoPlay
                playsInline
              >
                <source src="/0113-compressed.mp4" type="video/mp4" />
                Seu navegador não suporta a reprodução de vídeos.
              </video>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
