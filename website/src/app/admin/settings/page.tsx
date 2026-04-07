"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface AdminUser {
  id: string;
  email: string;
  created_at: string;
}

const SITE_URLS = [
  { label: "Home", path: "/" },
  { label: "Projetos", path: "/projetos" },
  { label: "Financiamento", path: "/financiamento" },
  { label: "Construtora em Indaiatuba", path: "/construtora-em-indaiatuba" },
  { label: "Construtora em Jundiaí", path: "/construtora-em-jundiai" },
];

export default function SettingsPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Erro ao carregar admins");
      const data = await res.json();
      setUsers(data);
    } catch {
      setMessage({ type: "error", text: "Erro ao carregar lista de administradores" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao adicionar admin");

      setEmail("");
      setPassword("");
      setMessage({ type: "success", text: "Administrador adicionado com sucesso!" });
      await fetchUsers();
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Erro ao adicionar" });
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string, userEmail: string) => {
    if (!confirm(`Tem certeza que deseja remover o admin ${userEmail}?`)) return;

    setDeletingId(id);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao remover admin");

      setMessage({ type: "success", text: "Administrador removido com sucesso!" });
      await fetchUsers();
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Erro ao remover" });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Configurações</h1>
        <p className="text-gray-500 mt-1">Gerencie administradores e acesse configurações do site</p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mb-8">
        <Link
          href="/admin/hero-stats"
          className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-[#c41e3a]/30 transition-colors group"
        >
          <div className="w-10 h-10 rounded-lg bg-[#c41e3a]/10 flex items-center justify-center text-[#c41e3a] group-hover:bg-[#c41e3a]/20 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-[#1a1a1a]">Status do Card</p>
            <p className="text-sm text-gray-500">Editar estatísticas da home</p>
          </div>
        </Link>
        <Link
          href="/admin/financing"
          className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-[#c41e3a]/30 transition-colors group"
        >
          <div className="w-10 h-10 rounded-lg bg-[#c41e3a]/10 flex items-center justify-center text-[#c41e3a] group-hover:bg-[#c41e3a]/20 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-[#1a1a1a]">Financiamento</p>
            <p className="text-sm text-gray-500">Gerenciar leads de financiamento</p>
          </div>
        </Link>
      </div>

      {/* Site URLs */}
      <div className="max-w-3xl mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-[#1a1a1a] mb-1">URLs do Site</h2>
          <p className="text-sm text-gray-500 mb-6">
            Links das páginas públicas do site. Clique para abrir em uma nova aba.
          </p>
          <div className="space-y-2">
            {SITE_URLS.map((url) => (
              <a
                key={url.path}
                href={url.path}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[#1a1a1a]">{url.label}</p>
                  <p className="text-xs text-gray-500 font-mono truncate">
                    {origin}{url.path}
                  </p>
                </div>
                <svg className="w-4 h-4 text-gray-400 group-hover:text-[#c41e3a] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Admin Management */}
      <div className="max-w-3xl">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-[#1a1a1a] mb-1">Administradores</h2>
          <p className="text-sm text-gray-500 mb-6">
            Quem for adicionado terá acesso total ao dashboard admin, incluindo leads, projetos e configurações.
          </p>

          {message && (
            <div
              className={`px-4 py-3 rounded-lg text-sm mb-6 ${
                message.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* User List */}
          {loading ? (
            <p className="text-gray-500 text-sm">Carregando...</p>
          ) : (
            <div className="space-y-3 mb-6">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-[#1a1a1a]">{u.email}</p>
                    <p className="text-xs text-gray-400">
                      Criado em {new Date(u.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(u.id, u.email!)}
                    disabled={deletingId === u.id}
                    className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    {deletingId === u.id ? "Removendo..." : "Remover"}
                  </button>
                </div>
              ))}
              {users.length === 0 && (
                <p className="text-gray-400 text-sm">Nenhum administrador encontrado.</p>
              )}
            </div>
          )}

          {/* Add Form */}
          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-sm font-semibold text-[#1a1a1a] mb-4">Adicionar novo administrador</h3>
            <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c41e3a]/20 focus:border-[#c41e3a] transition-colors"
              />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha (min. 6 caracteres)"
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c41e3a]/20 focus:border-[#c41e3a] transition-colors"
              />
              <button
                type="submit"
                disabled={adding}
                className="px-6 py-2.5 bg-[#c41e3a] text-white font-medium rounded-lg hover:bg-[#a01830] transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {adding ? "Adicionando..." : "Adicionar"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
