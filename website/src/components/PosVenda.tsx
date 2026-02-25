"use client";

import { useState } from "react";
import { FadeIn } from "./ScrollAnimations";

export default function PosVenda() {
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    endereco: "",
    mensagem: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome.trim() || !formData.telefone.trim() || !formData.endereco.trim()) {
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "pos-venda",
          data: formData,
        }),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({
          nome: "",
          telefone: "",
          endereco: "",
          mensagem: "",
        });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="pos-venda" className="py-24 lg:py-32 bg-[#f8f8f8]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left column - Form */}
          <FadeIn delay={0.2} direction="right">
            <div className="bg-white/90 backdrop-blur-md p-5 sm:p-8 lg:p-10 rounded-3xl border border-gray-200/60 shadow-[0_4px_40px_-8px_rgba(0,0,0,0.1)]">
              <h3 className="font-[var(--font-playfair)] text-2xl font-bold text-[#1a1a1a] mb-6">
                Fale com o Pós-venda
              </h3>

              {status === "success" ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-[#1a1a1a] mb-2">Solicitação Enviada!</h4>
                  <p className="text-[#525252] mb-6">Nossa equipe entrará em contato em breve.</p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="text-[#c41e3a] font-medium hover:underline"
                  >
                    Enviar outra solicitação
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#525252] mb-2">
                      Nome completo <span className="text-[#c41e3a]">*</span>
                    </label>
                    <input
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      placeholder="Seu nome"
                      required
                      className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c41e3a]/20 focus:border-[#c41e3a] shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#525252] mb-2">
                      Telefone <span className="text-[#c41e3a]">*</span>
                    </label>
                    <input
                      type="tel"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      placeholder="(00) 00000-0000"
                      required
                      className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c41e3a]/20 focus:border-[#c41e3a] shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#525252] mb-2">
                      Endereço da obra <span className="text-[#c41e3a]">*</span>
                    </label>
                    <input
                      type="text"
                      name="endereco"
                      value={formData.endereco}
                      onChange={handleChange}
                      placeholder="Endereço completo da obra"
                      required
                      className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c41e3a]/20 focus:border-[#c41e3a] shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#525252] mb-2">
                      Mensagem
                    </label>
                    <textarea
                      name="mensagem"
                      value={formData.mensagem}
                      onChange={handleChange}
                      rows={6}
                      placeholder="Descreva detalhadamente sua solicitação..."
                      required
                      className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c41e3a]/20 focus:border-[#c41e3a] shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200 resize-none"
                    />
                  </div>

                  {status === "error" && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                      Ocorreu um erro ao enviar. Por favor, tente novamente.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full py-4 bg-[#c41e3a] text-white font-semibold rounded-xl hover:bg-[#a01830] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {status === "loading" ? (
                      <>
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Enviando...
                      </>
                    ) : (
                      "Enviar Solicitação"
                    )}
                  </button>
                </form>
              )}
            </div>
          </FadeIn>

          {/* Right column - Info */}
          <div>
            <FadeIn>
              <p className="text-[#737373] text-sm font-semibold tracking-[0.2em] uppercase mb-4">
                Pós-venda
              </p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="font-[var(--font-playfair)] text-3xl md:text-5xl font-bold text-[#1a1a1a] mb-6">
                Estamos Aqui{" "}
                <span className="text-[#525252]">Para Você</span>
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-lg text-[#525252] leading-relaxed mb-10">
                Nosso compromisso com você não termina na entrega das chaves.
                Conte com nossa equipe de pós-venda para qualquer dúvida,
                suporte ou assistência que precisar.
              </p>
            </FadeIn>

            {/* Benefits */}
            <div className="space-y-6">
              <FadeIn delay={0.3}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#c41e3a]/10 rounded-xl flex items-center justify-center flex-shrink-0">
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-[#1a1a1a]">Suporte Dedicado</p>
                    <p className="text-[#525252]">
                      Equipe especializada para atender suas solicitações
                    </p>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.4}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#c41e3a]/10 rounded-xl flex items-center justify-center flex-shrink-0">
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-[#1a1a1a]">Resposta Rápida</p>
                    <p className="text-[#525252]">
                      Retorno ágil para todas as suas demandas
                    </p>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.5}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#c41e3a]/10 rounded-xl flex items-center justify-center flex-shrink-0">
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
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-[#1a1a1a]">Assistência Técnica</p>
                    <p className="text-[#525252]">
                      Acompanhamento pós-entrega para sua tranquilidade
                    </p>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
