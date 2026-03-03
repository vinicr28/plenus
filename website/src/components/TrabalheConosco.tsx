"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "./ScrollAnimations";
import { useScrollLock } from "@/lib/useScrollLock";

export default function TrabalheConosco() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    areaInteresse: "",
    sobreVoce: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useScrollLock(isModalOpen);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    if (isModalOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isModalOpen]);

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
          formType: "trabalhe-conosco",
          data: formData,
        }),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({
          nome: "",
          email: "",
          telefone: "",
          areaInteresse: "",
          sobreVoce: "",
        });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Reset form state when closing
    if (status === "success") {
      setTimeout(() => setStatus("idle"), 300);
    }
  };

  return (
    <>
      <section
        id="trabalhe-conosco"
        className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
      >
        {/* Background image */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/hero-background.webp')" }}
          />
          {/* Gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e]/40 via-[#1a1a1a]/50 to-[#0a0a0a]/70" />
        </div>

        {/* Atmospheric glows — hidden on mobile */}
        <div className="absolute inset-0 pointer-events-none hidden md:block">
          <div
            className="absolute top-10 left-20 w-[400px] h-[400px] rounded-full opacity-20"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(196,30,58,0.4) 0%, transparent 60%)",
              filter: "blur(60px)",
            }}
          />
          <div
            className="absolute bottom-10 right-20 w-[300px] h-[300px] rounded-full opacity-15"
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
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 py-24">
          {/* Glass container */}
          <div
            className="backdrop-blur-xl md:backdrop-blur-2xl rounded-3xl p-8 md:p-12 lg:p-16 shadow-2xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 100%)",
              border: "1px solid rgba(255,255,255,0.3)",
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.1)",
            }}
          >
            <div className="text-center">
              <FadeIn>
                <p className="text-[#1a1a1a] text-sm font-semibold tracking-[0.3em] uppercase mb-6">
                  Faça Parte do Time
                </p>
              </FadeIn>

              <FadeIn delay={0.1}>
                <h2 className="font-[var(--font-playfair)] text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                  Trabalhe Conosco
                </h2>
              </FadeIn>

              <FadeIn delay={0.2}>
                <p className="max-w-2xl mx-auto text-lg text-white/80 leading-relaxed mb-10">
                  Estamos sempre em busca de talentos que compartilham nossa
                  paixão por construir sonhos. Junte-se à nossa equipe e faça
                  parte de projetos que transformam vidas.
                </p>
              </FadeIn>

              <FadeIn delay={0.3}>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center justify-center px-8 py-4 bg-[#c41e3a] text-white text-base font-semibold rounded-full hover:bg-[#a01830] transition-all hover:scale-105"
                >
                  Enviar Currículo
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
                </button>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            onClick={handleCloseModal}
          >
            {/* Backdrop with blur */}
            <motion.div
              initial={{ backdropFilter: "blur(0px)" }}
              animate={{ backdropFilter: "blur(20px)" }}
              exit={{ backdropFilter: "blur(0px)" }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 bg-black/60"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 100 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
                duration: 0.5,
              }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden rounded-3xl"
            >
              {/* Glassmorphism background */}
              <div
                className="absolute inset-0 rounded-3xl"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.95) 100%)",
                  backdropFilter: "blur(40px)",
                }}
              />

              {/* Close button */}
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 500 }}
                onClick={handleCloseModal}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/10 backdrop-blur-sm flex items-center justify-center hover:bg-black/20 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-[#1a1a1a]"
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
              </motion.button>

              {/* Content */}
              <div className="relative z-10 p-5 sm:p-8 lg:p-10 max-h-[90vh] overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="font-[var(--font-playfair)] text-2xl font-bold text-[#1a1a1a] mb-2">
                    Junte-se à Nossa Equipe
                  </h3>
                  <p className="text-[#525252] mb-8">
                    Preencha o formulário abaixo e entraremos em contato.
                  </p>
                </motion.div>

                {status === "success" ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-semibold text-[#1a1a1a] mb-2">Candidatura Enviada!</h4>
                    <p className="text-[#525252] mb-6">Analisaremos seu perfil e entraremos em contato.</p>
                    <button
                      onClick={() => setStatus("idle")}
                      className="text-[#c41e3a] font-medium hover:underline"
                    >
                      Enviar outra candidatura
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    onSubmit={handleSubmit}
                    className="space-y-4 sm:space-y-6"
                  >
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
                        E-mail <span className="text-[#c41e3a]">*</span>
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
                        Área de interesse
                      </label>
                      <select
                        name="areaInteresse"
                        value={formData.areaInteresse}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c41e3a]/20 focus:border-[#c41e3a] shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200 text-[#525252]"
                      >
                        <option value="">Selecione uma área</option>
                        <option value="Engenharia">Engenharia</option>
                        <option value="Arquitetura">Arquitetura</option>
                        <option value="Administrativo">Administrativo</option>
                        <option value="Comercial">Comercial</option>
                        <option value="Obras">Obras</option>
                        <option value="Outro">Outro</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#525252] mb-2">
                        Conte-nos sobre você
                      </label>
                      <textarea
                        name="sobreVoce"
                        value={formData.sobreVoce}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Descreva sua experiência e por que deseja trabalhar conosco..."
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
                        "Enviar Candidatura"
                      )}
                    </button>
                  </motion.form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
