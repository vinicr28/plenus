"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MultiMediaUpload from "./MultiMediaUpload";
import { Project } from "@/types/database";

interface ProjectFormProps {
  project?: Project;
  isEditing?: boolean;
}

const CATEGORIES = ["Casa Térrea", "Sobrado", "Apartamento", "Comercial"];

export default function ProjectForm({ project, isEditing = false }: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: project?.title || "",
    location: project?.location || "",
    area: project?.area || "",
    category: project?.category || CATEGORIES[0],
    image_url: project?.image_url || "",
    images: project?.images || [],
    video_url: project?.video_url || "",
    description: project?.description || "",
    published: project?.published ?? false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleCoverImageChange = (url: string) => {
    setFormData((prev) => ({ ...prev, image_url: url }));
  };

  const handleImagesChange = (urls: string[]) => {
    setFormData((prev) => ({ ...prev, images: urls }));
  };

  const handleVideoChange = (url: string) => {
    setFormData((prev) => ({ ...prev, video_url: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.title.trim()) {
      setError("O título é obrigatório");
      return;
    }
    if (!formData.location.trim()) {
      setError("A localização é obrigatória");
      return;
    }
    if (!formData.area.trim()) {
      setError("A área é obrigatória");
      return;
    }
    if (!formData.image_url) {
      setError("A imagem de capa é obrigatória");
      return;
    }

    setLoading(true);

    try {
      const url = isEditing
        ? `/api/admin/projects/${project!.id}`
        : "/api/admin/projects";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save project");
      }

      router.push("/admin/projects");
      router.refresh();
    } catch (err) {
      console.error("Error saving project:", err);
      setError("Erro ao salvar projeto. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Form Fields */}
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Título *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#c41e3a] focus:border-transparent outline-none transition-all"
              placeholder="Ex: Residência Moderna"
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Localização *
            </label>
            <input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#c41e3a] focus:border-transparent outline-none transition-all"
              placeholder="Ex: Indaiatuba, SP"
            />
          </div>

          {/* Area and Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">
                Área *
              </label>
              <input
                id="area"
                name="area"
                type="text"
                value={formData.area}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#c41e3a] focus:border-transparent outline-none transition-all"
                placeholder="Ex: 250m²"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Categoria *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#c41e3a] focus:border-transparent outline-none transition-all"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#c41e3a] focus:border-transparent outline-none transition-all resize-none"
              placeholder="Descrição detalhada do projeto..."
            />
          </div>

          {/* Published */}
          <div className="flex items-center gap-3">
            <input
              id="published"
              name="published"
              type="checkbox"
              checked={formData.published}
              onChange={handleChange}
              className="w-5 h-5 rounded border-gray-300 text-[#c41e3a] focus:ring-[#c41e3a]"
            />
            <label htmlFor="published" className="text-sm font-medium text-gray-700">
              Publicar projeto (visível no site)
            </label>
          </div>
        </div>

        {/* Right Column - Media Upload */}
        <div>
          <MultiMediaUpload
            coverImage={formData.image_url}
            images={formData.images}
            videoUrl={formData.video_url}
            onCoverImageChange={handleCoverImageChange}
            onImagesChange={handleImagesChange}
            onVideoChange={handleVideoChange}
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-[#c41e3a] text-white font-semibold rounded-lg hover:bg-[#a01830] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Salvando..." : isEditing ? "Salvar Alterações" : "Criar Projeto"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/projects")}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
