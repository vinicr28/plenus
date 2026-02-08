"use client";

import { useState } from "react";
import { FadeIn } from "./ScrollAnimations";

export default function Contact() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    tipoProjeto: "",
    mensagem: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "contact",
          data: formData,
        }),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({
          nome: "",
          email: "",
          telefone: "",
          tipoProjeto: "",
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
    <section id="contato" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left column - Info */}
          <div>
            <FadeIn>
              <p className="text-[#737373] text-sm font-semibold tracking-[0.2em] uppercase mb-4">
                Entre em Contato
              </p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="font-[var(--font-playfair)] text-3xl md:text-5xl font-bold text-[#1a1a1a] mb-6">
                Vamos Realizar Seu{" "}
                <span className="text-[#525252]">Sonho Juntos</span>
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-lg text-[#525252] leading-relaxed mb-10">
                Preencha o formulário ao lado ou entre em contato diretamente
                conosco. Nossa equipe está pronta para atendê-lo e tirar todas
                as suas dúvidas.
              </p>
            </FadeIn>

            {/* Contact info */}
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
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-[#1a1a1a]">Telefone</p>
                    <p className="text-[#525252]">(19) 99999-9999</p>
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
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-[#1a1a1a]">E-mail</p>
                    <p className="text-[#525252]">contato@plenusobras.com.br</p>
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
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-[#1a1a1a]">Localização</p>
                    <p className="text-[#525252]">
                      Indaiatuba e Jundiaí, SP
                    </p>
                  </div>
                </div>
              </FadeIn>

              {/* Social links */}
              <FadeIn delay={0.6}>
                <div className="pt-6">
                  <p className="font-semibold text-[#1a1a1a] mb-4">
                    Siga-nos nas redes
                  </p>
                  <div className="flex gap-4">
                    <a
                      href="https://www.instagram.com/plenusobrasoficial/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-[#1a1a1a] rounded-xl flex items-center justify-center text-white hover:bg-[#c41e3a] transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="w-12 h-12 bg-[#1a1a1a] rounded-xl flex items-center justify-center text-white hover:bg-[#c41e3a] transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="w-12 h-12 bg-[#1a1a1a] rounded-xl flex items-center justify-center text-white hover:bg-[#c41e3a] transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>

          {/* Right column - Form */}
          <FadeIn delay={0.2} direction="left">
            <div className="bg-white/90 backdrop-blur-md p-8 lg:p-10 rounded-3xl border border-gray-200/60 shadow-[0_4px_40px_-8px_rgba(0,0,0,0.1)]">
              <h3 className="font-[var(--font-playfair)] text-2xl font-bold text-[#1a1a1a] mb-6">
                Solicite seu Orçamento
              </h3>

              {status === "success" ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-[#1a1a1a] mb-2">Mensagem Enviada!</h4>
                  <p className="text-[#525252] mb-6">Entraremos em contato em breve.</p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="text-[#c41e3a] font-medium hover:underline"
                  >
                    Enviar outra mensagem
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#525252] mb-2">
                      Nome completo
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
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#525252] mb-2">
                        E-mail
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="seu@email.com"
                        required
                        className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c41e3a]/20 focus:border-[#c41e3a] shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#525252] mb-2">
                        Telefone
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
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#525252] mb-2">
                      Tipo de projeto
                    </label>
                    <select
                      name="tipoProjeto"
                      value={formData.tipoProjeto}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c41e3a]/20 focus:border-[#c41e3a] shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200 text-[#525252]"
                    >
                      <option value="">Selecione uma opção</option>
                      <option value="Terreno + Construção">
                        Terreno + Construção
                      </option>
                      <option value="Apenas Construção">Apenas Construção</option>
                      <option value="Reforma">Reforma</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#525252] mb-2">
                      Mensagem
                    </label>
                    <textarea
                      name="mensagem"
                      value={formData.mensagem}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Conte-nos mais sobre o seu projeto..."
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
        </div>
      </div>
    </section>
  );
}
