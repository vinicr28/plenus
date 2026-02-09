"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface MultiMediaUploadProps {
  coverImage?: string;
  images?: string[];
  videoUrl?: string;
  onCoverImageChange: (url: string) => void;
  onImagesChange: (urls: string[]) => void;
  onVideoChange: (url: string) => void;
}

// Extract YouTube video ID from various URL formats
function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Extract Vimeo video ID
function getVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? match[1] : null;
}

// Get embed URL for video
function getVideoEmbedUrl(url: string): string | null {
  const youtubeId = getYouTubeId(url);
  if (youtubeId) return `https://www.youtube.com/embed/${youtubeId}`;

  const vimeoId = getVimeoId(url);
  if (vimeoId) return `https://player.vimeo.com/video/${vimeoId}`;

  return null;
}

// Get thumbnail for video
function getVideoThumbnail(url: string): string | null {
  const youtubeId = getYouTubeId(url);
  if (youtubeId) return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
  return null;
}

export default function MultiMediaUpload({
  coverImage,
  images = [],
  videoUrl,
  onCoverImageChange,
  onImagesChange,
  onVideoChange,
}: MultiMediaUploadProps) {
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [videoInput, setVideoInput] = useState(videoUrl || "");
  const coverInputRef = useRef<HTMLInputElement>(null);
  const imagesInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File): Promise<{ url: string; type: string } | null> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Failed to upload file");
    }

    return response.json();
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading("cover");

    try {
      const result = await uploadFile(file);
      if (result) {
        onCoverImageChange(result.url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer upload");
    } finally {
      setUploading(null);
    }
  };

  const handleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    setUploading("images");

    try {
      const newUrls: string[] = [];
      for (const file of Array.from(files)) {
        const result = await uploadFile(file);
        if (result && result.type === "image") {
          newUrls.push(result.url);
        }
      }
      onImagesChange([...images, ...newUrls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer upload");
    } finally {
      setUploading(null);
      if (imagesInputRef.current) {
        imagesInputRef.current.value = "";
      }
    }
  };

  const handleVideoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setVideoInput(url);
    setError(null);
  };

  const handleVideoUrlSave = () => {
    if (!videoInput.trim()) {
      onVideoChange("");
      return;
    }

    const embedUrl = getVideoEmbedUrl(videoInput);
    if (embedUrl) {
      onVideoChange(videoInput);
      setError(null);
    } else {
      setError("URL inválida. Use um link do YouTube ou Vimeo.");
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    const newImages = [...images];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newImages.length) return;
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    onImagesChange(newImages);
  };

  const embedUrl = videoUrl ? getVideoEmbedUrl(videoUrl) : null;
  const thumbnail = videoUrl ? getVideoThumbnail(videoUrl) : null;

  return (
    <div className="space-y-6">
      {/* Cover Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Imagem de Capa <span className="text-red-500">*</span>
        </label>
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          onChange={handleCoverUpload}
          className="hidden"
        />
        {coverImage ? (
          <div className="relative">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={coverImage}
                alt="Capa"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {uploading === "cover" && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                disabled={uploading !== null}
                className="flex-1 px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Trocar Capa
              </button>
              <button
                type="button"
                onClick={() => onCoverImageChange("")}
                disabled={uploading !== null}
                className="px-3 py-1.5 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                Remover
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => coverInputRef.current?.click()}
            disabled={uploading !== null}
            className="w-full aspect-video border-2 border-dashed border-gray-300 rounded-lg hover:border-[#c41e3a] hover:bg-[#c41e3a]/5 transition-colors flex flex-col items-center justify-center gap-2 disabled:opacity-50"
          >
            {uploading === "cover" ? (
              <div className="w-8 h-8 border-4 border-[#c41e3a] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-gray-500">Clique para adicionar a imagem de capa</span>
                <span className="text-xs text-gray-400">Esta será a imagem principal do projeto</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Additional Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fotos Adicionais ({images.length}/10)
        </label>
        <input
          ref={imagesInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImagesUpload}
          className="hidden"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((url, index) => (
            <div key={url} className="relative group">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={url}
                  alt={`Foto ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors rounded-lg flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => moveImage(index, "up")}
                  disabled={index === 0}
                  className="p-1.5 bg-white rounded-full hover:bg-gray-100 disabled:opacity-30"
                  title="Mover para esquerda"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => moveImage(index, "down")}
                  disabled={index === images.length - 1}
                  className="p-1.5 bg-white rounded-full hover:bg-gray-100 disabled:opacity-30"
                  title="Mover para direita"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                  title="Remover"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <span className="absolute top-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                {index + 1}
              </span>
            </div>
          ))}

          {images.length < 10 && (
            <button
              type="button"
              onClick={() => imagesInputRef.current?.click()}
              disabled={uploading !== null}
              className="aspect-square border-2 border-dashed border-gray-300 rounded-lg hover:border-[#c41e3a] hover:bg-[#c41e3a]/5 transition-colors flex flex-col items-center justify-center gap-1 disabled:opacity-50"
            >
              {uploading === "images" ? (
                <div className="w-6 h-6 border-3 border-[#c41e3a] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-xs text-gray-500">Adicionar</span>
                </>
              )}
            </button>
          )}
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Adicione até 10 fotos adicionais. Use os botões para reordenar.
        </p>
      </div>

      {/* Video URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Vídeo do YouTube ou Vimeo (opcional)
        </label>

        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="url"
              value={videoInput}
              onChange={handleVideoUrlChange}
              placeholder="https://www.youtube.com/watch?v=..."
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#c41e3a] focus:border-transparent outline-none transition-all text-sm"
            />
            <button
              type="button"
              onClick={handleVideoUrlSave}
              className="px-4 py-2.5 bg-[#c41e3a] text-white text-sm font-medium rounded-lg hover:bg-[#a01830] transition-colors"
            >
              Salvar
            </button>
          </div>

          {embedUrl && (
            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900">
              <iframe
                src={embedUrl}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {videoUrl && !embedUrl && thumbnail && (
            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={thumbnail}
                alt="Video thumbnail"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {videoUrl && (
            <button
              type="button"
              onClick={() => {
                setVideoInput("");
                onVideoChange("");
              }}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Remover vídeo
            </button>
          )}

          <p className="text-xs text-gray-500">
            Cole o link do vídeo do YouTube ou Vimeo. Exemplos:<br />
            • https://www.youtube.com/watch?v=XXXXX<br />
            • https://youtu.be/XXXXX<br />
            • https://vimeo.com/XXXXX
          </p>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
      )}
    </div>
  );
}
