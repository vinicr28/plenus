"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Types ──────────────────────────────────────────────────────────────────────

type Step = "idle" | "greeting" | "ask_mensagem" | "ask_nome" | "ask_telefone" | "ask_endereco" | "sending" | "done";

interface ChatMessage {
  id: number;
  sender: "bot" | "user";
  text: string;
  options?: string[];
}

interface UserData {
  interesse: string;
  nome: string;
  telefone: string;
  endereco: string;
  mensagem: string;
}

// ── Bot logic (swap for LLM later) ────────────────────────────────────────────

function getBotResponse(
  step: Step,
  userData: UserData
): { text: string; options?: string[]; nextStep: Step } {
  switch (step) {
    case "greeting":
      return {
        text: "Olá! Sou o assistente da Plenus Obras. Como posso te ajudar?",
        options: ["Quero construir", "Financiamento", "Pós-venda", "Outro"],
        nextStep: "greeting",
      };
    case "ask_mensagem":
      return {
        text: "Conta pra gente! O que você precisa?",
        nextStep: "ask_mensagem",
      };
    case "ask_nome":
      return {
        text: "Ótimo! Vamos te conectar com nossa equipe. Qual é o seu nome?",
        nextStep: "ask_nome",
      };
    case "ask_telefone":
      return {
        text: `Prazer, ${userData.nome}! Qual o seu telefone para contato?`,
        nextStep: "ask_telefone",
      };
    case "ask_endereco":
      return {
        text: "Qual o endereço da obra?",
        nextStep: "ask_endereco",
      };
    case "done":
      return {
        text: "Perfeito! Seus dados foram enviados para nossa equipe.",
        nextStep: "done",
      };
    default:
      return { text: "", nextStep: "idle" };
  }
}

// ── Phone mask ─────────────────────────────────────────────────────────────────

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

// ── WhatsApp SVG ───────────────────────────────────────────────────────────────

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>("idle");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userData, setUserData] = useState<UserData>({ interesse: "", nome: "", telefone: "", endereco: "", mensagem: "" });
  const [inputValue, setInputValue] = useState("");
  const msgEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const nextId = useRef(0);

  // Auto-scroll on new message
  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when step changes
  useEffect(() => {
    if (step === "ask_mensagem") {
      setTimeout(() => textareaRef.current?.focus(), 300);
    } else if (step === "ask_nome" || step === "ask_telefone" || step === "ask_endereco") {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [step]);

  // Escape key closes widget
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const addMessage = useCallback(
    (sender: "bot" | "user", text: string, options?: string[]) => {
      setMessages((prev) => [...prev, { id: nextId.current++, sender, text, options }]);
    },
    []
  );

  // Open the chat
  const open = useCallback(() => {
    setIsOpen(true);
    if (step === "idle") {
      setStep("greeting");
      const res = getBotResponse("greeting", userData);
      addMessage("bot", res.text, res.options);
    }
  }, [step, userData, addMessage]);

  // Close and reset
  const close = useCallback(() => {
    setIsOpen(false);
    // Reset after exit animation
    setTimeout(() => {
      setStep("idle");
      setMessages([]);
      setUserData({ interesse: "", nome: "", telefone: "", endereco: "", mensagem: "" });
      setInputValue("");
      nextId.current = 0;
    }, 300);
  }, []);

  // Handle quick-reply selection
  const selectOption = useCallback(
    (option: string) => {
      addMessage("user", option);
      const updated = { ...userData, interesse: option };
      setUserData(updated);
      const nextStep = option === "Outro" ? "ask_mensagem" : "ask_nome";
      setStep(nextStep);
      setTimeout(() => {
        const res = getBotResponse(nextStep, updated);
        addMessage("bot", res.text);
      }, 400);
    },
    [userData, addMessage]
  );

  // Send lead to API
  const sendLead = useCallback(async (data: UserData) => {
    const isPosVenda = data.interesse === "Pós-venda";
    try {
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: isPosVenda ? "pos-venda" : "contact",
          data: isPosVenda
            ? { nome: data.nome, telefone: data.telefone, endereco: data.endereco, mensagem: "Lead via chatbot" }
            : { nome: data.nome, telefone: data.telefone, tipoProjeto: data.interesse, mensagem: data.mensagem || "Lead via chatbot" },
        }),
      });
    } catch {
      // best-effort
    }
  }, []);

  // Finish: send lead + show done
  const finishFlow = useCallback(async (updated: UserData) => {
    setStep("sending");
    await sendLead(updated);
    setStep("done");
    setTimeout(() => {
      const res = getBotResponse("done", updated);
      addMessage("bot", res.text);
    }, 400);
  }, [sendLead, addMessage]);

  // Submit text input
  const submit = useCallback(async () => {
    const value = inputValue.trim();
    if (!value) return;

    if (step === "ask_mensagem") {
      addMessage("user", value);
      const updated = { ...userData, mensagem: value };
      setUserData(updated);
      setInputValue("");
      setStep("ask_nome");
      setTimeout(() => {
        const res = getBotResponse("ask_nome", updated);
        addMessage("bot", res.text);
      }, 400);
      return;
    }

    if (step === "ask_nome") {
      addMessage("user", value);
      const updated = { ...userData, nome: value };
      setUserData(updated);
      setInputValue("");
      setStep("ask_telefone");
      setTimeout(() => {
        const res = getBotResponse("ask_telefone", updated);
        addMessage("bot", res.text);
      }, 400);
      return;
    }

    if (step === "ask_telefone") {
      addMessage("user", value);
      const updated = { ...userData, telefone: value };
      setUserData(updated);
      setInputValue("");

      // Pós-venda needs address next
      if (updated.interesse === "Pós-venda") {
        setStep("ask_endereco");
        setTimeout(() => {
          const res = getBotResponse("ask_endereco", updated);
          addMessage("bot", res.text);
        }, 400);
        return;
      }

      await finishFlow(updated);
      return;
    }

    if (step === "ask_endereco") {
      addMessage("user", value);
      const updated = { ...userData, endereco: value };
      setUserData(updated);
      setInputValue("");
      await finishFlow(updated);
    }
  }, [inputValue, step, userData, addMessage, finishFlow]);

  const openWhatsApp = useCallback(() => {
    let text = `Olá! Sou ${userData.nome}, tenho interesse em: ${userData.interesse}. Meu telefone: ${userData.telefone}.`;
    if (userData.endereco) text += ` Endereço da obra: ${userData.endereco}.`;
    if (userData.mensagem) text += ` ${userData.mensagem}`;
    window.open(`https://wa.me/5519992937486?text=${encodeURIComponent(text)}`, "_blank");
  }, [userData]);

  const restart = useCallback(() => {
    setStep("idle");
    setMessages([]);
    setUserData({ interesse: "", nome: "", telefone: "", endereco: "", mensagem: "" });
    setInputValue("");
    nextId.current = 0;
    // Re-open fresh
    setTimeout(() => {
      setStep("greeting");
      const fresh: UserData = { interesse: "", nome: "", telefone: "", endereco: "", mensagem: "" };
      const res = getBotResponse("greeting", fresh);
      setMessages([{ id: 0, sender: "bot", text: res.text, options: res.options }]);
      nextId.current = 1;
    }, 100);
  }, []);

  return (
    <>
      {/* ── Chat window ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-6 z-50 w-[calc(100vw-2rem)] max-w-[380px] max-h-[70vh] sm:max-h-[500px] flex flex-col bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl overflow-hidden border border-gray-200/60"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#c41e3a] text-white shrink-0">
              <span className="font-semibold text-sm">Assistente Plenus</span>
              <button
                onClick={close}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
                aria-label="Fechar chat"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] px-3.5 py-2.5 text-sm leading-relaxed ${
                        msg.sender === "bot"
                          ? "bg-gray-100 text-gray-800 rounded-2xl rounded-tl-md"
                          : "bg-[#c41e3a] text-white rounded-2xl rounded-tr-md"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Quick-reply buttons (shown after greeting bot message) */}
              {step === "greeting" && messages.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.15 }}
                  className="grid grid-cols-2 gap-2"
                >
                  {(messages[messages.length - 1]?.options ?? []).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => selectOption(opt)}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-xl hover:border-[#c41e3a] hover:text-[#c41e3a] transition-colors text-gray-700 bg-white"
                    >
                      {opt}
                    </button>
                  ))}
                </motion.div>
              )}

              {/* Sending spinner */}
              {step === "sending" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 rounded-2xl rounded-tl-md px-4 py-3">
                    <div className="flex space-x-1.5">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Done: WhatsApp + restart */}
              {step === "done" && messages.length > 0 && messages[messages.length - 1]?.sender === "bot" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.2 }}
                  className="space-y-2"
                >
                  <button
                    onClick={openWhatsApp}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#25D366] text-white text-sm font-medium rounded-xl hover:bg-[#1da851] transition-colors"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    Abrir WhatsApp
                  </button>
                  <button
                    onClick={restart}
                    className="w-full text-center text-xs text-gray-400 hover:text-gray-600 transition-colors py-1"
                  >
                    Nova conversa
                  </button>
                </motion.div>
              )}

              <div ref={msgEndRef} />
            </div>

            {/* Input area */}
            {(step === "ask_mensagem" || step === "ask_nome" || step === "ask_telefone" || step === "ask_endereco") && (
              <div className="px-4 py-3 border-t border-gray-100 shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    submit();
                  }}
                  className="flex gap-2"
                >
                  {step === "ask_mensagem" ? (
                    <textarea
                      ref={textareaRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Descreva o que você precisa..."
                      rows={2}
                      className="flex-1 px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#c41e3a] focus:ring-1 focus:ring-[#c41e3a]/30 transition-colors text-gray-800 placeholder:text-gray-400 resize-none"
                    />
                  ) : (
                    <input
                      ref={inputRef}
                      type={step === "ask_telefone" ? "tel" : "text"}
                      value={inputValue}
                      onChange={(e) =>
                        setInputValue(
                          step === "ask_telefone" ? formatPhone(e.target.value) : e.target.value
                        )
                      }
                      placeholder={
                        step === "ask_nome" ? "Seu nome" :
                        step === "ask_endereco" ? "Endereço da obra" :
                        "(XX) XXXXX-XXXX"
                      }
                      className="flex-1 px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#c41e3a] focus:ring-1 focus:ring-[#c41e3a]/30 transition-colors text-gray-800 placeholder:text-gray-400"
                    />
                  )}
                  <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="w-9 h-9 flex items-center justify-center bg-[#c41e3a] text-white rounded-full shrink-0 disabled:opacity-40 hover:bg-[#a01830] transition-colors self-end"
                    aria-label="Enviar"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                    </svg>
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating button ─────────────────────────────────────────── */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, duration: 0.3 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => (isOpen ? close() : open())}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#c41e3a] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
        aria-label={isOpen ? "Fechar chat" : "Abrir chat"}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.svg
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </motion.svg>
          ) : (
            <motion.svg
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
