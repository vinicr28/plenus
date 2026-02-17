"use client";

import { useState, useEffect } from "react";

export default function FinancingPage() {
  const [annualRate, setAnnualRate] = useState("");
  const [description, setDescription] = useState("");
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/financing")
      .then((res) => res.json())
      .then((data) => {
        setAnnualRate(String(data.annual_rate ?? "10.49"));
        setDescription(data.description ?? "");
        setUpdatedAt(data.updated_at ?? null);
      })
      .catch(() => {
        setAnnualRate("10.49");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    const rate = parseFloat(annualRate);
    if (isNaN(rate) || rate < 0 || rate > 100) {
      setMessage({ type: "error", text: "Taxa deve ser um número entre 0 e 100." });
      setSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/financing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ annual_rate: rate, description }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro ao salvar");
      }

      const data = await res.json();
      setAnnualRate(String(data.annual_rate));
      setDescription(data.description ?? "");
      setUpdatedAt(data.updated_at);
      setMessage({ type: "success", text: "Taxa de juros atualizada com sucesso!" });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Erro ao salvar" });
    } finally {
      setSaving(false);
    }
  };

  const monthlyRate = annualRate ? ((parseFloat(annualRate) || 0) / 12).toFixed(4) : "0";

  if (loading) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Financiamento</h1>
          <p className="text-gray-500 mt-1">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Financiamento</h1>
        <p className="text-gray-500 mt-1">Configure a taxa de juros do simulador</p>
      </div>

      {/* Settings Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-lg">
        <h2 className="text-lg font-semibold text-[#1a1a1a] mb-6">Taxa de Juros</h2>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Taxa anual (% a.a.)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={annualRate}
              onChange={(e) => setAnnualRate(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c41e3a]/20 focus:border-[#c41e3a] transition-colors"
            />
            <p className="text-sm text-gray-500 mt-1">
              Equivalente a <span className="font-medium">{monthlyRate}%</span> ao mês
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição (opcional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Taxa de juros anual padrão"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c41e3a]/20 focus:border-[#c41e3a] transition-colors"
            />
          </div>

          {updatedAt && (
            <p className="text-xs text-gray-400">
              Última atualização: {new Date(updatedAt).toLocaleString("pt-BR")}
            </p>
          )}

          {message && (
            <div
              className={`px-4 py-3 rounded-lg text-sm ${
                message.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-[#c41e3a] text-white font-medium rounded-lg hover:bg-[#a01830] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
