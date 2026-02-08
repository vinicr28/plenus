"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Financiamento() {
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    endereco: "",
    dataNascimento: "",
    observacao: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setFormData((prev) => ({ ...prev, cpf: formatted }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const message = `*Financiamento - Plenus Obras*

Olá! Tenho interesse no serviço de financiamento.

*Dados do Cliente:*
• Nome: ${formData.nome}
• CPF: ${formData.cpf}
• Endereço: ${formData.endereco}
• Data de Nascimento: ${formData.dataNascimento}

*Observações:*
${formData.observacao || "Nenhuma observação"}

Aguardo retorno. Obrigado!`;

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = "5519999999999"; // Replace with actual WhatsApp number
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappURL, "_blank");
  };

  return (
    <>
      <Header />
      <main>
        {/* Hero Section with Form */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
          {/* Background image */}
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1973&q=80')",
              }}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e]/70 via-[#1a1a1a]/60 to-[#0a0a0a]/80" />
          </div>

          {/* Atmospheric glows */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute top-20 right-20 w-[500px] h-[500px] rounded-full opacity-20"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(196,30,58,0.4) 0%, transparent 60%)",
                filter: "blur(60px)",
              }}
            />
            <div
              className="absolute bottom-20 left-20 w-[400px] h-[400px] rounded-full opacity-15"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(15,52,96,0.5) 0%, transparent 60%)",
                filter: "blur(80px)",
              }}
            />
          </div>

          {/* Vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0,0,0,0.4) 100%)",
            }}
          />

          {/* Content */}
          <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 py-16">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left - Info */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Link
                  href="/"
                  className="inline-flex items-center text-white/70 hover:text-white mb-8 transition-colors"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Voltar para Home
                </Link>

                <p className="text-[#c41e3a] text-sm font-semibold tracking-[0.3em] uppercase mb-4">
                  Realize Seu Sonho
                </p>

                <h1 className="font-[var(--font-playfair)] text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                  Financiamento{" "}
                  <span className="text-white/80">Facilitado</span>
                </h1>

                <p className="text-lg text-white/80 leading-relaxed mb-8">
                  A Plenus oferece assessoria completa para o seu financiamento
                  imobiliário. Nossa equipe especializada irá te acompanhar em
                  todo o processo, desde a análise de crédito até a aprovação
                  final.
                </p>

                {/* Benefits */}
                <div className="space-y-4">
                  {[
                    "Análise de crédito personalizada",
                    "Parceria com os principais bancos",
                    "Acompanhamento em todo o processo",
                    "Taxas competitivas no mercado",
                  ].map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#c41e3a]/20 flex items-center justify-center">
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
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-white/90">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Right - Form */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div
                  className="backdrop-blur-2xl rounded-3xl p-8 lg:p-10 shadow-2xl"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    boxShadow:
                      "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
                  }}
                >
                  <h2 className="font-[var(--font-playfair)] text-2xl font-bold text-[#1a1a1a] mb-2">
                    Solicite sua Análise
                  </h2>
                  <p className="text-[#525252] mb-8">
                    Preencha o formulário e entraremos em contato via WhatsApp.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-5">
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

                    <div>
                      <label className="block text-sm font-medium text-[#525252] mb-2">
                        CPF
                      </label>
                      <input
                        type="text"
                        name="cpf"
                        value={formData.cpf}
                        onChange={handleCPFChange}
                        placeholder="000.000.000-00"
                        maxLength={14}
                        required
                        className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c41e3a]/20 focus:border-[#c41e3a] shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#525252] mb-2">
                        Endereço
                      </label>
                      <input
                        type="text"
                        name="endereco"
                        value={formData.endereco}
                        onChange={handleChange}
                        placeholder="Rua, número, bairro, cidade"
                        required
                        className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c41e3a]/20 focus:border-[#c41e3a] shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#525252] mb-2">
                        Data de Nascimento
                      </label>
                      <input
                        type="date"
                        name="dataNascimento"
                        value={formData.dataNascimento}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c41e3a]/20 focus:border-[#c41e3a] shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#525252] mb-2">
                        Observação
                      </label>
                      <textarea
                        name="observacao"
                        value={formData.observacao}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Informações adicionais (opcional)"
                        className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c41e3a]/20 focus:border-[#c41e3a] shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-[#25D366] text-white font-semibold rounded-xl hover:bg-[#1da851] transition-all flex items-center justify-center gap-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Enviar via WhatsApp
                    </button>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
