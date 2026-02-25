"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { calculateFinancing, formatBRL } from "@/lib/financing";

const TERM_OPTIONS = Array.from({ length: 7 }, (_, i) => 5 + i * 5);

export default function FinancingSimulator() {
  const [annualRate, setAnnualRate] = useState<number | null>(null);
  const [rateDescription, setRateDescription] = useState("");
  const [propertyValue, setPropertyValue] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [termYears, setTermYears] = useState(30);
  const [hasCalculated, setHasCalculated] = useState(false);

  useEffect(() => {
    fetch("/api/financing/settings")
      .then((res) => res.json())
      .then((data) => {
        setAnnualRate(data.annual_rate);
        setRateDescription(data.description ?? "");
      })
      .catch(() => setAnnualRate(10.49));
  }, []);

  const parseCurrency = (value: string): number => {
    const cleaned = value.replace(/\D/g, "");
    return cleaned ? parseInt(cleaned, 10) / 100 : 0;
  };

  const formatCurrencyInput = (value: string): string => {
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned) return "";
    const num = parseInt(cleaned, 10) / 100;
    return num.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleCurrencyChange = (
    setter: (v: string) => void,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setter(formatCurrencyInput(e.target.value));
  };

  const propVal = parseCurrency(propertyValue);
  const downVal = parseCurrency(downPayment);
  const isValid = propVal > 0 && downVal < propVal && annualRate !== null;

  const result = useMemo(() => {
    if (!isValid || annualRate === null) return null;
    return calculateFinancing({
      propertyValue: propVal,
      downPayment: downVal,
      termYears,
      annualInterestRate: annualRate,
    });
  }, [propVal, downVal, termYears, annualRate, isValid]);

  const handleCalculate = () => {
    if (isValid) setHasCalculated(true);
  };

  const showResults = hasCalculated && result && result.monthlyPayment > 0;

  return (
    <div
      className="backdrop-blur-2xl rounded-3xl p-5 sm:p-8 lg:p-10 shadow-2xl"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)",
        border: "1px solid rgba(255,255,255,0.3)",
        boxShadow:
          "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
      }}
    >
      <h2 className="font-[var(--font-playfair)] text-2xl font-bold text-[#1a1a1a] mb-2">
        Simulador de Financiamento
      </h2>
      <p className="text-[#525252] mb-6">
        Calcule uma estimativa da sua parcela mensal.
      </p>

      {/* Interest rate badge */}
      {annualRate !== null && (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 rounded-full mb-6">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-sm font-medium text-emerald-600">
            Taxa: {annualRate.toFixed(2)}% a.a.
          </span>
          {rateDescription && (
            <span className="text-xs text-emerald-600/60">({rateDescription})</span>
          )}
        </div>
      )}

      <div className="space-y-5">
        {/* Property value */}
        <div>
          <label className="block text-sm font-medium text-[#525252] mb-2">
            Valor do imóvel
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              R$
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={propertyValue}
              onChange={(e) => handleCurrencyChange(setPropertyValue, e)}
              placeholder="R$ 500.000,00"
              className="w-full pl-10 pr-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c41e3a]/20 focus:border-[#c41e3a] shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200"
            />
          </div>
        </div>

        {/* Down payment */}
        <div>
          <label className="block text-sm font-medium text-[#525252] mb-2">
            Entrada
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              R$
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={downPayment}
              onChange={(e) => handleCurrencyChange(setDownPayment, e)}
              placeholder="R$ 100.000,00"
              className="w-full pl-10 pr-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c41e3a]/20 focus:border-[#c41e3a] shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200"
            />
          </div>
          {downVal >= propVal && propVal > 0 && (
            <p className="text-sm text-red-500 mt-1">
              A entrada deve ser menor que o valor do imóvel.
            </p>
          )}
        </div>

        {/* Term */}
        <div>
          <label className="block text-sm font-medium text-[#525252] mb-2">
            Prazo do financiamento
          </label>
          <select
            value={termYears}
            onChange={(e) => setTermYears(Number(e.target.value))}
            className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c41e3a]/20 focus:border-[#c41e3a] shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200 appearance-none"
          >
            {TERM_OPTIONS.map((y) => (
              <option key={y} value={y}>
                {y * 12} meses
              </option>
            ))}
          </select>
        </div>

        {/* Calculate button */}
        <button
          onClick={handleCalculate}
          disabled={!isValid}
          className="w-full py-4 bg-[#c41e3a] text-white font-semibold rounded-xl hover:bg-[#a01830] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Calcular Parcela
        </button>
      </div>

      {/* Results */}
      <AnimatePresence>
        {showResults && result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="mt-8 pt-8 border-t border-gray-200"
          >
            {/* Monthly payment - prominent */}
            <div className="text-center mb-6">
              <p className="text-sm text-[#525252] mb-1">Parcela mensal estimada</p>
              <p className="text-4xl font-bold text-[#c41e3a]">
                {formatBRL(result.monthlyPayment)}
              </p>
            </div>

            {/* Valor financiado */}
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-xs text-[#525252] mb-1">Valor financiado</p>
              <p className="text-lg font-semibold text-[#1a1a1a]">
                {formatBRL(result.financedAmount)}
              </p>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-gray-400 mt-4 text-center leading-relaxed">
              * Simulação meramente ilustrativa. Os valores reais podem variar de acordo
              com a análise de crédito e condições do banco financiador.
            </p>

            {/* CTA */}
            <a
              href="#contato"
              className="mt-6 w-full py-4 bg-[#c41e3a] text-white font-semibold rounded-xl hover:bg-[#a01830] transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Falar com Especialista
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
