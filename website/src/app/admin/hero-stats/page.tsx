"use client";

import { useState, useEffect } from "react";
import { getAnosDeMercado } from "@/lib/empresa";

interface StatField {
  position: number;
  value: string;
  label: string;
  prefix: string;
}

const DEFAULT_STATS: StatField[] = [
  { position: 1, value: "150+", label: "Obras Entregues", prefix: "" },
  { position: 2, value: "40%", label: "de Economia Garantida", prefix: "Até " },
  { position: 3, value: String(getAnosDeMercado()), label: "Anos de Mercado", prefix: "" },
];

export default function HeroStatsPage() {
  const [stats, setStats] = useState<StatField[]>(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/hero-stats")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length === 3) {
          setStats(
            data.map((s: { position: number; value: string; label: string; prefix: string | null }) => ({
              position: s.position,
              value: s.value,
              label: s.label,
              prefix: s.prefix ?? "",
            }))
          );
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const updateStat = (index: number, field: keyof StatField, val: string) => {
    setStats((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: val } : s)));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    for (const stat of stats) {
      if (!stat.value.trim() || !stat.label.trim()) {
        setMessage({ type: "error", text: "Valor e label são obrigatórios para todos os cards." });
        setSaving(false);
        return;
      }
    }

    try {
      const payload = stats.map((s) => ({
        position: s.position,
        value: s.value.trim(),
        label: s.label.trim(),
        prefix: s.prefix.trim() || null,
      }));

      const res = await fetch("/api/admin/hero-stats", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro ao salvar");
      }

      setMessage({ type: "success", text: "Estatísticas do Hero atualizadas com sucesso!" });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Erro ao salvar" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Status do Card</h1>
          <p className="text-gray-500 mt-1">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Status do Card</h1>
        <p className="text-gray-500 mt-1">Edite os 3 cards de estatísticas exibidos no Hero da home page</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
        {stats.map((stat, index) => (
          <div
            key={stat.position}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4">Card {stat.position}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={stat.value}
                  onChange={(e) => updateStat(index, "value", e.target.value)}
                  placeholder="Ex: 150+"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c41e3a]/20 focus:border-[#c41e3a] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Label <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => updateStat(index, "label", e.target.value)}
                  placeholder="Ex: Obras Entregues"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c41e3a]/20 focus:border-[#c41e3a] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prefixo (opcional)
                </label>
                <input
                  type="text"
                  value={stat.prefix}
                  onChange={(e) => updateStat(index, "prefix", e.target.value)}
                  placeholder='Ex: Até '
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c41e3a]/20 focus:border-[#c41e3a] transition-colors"
                />
                <p className="text-xs text-gray-400 mt-1">Texto exibido antes do valor em tamanho menor</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-3xl mt-6 space-y-4">
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
  );
}
