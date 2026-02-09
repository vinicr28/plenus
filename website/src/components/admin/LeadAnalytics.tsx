"use client";

interface LeadData {
  id: string;
  form_type: string;
  status: string;
  created_at: string;
}

interface LeadAnalyticsProps {
  leads: LeadData[];
}

const formTypeLabels: Record<string, string> = {
  contact: "Contato",
  "pos-venda": "Pós-venda",
  "trabalhe-conosco": "Trabalhe Conosco",
  financiamento: "Financiamento",
};

const formTypeBarColors: Record<string, string> = {
  contact: "bg-purple-500",
  "pos-venda": "bg-orange-500",
  "trabalhe-conosco": "bg-teal-500",
  financiamento: "bg-indigo-500",
};

export default function LeadAnalytics({ leads }: LeadAnalyticsProps) {
  const total = leads.length;
  const novoCount = leads.filter((l) => l.status === "novo").length;
  const emNegociacaoCount = leads.filter((l) => l.status === "em_negociacao").length;
  const fechadoCount = leads.filter((l) => l.status === "fechado").length;

  // Leads by form type
  const byFormType = ["contact", "pos-venda", "trabalhe-conosco", "financiamento"].map((ft) => ({
    key: ft,
    label: formTypeLabels[ft],
    count: leads.filter((l) => l.form_type === ft).length,
    color: formTypeBarColors[ft],
  }));
  const maxFormTypeCount = Math.max(...byFormType.map((f) => f.count), 1);

  // Leads by month (last 6 months)
  const now = new Date();
  const months: { key: string; label: string; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");
    const count = leads.filter((l) => l.created_at.startsWith(key)).length;
    months.push({ key, label, count });
  }
  const maxMonthCount = Math.max(...months.map((m) => m.count), 1);

  // Conversion funnel
  const funnelSteps = [
    { label: "Novo", count: novoCount, color: "bg-blue-500" },
    { label: "Em Negociação", count: emNegociacaoCount, color: "bg-yellow-500" },
    { label: "Fechado", count: fechadoCount, color: "bg-green-500" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-[#1a1a1a]">Analytics de Leads</h2>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: total, color: "bg-[#c41e3a]/10 text-[#c41e3a]" },
          { label: "Novos", value: novoCount, color: "bg-blue-100 text-blue-600" },
          { label: "Em Negociação", value: emNegociacaoCount, color: "bg-yellow-100 text-yellow-600" },
          { label: "Fechados", value: fechadoCount, color: "bg-green-100 text-green-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold text-[#1a1a1a]">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads by Form Type */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-sm font-semibold text-[#1a1a1a] mb-4">Leads por Formulário</h3>
          <div className="space-y-3">
            {byFormType.map((ft) => (
              <div key={ft.key}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">{ft.label}</span>
                  <span className="font-medium text-[#1a1a1a]">{ft.count}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className={`${ft.color} h-3 rounded-full transition-all`}
                    style={{ width: `${(ft.count / maxFormTypeCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leads by Month */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-sm font-semibold text-[#1a1a1a] mb-4">Leads por Mês</h3>
          <div className="flex items-end justify-between gap-2 h-40">
            {months.map((m) => (
              <div key={m.key} className="flex-1 flex flex-col items-center justify-end h-full">
                <span className="text-xs font-medium text-[#1a1a1a] mb-1">{m.count}</span>
                <div
                  className="w-full bg-[#c41e3a] rounded-t-md transition-all min-h-[4px]"
                  style={{ height: `${(m.count / maxMonthCount) * 100}%` }}
                />
                <span className="text-xs text-gray-500 mt-2 capitalize">{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-sm font-semibold text-[#1a1a1a] mb-4">Funil de Conversão</h3>
        <div className="flex items-center gap-4">
          {funnelSteps.map((step, i) => {
            const pct = total > 0 ? Math.round((step.count / total) * 100) : 0;
            return (
              <div key={step.label} className="flex-1 flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">{step.label}</span>
                    <span className="font-medium text-[#1a1a1a]">
                      {step.count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-4">
                    <div
                      className={`${step.color} h-4 rounded-full transition-all`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                {i < funnelSteps.length - 1 && (
                  <svg className="w-5 h-5 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
