import Link from "next/link";
import ProjectForm from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/projects"
          className="inline-flex items-center text-gray-500 hover:text-[#c41e3a] transition-colors mb-4"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar para Projetos
        </Link>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Novo Projeto</h1>
        <p className="text-gray-500 mt-1">Adicione um novo projeto ao portfólio</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <ProjectForm />
      </div>
    </div>
  );
}
