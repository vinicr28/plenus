import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

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

  // Get recent projects
  const { data: recentProjects } = await supabase
    .from("projects")
    .select("id, title, created_at, published")
    .order("created_at", { ascending: false })
    .limit(5) as { data: { id: string; title: string; created_at: string; published: boolean }[] | null };

  const stats = [
    {
      name: "Total de Projetos",
      value: totalProjects ?? 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      name: "Publicados",
      value: publishedProjects ?? 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    {
      name: "Rascunhos",
      value: draftProjects ?? 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#c41e3a]/10 rounded-lg text-[#c41e3a]">
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold text-[#1a1a1a]">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                <p className="text-sm text-gray-500">Adicionar um novo projeto ao portfólio</p>
              </div>
            </Link>
            <Link
              href="/admin/projects"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-[#c41e3a] hover:bg-[#c41e3a]/5 transition-colors"
            >
              <div className="p-2 bg-[#c41e3a]/10 rounded-lg text-[#c41e3a]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-[#1a1a1a]">Gerenciar Projetos</p>
                <p className="text-sm text-gray-500">Editar ou remover projetos existentes</p>
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
                <p className="text-sm text-gray-500">Abrir o site em uma nova aba</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
