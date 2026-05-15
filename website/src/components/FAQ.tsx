"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem } from "./ScrollAnimations";

const faqs = [
  {
    question: "Quanto custa construir uma casa em Indaiatuba?",
    answer: `O custo varia conforme o padrão de acabamento e o tamanho do projeto. Em ${new Date().getFullYear()}, o valor médio do metro quadrado da construção no Brasil é de R$ 1.920,74 (SINAPI). Na Plenus, oferecemos orçamentos detalhados e personalizados para que você saiba exatamente quanto vai investir.`,
  },
  {
    question: "A Plenus oferece terreno + construção?",
    answer:
      "Sim! Nosso modelo de negócio é a solução completa de terreno + construção. Ajudamos você a encontrar o terreno ideal em Indaiatuba ou Jundiaí e cuidamos de todo o processo construtivo, do projeto à entrega das chaves.",
  },
  {
    question: "Qual o prazo médio para construir uma casa?",
    answer:
      "O prazo varia de 8 a 14 meses, dependendo do tamanho e da complexidade do projeto. Na Plenus, trabalhamos com cronogramas detalhados e gestão profissional para cumprir os prazos combinados.",
  },
  {
    question: "A Plenus constrói em condomínios fechados?",
    answer:
      "Sim, temos ampla experiência em construções dentro de condomínios fechados em Indaiatuba e Jundiaí. Conhecemos as regras e exigências de cada empreendimento e garantimos que o projeto esteja em total conformidade.",
  },
  {
    question: "Como funciona o financiamento para construção?",
    answer:
      "Oferecemos assessoria completa para financiamento da sua obra. Trabalhamos com os principais bancos e ajudamos em toda a documentação, análise de crédito e aprovação. Consulte nossa página de financiamento para mais detalhes.",
  },
  {
    question: "A Plenus atende Jundiaí e região?",
    answer:
      "Sim! Atuamos em Indaiatuba, Jundiaí e toda a região metropolitana. Nossa equipe conhece profundamente essas cidades, o que nos permite orientar nossos clientes sobre as melhores localizações e oportunidades de construção.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] transition-all duration-300">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 sm:p-6 text-left"
      >
        <span className="font-[var(--font-playfair)] text-lg font-semibold text-[#1a1a1a] pr-4">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 w-8 h-8 bg-[#c41e3a]/10 rounded-full flex items-center justify-center"
        >
          <svg
            className="w-4 h-4 text-[#c41e3a]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 text-[#525252] leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 lg:py-32 bg-[#fafafa]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <FadeIn>
            <p className="text-[#737373] text-sm font-semibold tracking-[0.2em] uppercase mb-4">
              Perguntas Frequentes
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="font-[var(--font-playfair)] text-3xl md:text-5xl font-bold text-[#1a1a1a] mb-6">
              Dúvidas <span className="text-[#525252]">Comuns</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-lg text-[#525252] leading-relaxed">
              Tire suas principais dúvidas sobre construção de casas em
              Indaiatuba e Jundiaí.
            </p>
          </FadeIn>
        </div>

        {/* FAQ Items */}
        <StaggerContainer className="space-y-4" staggerDelay={0.1}>
          {faqs.map((faq, index) => (
            <StaggerItem key={index}>
              <FAQItem
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onToggle={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
