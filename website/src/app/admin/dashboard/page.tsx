import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import LeadAnalytics from "@/components/admin/LeadAnalytics";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Get project counts
  const { count: totalProjects } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true });

  const { count: publishedProjects } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
    .eq("published", true);

  const { count: draftProjects } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
    .eq("published", false);

  // Get review counts
  const { count: totalReviews } = await supabase
    .from("reviews")
    .select("*", { count: "exact", head: true });

  const { count: pendingReviews } = await supabase
    .from("reviews")
    .select("*", { count: "exact", head: true })
    .eq("approved", false);

  const { count: approvedReviews } = await supabase
    .from("reviews")
    .select("*", { count: "exact", head: true })
    .eq("approved", true);

  // Get lead counts
  const { count: totalLeads } = await supabase
    .from("leads")
    .select("*", { count: "exact", head: true });

  const { count: novoLeads } = await supabase
    .from("leads")
    .select("*", { count: "exact", head: true })
    .eq("status", "novo");

  // Get recent pending reviews
  const { data: recentPendingReviews } = await supabase
    .from("reviews")
    .select("id, name, rating, created_at")
    .eq("approved", false)
    .order("created_at", { ascending: false })
    .limit(3) as { data: { id: string; name: string; rating: number; created_at: string }[] | null };

  // Get recent projects
  const { data: recentProjects } = await supabase
    .from("projects")
    .select("id, title, created_at, published")
    .order("created_at", { ascending: false })
    .limit(5) as { data: { id: string; title: string; created_at: string; published: boolean }[] | null };

  // Get recent novo leads
  const { data: recentNovoLeads } = await supabase
    .from("leads")
    .select("id, nome, form_type, created_at")
    .eq("status", "novo")
    .order("created_at", { ascending: false })
    .limit(5) as { data: { id: string; nome: string; form_type: string; created_at: string }[] | null };

  // Get all leads for analytics (lightweight)
  const { data: allLeadsForAnalytics } = await supabase
    .from("leads")
    .select("id, form_type, status, created_at")
    .order("created_at", { ascending: false }) as {
    data: { id: string; form_type: string; status: string; created_at: string }[] | null;
  };

  // Get project events for "most viewed projects" card
  const { data: projectEvents } = await supabase
    .from("project_events")
    .select("project_id, event_type") as {
    data: { project_id: string; event_type: string }[] | null;
  };

  // Get project titles for mapping
  const { data: allProjectsForEvents } = await supabase
    .from("projects")
    .select("id, title") as {
    data: { id: string; title: string }[] | null;
  };

  // Aggregate project events
  const projectTitleMap = new Map((allProjectsForEvents ?? []).map(p => [p.id, p.title]));
  const eventAgg = new Map<string, { views: number; ctas: number }>();
  for (const ev of projectEvents ?? []) {
    const agg = eventAgg.get(ev.project_id) ?? { views: 0, ctas: 0 };
    if (ev.event_type === "modal_open") agg.views++;
    if (ev.event_type === "cta_click") agg.ctas++;
    eventAgg.set(ev.project_id, agg);
  }
  const topProjects = Array.from(eventAgg.entries())
    .map(([id, counts]) => ({ id, title: projectTitleMap.get(id) ?? "Projeto removido", ...counts }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  const formTypeLabels: Record<string, string> = {
    contact: "Contato",
    "pos-venda": "Pós-venda",
    "trabalhe-conosco": "Trabalhe Conosco",
    financiamento: "Financiamento",
  };

  const stats = [
    {
      name: "Total Projetos",
      value: totalProjects ?? 0,
      color: "bg-[#c41e3a]/10 text-[#c41e3a]",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      name: "Publicados",
      value: publishedProjects ?? 0,
      color: "bg-green-100 text-green-600",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    {
      name: "Rascunhos",
      value: draftProjects ?? 0,
      color: "bg-gray-100 text-gray-600",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      name: "Total Avaliações",
      value: totalReviews ?? 0,
      color: "bg-blue-100 text-blue-600",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
    },
    {
      name: "Aprovadas",
      value: approvedReviews ?? 0,
      color: "bg-green-100 text-green-600",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      name: "Pendentes",
      value: pendingReviews ?? 0,
      color: "bg-yellow-100 text-yellow-600",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      name: "Total Leads",
      value: totalLeads ?? 0,
      color: "bg-purple-100 text-purple-600",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      name: "Novos Leads",
      value: novoLeads ?? 0,
      color: "bg-indigo-100 text-indigo-600",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Dashboard</h1>
        <p className="text-gray-500 mt-1">Visão geral do sistema</p>
      </div>

      {/* Pending Reviews Notification */}
      {(pendingReviews ?? 0) > 0 && (
        <Link
          href="/admin/reviews"
          className="flex items-center gap-4 p-4 mb-4 bg-yellow-50 border border-yellow-200 rounded-xl hover:bg-yellow-100 transition-colors"
        >
          <div className="p-2 bg-yellow-100 rounded-lg">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-yellow-800">
              {pendingReviews} {pendingReviews === 1 ? "avaliação pendente" : "avaliações pendentes"}
            </p>
            <p className="text-sm text-yellow-600">Clique para revisar e aprovar</p>
          </div>
          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}

      {/* Novos Leads Notification */}
      {(novoLeads ?? 0) > 0 && (
        <Link
          href="/admin/leads"
          className="flex items-center gap-4 p-4 mb-6 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors"
        >
          <div className="p-2 bg-blue-100 rounded-lg">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-blue-800">
              {novoLeads} {novoLeads === 1 ? "novo lead" : "novos leads"}
            </p>
            <p className="text-sm text-blue-600">Clique para gerenciar</p>
          </div>
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-xs text-gray-500">{stat.name}</p>
                <p className="text-xl font-bold text-[#1a1a1a]">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Projects */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#1a1a1a]">
                Projetos Recentes
              </h2>
              <Link
                href="/admin/projects"
                className="text-sm text-[#c41e3a] hover:underline"
              >
                Ver todos
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {recentProjects && recentProjects.length > 0 ? (
              recentProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/admin/projects/${project.id}/edit`}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-[#1a1a1a]">{project.title}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(project.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      project.published
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {project.published ? "Publicado" : "Rascunho"}
                  </span>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                Nenhum projeto cadastrado
              </div>
            )}
          </div>
        </div>

        {/* Leads Recentes + Quick Actions (middle column) */}
        <div className="space-y-6">
          {/* Leads Recentes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#1a1a1a]">
                  Leads Recentes
                </h2>
                <Link
                  href="/admin/leads"
                  className="text-sm text-[#c41e3a] hover:underline"
                >
                  Ver todos
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {recentNovoLeads && recentNovoLeads.length > 0 ? (
                recentNovoLeads.map((lead) => (
                  <Link
                    key={lead.id}
                    href="/admin/leads"
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-bold text-sm">
                          {lead.nome.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-[#1a1a1a]">{lead.nome}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(lead.created_at).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                      {formTypeLabels[lead.form_type] || lead.form_type}
                    </span>
                  </Link>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p>Nenhum lead novo</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4">
              Ações Rápidas
            </h2>
            <div className="space-y-3">
              <Link
                href="/admin/projects/new"
                className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-[#c41e3a] hover:bg-[#c41e3a]/5 transition-colors"
              >
                <div className="p-2 bg-[#c41e3a]/10 rounded-lg text-[#c41e3a]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-[#1a1a1a]">Novo Projeto</p>
                  <p className="text-sm text-gray-500">Adicionar ao portfólio</p>
                </div>
              </Link>
              <Link
                href="/admin/leads"
                className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-[#c41e3a] hover:bg-[#c41e3a]/5 transition-colors"
              >
                <div className="p-2 bg-[#c41e3a]/10 rounded-lg text-[#c41e3a]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-[#1a1a1a]">Gerenciar Leads</p>
                  <p className="text-sm text-gray-500">CRM de contatos</p>
                </div>
              </Link>
              <Link
                href="/admin/reviews"
                className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-[#c41e3a] hover:bg-[#c41e3a]/5 transition-colors"
              >
                <div className="p-2 bg-[#c41e3a]/10 rounded-lg text-[#c41e3a]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-[#1a1a1a]">Gerenciar Avaliações</p>
                  <p className="text-sm text-gray-500">Aprovar ou rejeitar</p>
                </div>
              </Link>
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-[#c41e3a] hover:bg-[#c41e3a]/5 transition-colors"
              >
                <div className="p-2 bg-[#c41e3a]/10 rounded-lg text-[#c41e3a]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-[#1a1a1a]">Ver Site</p>
                  <p className="text-sm text-gray-500">Abrir em nova aba</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Avaliações Pendentes (right column) */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#1a1a1a]">
                  Avaliações Pendentes
                </h2>
                <Link
                  href="/admin/reviews"
                  className="text-sm text-[#c41e3a] hover:underline"
                >
                  Ver todas
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {recentPendingReviews && recentPendingReviews.length > 0 ? (
                recentPendingReviews.map((review) => (
                  <Link
                    key={review.id}
                    href="/admin/reviews"
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#c41e3a]/10 rounded-full flex items-center justify-center">
                        <span className="text-[#c41e3a] font-bold text-sm">
                          {review.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-[#1a1a1a]">{review.name}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-4 h-4 ${star <= review.rating ? "text-yellow-400" : "text-gray-200"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>Nenhuma avaliação pendente</p>
                </div>
              )}
            </div>
          </div>

          {/* Projetos Mais Visualizados */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-[#1a1a1a]">
                Projetos Mais Visualizados
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {topProjects.length > 0 ? (
                topProjects.map((project, index) => (
                  <div
                    key={project.id}
                    className="flex items-center gap-4 p-4"
                  >
                    <span className="text-lg font-bold text-gray-300 w-6 text-center">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#1a1a1a] truncate">{project.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {project.views}
                        </span>
                        {project.ctas > 0 && (
                          <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">
                            {project.ctas} CTA
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <p>Nenhuma visualização ainda</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lead Analytics */}
      <LeadAnalytics leads={allLeadsForAnalytics ?? []} />
    </div>
  );
}
