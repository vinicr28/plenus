"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Lead {
  id: string;
  form_type: string;
  status: string;
  nome: string;
  email: string | null;
  telefone: string | null;
  tipo_projeto: string | null;
  mensagem: string | null;
  assunto: string | null;
  descricao: string | null;
  area_interesse: string | null;
  sobre_voce: string | null;
  cpf: string | null;
  endereco: string | null;
  data_nascimento: string | null;
  observacao: string | null;
  notes: string | null;
  created_at: string;
}

interface LeadsTableProps {
  leads: Lead[];
}

type DatePreset = "all" | "hoje" | "ontem" | "7dias" | "30dias" | "custom";

interface DateFilter {
  preset: DatePreset;
  from?: string;
  to?: string;
}

function getDateRange(filter: DateFilter): { from: Date; to: Date } | null {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (filter.preset) {
    case "all":
      return null;
    case "hoje":
      return { from: startOfToday, to: new Date(startOfToday.getTime() + 86400000) };
    case "ontem": {
      const yesterday = new Date(startOfToday.getTime() - 86400000);
      return { from: yesterday, to: startOfToday };
    }
    case "7dias":
      return { from: new Date(startOfToday.getTime() - 7 * 86400000), to: new Date(startOfToday.getTime() + 86400000) };
    case "30dias":
      return { from: new Date(startOfToday.getTime() - 30 * 86400000), to: new Date(startOfToday.getTime() + 86400000) };
    case "custom": {
      if (!filter.from || !filter.to) return null;
      const from = new Date(filter.from + "T00:00:00");
      const to = new Date(filter.to + "T23:59:59.999");
      return { from, to };
    }
    default:
      return null;
  }
}

const statusLabels: Record<string, string> = {
  novo: "Novo",
  em_negociacao: "Em Negociação",
  fechado: "Fechado",
};

const statusColors: Record<string, string> = {
  novo: "bg-blue-100 text-blue-700",
  em_negociacao: "bg-yellow-100 text-yellow-700",
  fechado: "bg-green-100 text-green-700",
};

const formTypeLabels: Record<string, string> = {
  contact: "Contato",
  "pos-venda": "Pós-venda",
  "trabalhe-conosco": "Trabalhe Conosco",
  financiamento: "Financiamento",
};

const formTypeColors: Record<string, string> = {
  contact: "bg-purple-100 text-purple-700",
  "pos-venda": "bg-orange-100 text-orange-700",
  "trabalhe-conosco": "bg-teal-100 text-teal-700",
  financiamento: "bg-indigo-100 text-indigo-700",
};

export default function LeadsTable({ leads }: LeadsTableProps) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [formTypeFilter, setFormTypeFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>({ preset: "all" });
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesValue, setNotesValue] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);

  const filteredLeads = leads.filter((lead) => {
    if (statusFilter !== "all" && lead.status !== statusFilter) return false;
    if (formTypeFilter !== "all" && lead.form_type !== formTypeFilter) return false;
    const range = getDateRange(dateFilter);
    if (range) {
      const created = new Date(lead.created_at);
      if (created < range.from || created > range.to) return false;
    }
    return true;
  });

  const novoCount = filteredLeads.filter((l) => l.status === "novo").length;
  const emNegociacaoCount = filteredLeads.filter((l) => l.status === "em_negociacao").length;
  const fechadoCount = filteredLeads.filter((l) => l.status === "fechado").length;

  const handleStatusChange = async (lead: Lead, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/leads/${lead.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error("Failed to update status");
      router.refresh();
    } catch (error) {
      console.error("Error updating lead status:", error);
      alert("Erro ao atualizar status");
    }
  };

  const handleSaveNotes = async (lead: Lead) => {
    try {
      const response = await fetch(`/api/admin/leads/${lead.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: notesValue }),
      });
      if (!response.ok) throw new Error("Failed to update notes");
      setEditingNotesId(null);
      router.refresh();
    } catch (error) {
      console.error("Error updating notes:", error);
      alert("Erro ao salvar anotações");
    }
  };

  const handleDeleteClick = (lead: Lead) => {
    setLeadToDelete(lead);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!leadToDelete) return;
    setDeletingId(leadToDelete.id);
    try {
      const response = await fetch(`/api/admin/leads/${leadToDelete.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete lead");
      router.refresh();
    } catch (error) {
      console.error("Error deleting lead:", error);
      alert("Erro ao excluir lead");
    } finally {
      setDeletingId(null);
      setShowDeleteModal(false);
      setLeadToDelete(null);
    }
  };

  const getFormSpecificDetails = (lead: Lead) => {
    const details: { label: string; value: string }[] = [];
    switch (lead.form_type) {
      case "contact":
        if (lead.tipo_projeto) details.push({ label: "Tipo de Projeto", value: lead.tipo_projeto });
        if (lead.mensagem) details.push({ label: "Mensagem", value: lead.mensagem });
        break;
      case "pos-venda":
        if (lead.assunto) details.push({ label: "Assunto", value: lead.assunto });
        if (lead.descricao) details.push({ label: "Descrição", value: lead.descricao });
        break;
      case "trabalhe-conosco":
        if (lead.area_interesse) details.push({ label: "Área de Interesse", value: lead.area_interesse });
        if (lead.sobre_voce) details.push({ label: "Sobre", value: lead.sobre_voce });
        break;
      case "financiamento":
        if (lead.cpf) details.push({ label: "CPF", value: lead.cpf });
        if (lead.endereco) details.push({ label: "Endereço", value: lead.endereco });
        if (lead.data_nascimento) details.push({ label: "Data de Nascimento", value: lead.data_nascimento });
        if (lead.observacao) details.push({ label: "Observação", value: lead.observacao });
        break;
    }
    return details;
  };

  return (
    <>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500">Novos</p>
              <p className="text-xl font-bold text-[#1a1a1a]">{novoCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500">Em Negociação</p>
              <p className="text-xl font-bold text-[#1a1a1a]">{emNegociacaoCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 text-green-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500">Fechados</p>
              <p className="text-xl font-bold text-[#1a1a1a]">{fechadoCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 mb-4">
        {[
          { key: "all", label: "Todos" },
          { key: "novo", label: "Novo" },
          { key: "em_negociacao", label: "Em Negociação" },
          { key: "fechado", label: "Fechado" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === tab.key
                ? "bg-[#1a1a1a] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Form Type Filter Tabs */}
      <div className="flex gap-2 mb-4">
        {[
          { key: "all", label: "Todos" },
          { key: "contact", label: "Contato" },
          { key: "pos-venda", label: "Pós-venda" },
          { key: "trabalhe-conosco", label: "Trabalhe Conosco" },
          { key: "financiamento", label: "Financiamento" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFormTypeFilter(tab.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              formTypeFilter === tab.key
                ? "bg-[#c41e3a] text-white"
                : "bg-gray-50 text-gray-500 hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Date Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {([
          { key: "all", label: "Todos" },
          { key: "hoje", label: "Hoje" },
          { key: "ontem", label: "Ontem" },
          { key: "7dias", label: "Últimos 7 dias" },
          { key: "30dias", label: "Últimos 30 dias" },
          { key: "custom", label: "Personalizado" },
        ] as { key: DatePreset; label: string }[]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setDateFilter({ ...dateFilter, preset: tab.key })}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              dateFilter.preset === tab.key
                ? "bg-[#1a1a1a] text-white"
                : "bg-gray-50 text-gray-500 hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
        {dateFilter.preset === "custom" && (
          <div className="flex items-center gap-2 ml-2">
            <input
              type="date"
              value={dateFilter.from || ""}
              onChange={(e) => setDateFilter({ ...dateFilter, from: e.target.value })}
              className="px-2 py-1.5 border rounded-lg text-xs"
            />
            <span className="text-xs text-gray-400">até</span>
            <input
              type="date"
              value={dateFilter.to || ""}
              onChange={(e) => setDateFilter({ ...dateFilter, to: e.target.value })}
              className="px-2 py-1.5 border rounded-lg text-xs"
            />
          </div>
        )}
      </div>

      {/* Leads List */}
      <div className="space-y-4">
        {filteredLeads.map((lead) => {
          const details = getFormSpecificDetails(lead);
          const isExpanded = expandedId === lead.id;

          return (
            <div
              key={lead.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#c41e3a]/10 rounded-full flex items-center justify-center">
                      <span className="text-[#c41e3a] font-bold text-sm">
                        {lead.nome
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-[#1a1a1a]">{lead.nome}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        {lead.email && <span>{lead.email}</span>}
                        {lead.email && lead.telefone && <span>·</span>}
                        {lead.telefone && <span>{lead.telefone}</span>}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        formTypeColors[lead.form_type] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {formTypeLabels[lead.form_type] || lead.form_type}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        statusColors[lead.status] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {statusLabels[lead.status] || lead.status}
                    </span>
                  </div>

                  {/* Date */}
                  <p className="text-xs text-gray-400 mb-3">
                    {new Date(lead.created_at).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                  {/* Notes display */}
                  {lead.notes && editingNotesId !== lead.id && (
                    <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 mb-3">
                      <span className="font-medium text-gray-700">Notas: </span>
                      {lead.notes}
                    </p>
                  )}

                  {/* Expandable details */}
                  {details.length > 0 && (
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : lead.id)}
                      className="text-sm text-[#c41e3a] hover:underline flex items-center gap-1"
                    >
                      {isExpanded ? "Ocultar detalhes" : "Ver detalhes"}
                      <svg
                        className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  )}
                  {isExpanded && details.length > 0 && (
                    <div className="mt-3 bg-gray-50 rounded-lg p-4 space-y-2">
                      {details.map((detail, i) => (
                        <div key={i}>
                          <span className="text-xs font-medium text-gray-500">
                            {detail.label}:
                          </span>
                          <p className="text-sm text-gray-700">{detail.value}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Notes editing */}
                  {editingNotesId === lead.id && (
                    <div className="mt-3 space-y-2">
                      <textarea
                        value={notesValue}
                        onChange={(e) => setNotesValue(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
                        rows={3}
                        placeholder="Anotações sobre este lead..."
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveNotes(lead)}
                          className="px-3 py-1.5 bg-[#c41e3a] text-white text-sm rounded-lg hover:bg-[#a31830] transition-colors"
                        >
                          Salvar
                        </button>
                        <button
                          onClick={() => setEditingNotesId(null)}
                          className="px-3 py-1.5 text-gray-600 text-sm hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 min-w-[140px]">
                  <select
                    value={lead.status}
                    onChange={(e) => handleStatusChange(lead, e.target.value)}
                    className="px-3 py-1.5 border rounded-lg text-sm bg-white"
                  >
                    <option value="novo">Novo</option>
                    <option value="em_negociacao">Em Negociação</option>
                    <option value="fechado">Fechado</option>
                  </select>
                  <button
                    onClick={() => {
                      setEditingNotesId(lead.id);
                      setNotesValue(lead.notes || "");
                    }}
                    className="px-3 py-1.5 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Notas
                  </button>
                  <button
                    onClick={() => handleDeleteClick(lead)}
                    disabled={deletingId === lead.id}
                    className="px-3 py-1.5 border border-red-300 text-red-600 text-sm rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredLeads.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <svg
              className="w-12 h-12 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="text-gray-500">Nenhum lead encontrado</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && leadToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">
              Confirmar Exclusão
            </h3>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja excluir o lead de{" "}
              <strong>{leadToDelete.nome}</strong>? Esta ação não pode ser
              desfeita.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setLeadToDelete(null);
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deletingId !== null}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deletingId ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
