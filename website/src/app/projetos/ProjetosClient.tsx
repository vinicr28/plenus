"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import ProjectModal from "@/components/ProjectModal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Project } from "@/components/Projects";
import { trackProjectEvent } from "@/lib/tracking";

export default function ProjetosClient() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/projects");
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const categories = ["all", ...new Set(projects.map((p) => p.category))];

  const filteredProjects =
    filter === "all"
      ? projects
      : projects.filter((p) => p.category === filter);

  const openModal = (project: Project) => {
    trackProjectEvent(project.id, 'modal_open');
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="relative pt-32 pb-16 bg-gradient-to-b from-[#fafafa] to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Breadcrumbs items={[{ label: "Projetos" }]} />
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-3xl"
          >
            <p className="text-[#737373] text-sm font-semibold tracking-[0.2em] uppercase mb-4">
              Portfólio Completo
            </p>
            <h1 className="font-[var(--font-playfair)] text-4xl md:text-6xl font-bold text-[#1a1a1a] mb-6">
              Nossos <span className="text-[#525252]">Projetos</span>
            </h1>
            <p className="text-lg text-[#525252] leading-relaxed">
              Explore nossa galeria completa de projetos realizados. Cada
              construção representa a concretização de um sonho, executado com
              excelência e dedicação.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap gap-3"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  filter === category
                    ? "bg-[#1a1a1a] text-white"
                    : "bg-[#f5f5f5] text-[#525252] hover:bg-[#e5e5e5]"
                }`}
              >
                {category === "all" ? "Todos" : category}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-[3/4] rounded-2xl bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group cursor-pointer"
                  onClick={() => openModal(project)}
                >
                  {/* Card */}
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                    {/* Project image */}
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Info overlay */}
                    <div
                      className="absolute bottom-0 left-0 right-0 p-6 backdrop-blur-xl transition-all duration-300 group-hover:backdrop-blur-2xl"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)",
                        borderTop: "1px solid rgba(255,255,255,0.2)",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
                      }}
                    >
                      {/* Category & Area */}
                      <div className="flex items-center gap-3 mb-3">
                        <span
                          className="text-xs font-medium px-3 py-1 rounded-full"
                          style={{
                            background: "rgba(196, 30, 58, 0.3)",
                            border: "1px solid rgba(196, 30, 58, 0.5)",
                            color: "#fff",
                          }}
                        >
                          {project.category}
                        </span>
                        <span className="text-xs text-white/60">
                          {project.area}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-[var(--font-playfair)] text-xl font-bold text-white mb-2 group-hover:text-[#c41e3a] transition-colors duration-300">
                        {project.title}
                      </h3>

                      {/* Location */}
                      <p className="text-sm text-white/70 flex items-center gap-1.5">
                        <svg
                          className="w-4 h-4 text-white/50"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {project.location}
                      </p>
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-[#c41e3a]/0 group-hover:bg-[#c41e3a]/10 transition-colors duration-300" />

                    {/* View icon on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                        <svg
                          className="w-6 h-6 text-[#1a1a1a]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && filteredProjects.length === 0 && (
            <div className="text-center py-16">
              <p className="text-[#525252] text-lg">
                Nenhum projeto encontrado para esta categoria.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-[#fafafa]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-4">
              Quer um Projeto Assim?
            </h2>
            <p className="text-lg text-[#525252] mb-8">
              Entre em contato conosco e transforme seu sonho em realidade.
            </p>
            <Link
              href="/#contato"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#c41e3a] text-white font-semibold rounded-xl hover:bg-[#a01830] transition-colors"
            >
              Solicitar Orçamento
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </main>
      <Footer />
    </>
  );
}
