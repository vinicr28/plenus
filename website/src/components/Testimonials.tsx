"use client";

import { FadeIn, StaggerContainer, StaggerItem } from "./ScrollAnimations";

const testimonials = [
  {
    name: "Carlos e Maria Silva",
    location: "Indaiatuba, SP",
    text: "A Plenus transformou nosso sonho em realidade. A equipe foi extremamente profissional e transparente durante todo o processo. Recomendamos de olhos fechados!",
    rating: 5,
  },
  {
    name: "Roberto Fernandes",
    location: "Jundiaí, SP",
    text: "Qualidade excepcional e entrega no prazo. A economia prometida foi real e a casa ficou exatamente como imaginamos. Muito satisfeitos!",
    rating: 5,
  },
  {
    name: "Ana Paula Oliveira",
    location: "Indaiatuba, SP",
    text: "Desde o primeiro contato até a entrega das chaves, a experiência foi incrível. A equipe Plenus está sempre disponível e pronta para ajudar.",
    rating: 5,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${
            i < rating ? "text-[#c41e3a]" : "text-[#e5e5e5]"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="depoimentos" className="py-24 lg:py-32 bg-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <FadeIn>
            <p className="text-[#c41e3a] text-sm font-semibold tracking-[0.2em] uppercase mb-4">
              Depoimentos
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="font-[var(--font-playfair)] text-3xl md:text-5xl font-bold text-white mb-6">
              O Que Nossos{" "}
              <span className="text-[#c41e3a]">Clientes Dizem</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-lg text-white/70 leading-relaxed">
              A satisfação de nossos clientes é o nosso maior patrimônio.
            </p>
          </FadeIn>
        </div>

        {/* Testimonials grid */}
        <StaggerContainer
          className="grid md:grid-cols-3 gap-6"
          staggerDelay={0.15}
        >
          {testimonials.map((testimonial, index) => (
            <StaggerItem key={index}>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl h-full">
                {/* Quote icon */}
                <div className="mb-6">
                  <svg
                    className="w-10 h-10 text-[#c41e3a]/40"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>

                {/* Rating */}
                <div className="mb-4">
                  <StarRating rating={testimonial.rating} />
                </div>

                {/* Text */}
                <p className="text-white/80 leading-relaxed mb-6">
                  &ldquo;{testimonial.text}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#c41e3a]/20 rounded-full flex items-center justify-center">
                    <span className="text-[#c41e3a] font-bold text-lg">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-white/50">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
