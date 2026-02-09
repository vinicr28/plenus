"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { Project } from "@/components/Projects";

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
  if (youtubeId) return `https://www.youtube.com/embed/${youtubeId}?autoplay=1`;

  const vimeoId = getVimeoId(url);
  if (vimeoId) return `https://player.vimeo.com/video/${vimeoId}?autoplay=1`;

  return null;
}

// Get YouTube thumbnail
function getYouTubeThumbnail(url: string): string | null {
  const youtubeId = getYouTubeId(url);
  if (youtubeId) return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
  return null;
}

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

type MediaItem =
  | { type: 'image'; url: string }
  | { type: 'video'; url: string; thumbnail: string | null };

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [imageLightboxOpen, setImageLightboxOpen] = useState(false);

  // Combine cover image, additional images, and video into a single media array
  const mediaItems: MediaItem[] = project
    ? [
        { type: 'image', url: project.image },
        ...(project.images || []).map(url => ({ type: 'image' as const, url })),
        ...(project.video_url
          ? [{
              type: 'video' as const,
              url: project.video_url,
              thumbnail: getYouTubeThumbnail(project.video_url),
            }]
          : []),
      ]
    : [];

  const hasVideo = !!project?.video_url;
  const currentMedia = mediaItems[currentIndex];
  const isCurrentVideo = currentMedia?.type === 'video';

  // Reset state when project changes
  useEffect(() => {
    setCurrentIndex(0);
    setVideoModalOpen(false);
    setImageLightboxOpen(false);
  }, [project?.id]);

  // Navigation functions
  const goToNext = useCallback(() => {
    if (currentIndex < mediaItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, mediaItems.length]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (imageLightboxOpen) {
          setImageLightboxOpen(false);
        } else if (videoModalOpen) {
          setVideoModalOpen(false);
        } else {
          onClose();
        }
      }
      if (!videoModalOpen && !imageLightboxOpen) {
        if (e.key === "ArrowRight") goToNext();
        if (e.key === "ArrowLeft") goToPrev();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, goToNext, goToPrev, videoModalOpen, imageLightboxOpen]);

  if (!project) return null;

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < mediaItems.length - 1;
  const videoEmbedUrl = project.video_url ? getVideoEmbedUrl(project.video_url) : null;
  const imageCount = mediaItems.filter(m => m.type === 'image').length;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            onClick={onClose}
          >
            {/* Backdrop with blur */}
            <motion.div
              initial={{ backdropFilter: "blur(0px)" }}
              animate={{ backdropFilter: "blur(20px)" }}
              exit={{ backdropFilter: "blur(0px)" }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 bg-black/60"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 100, rotateX: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
                duration: 0.5,
              }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl"
              style={{ perspective: "1000px" }}
            >
              {/* Glassmorphism background */}
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)",
                  backdropFilter: "blur(40px)",
                }}
              />

              {/* Close button */}
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 500 }}
                onClick={onClose}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/10 backdrop-blur-sm flex items-center justify-center hover:bg-black/20 transition-colors"
              >
                <svg className="w-5 h-5 text-[#1a1a1a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>

              {/* Content wrapper */}
              <div className="relative z-10 flex flex-col md:flex-row h-full max-h-[90vh] overflow-y-auto">
                {/* Image section */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="relative w-full md:w-1/2 aspect-[4/3] md:aspect-auto md:min-h-[500px] overflow-hidden bg-gray-100"
                >
                  {/* Media display (images or video thumbnail) */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0"
                    >
                      {currentMedia?.type === 'image' ? (
                        <Image
                          src={currentMedia.url}
                          alt={`${project.title} - Foto ${currentIndex + 1}`}
                          fill
                          className="object-cover cursor-zoom-in"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          onDoubleClick={() => setImageLightboxOpen(true)}
                        />
                      ) : currentMedia?.type === 'video' ? (
                        <button
                          onClick={() => setVideoModalOpen(true)}
                          className="absolute inset-0 w-full h-full group"
                        >
                          {currentMedia.thumbnail ? (
                            <Image
                              src={currentMedia.thumbnail}
                              alt="Video thumbnail"
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gray-900" />
                          )}
                          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                              <svg className="w-9 h-9 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 rounded-full text-white text-sm font-medium">
                            Clique para assistir o vídeo
                          </div>
                        </button>
                      ) : null}
                    </motion.div>
                  </AnimatePresence>

                  {/* Image overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-white/20 pointer-events-none" />

                  {/* Navigation arrows */}
                  {mediaItems.length > 1 && (
                    <>
                      {canGoPrev && (
                        <button
                          onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                        >
                          <svg className="w-5 h-5 text-[#1a1a1a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                      )}
                      {canGoNext && (
                        <button
                          onClick={(e) => { e.stopPropagation(); goToNext(); }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                        >
                          <svg className="w-5 h-5 text-[#1a1a1a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      )}
                    </>
                  )}

                  {/* Thumbnails / dots */}
                  {mediaItems.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-3 py-2 rounded-full bg-black/40 backdrop-blur-sm">
                      {mediaItems.map((item, index) => (
                        <button
                          key={index}
                          onClick={(e) => { e.stopPropagation(); goToImage(index); }}
                          className={`h-2 rounded-full transition-all flex items-center justify-center ${
                            currentIndex === index
                              ? item.type === 'video' ? "bg-red-500 w-4" : "bg-white w-4"
                              : item.type === 'video' ? "bg-red-500/50 hover:bg-red-500/80 w-2" : "bg-white/50 hover:bg-white/80 w-2"
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Media counter */}
                  <div className="absolute top-4 left-4">
                    <span
                      className="text-sm font-medium px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-2"
                      style={{
                        background: isCurrentVideo ? "rgba(220,38,38,0.8)" : "rgba(0,0,0,0.4)",
                        color: "#fff",
                      }}
                    >
                      {isCurrentVideo ? (
                        <>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                          Vídeo
                        </>
                      ) : (
                        `${currentIndex + 1} / ${imageCount}`
                      )}
                    </span>
                  </div>

                  {/* Category badge on image */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="absolute bottom-16 left-4 md:bottom-16 md:left-6"
                  >
                    <span
                      className="text-sm font-medium px-4 py-2 rounded-full backdrop-blur-md"
                      style={{
                        background: "rgba(255,255,255,0.2)",
                        border: "1px solid rgba(255,255,255,0.3)",
                        color: "#fff",
                      }}
                    >
                      {project.category}
                    </span>
                  </motion.div>
                </motion.div>

                {/* Info section */}
                <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
                  {/* Title */}
                  <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-4"
                  >
                    {project.title}
                  </motion.h2>

                  {/* Location */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="flex items-center gap-2 text-[#525252] mb-6"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{project.location}</span>
                  </motion.div>

                  {/* Stats */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className={`grid gap-4 mb-6 ${hasVideo ? 'grid-cols-3' : 'grid-cols-2'}`}
                  >
                    <div className="bg-[#fafafa] rounded-2xl p-4">
                      <p className="text-sm text-[#737373] mb-1">Área Total</p>
                      <p className="text-2xl font-bold text-[#1a1a1a]">{project.area}</p>
                    </div>
                    <div className="bg-[#fafafa] rounded-2xl p-4">
                      <p className="text-sm text-[#737373] mb-1">Fotos</p>
                      <p className="text-2xl font-bold text-[#1a1a1a]">{imageCount}</p>
                    </div>
                    {hasVideo && (
                      <div className="bg-[#fafafa] rounded-2xl p-4">
                        <p className="text-sm text-[#737373] mb-1">Vídeo</p>
                        <p className="text-2xl font-bold text-red-600">1</p>
                      </div>
                    )}
                  </motion.div>

                  {/* Description */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="mb-6"
                  >
                    <h3 className="text-sm font-semibold text-[#737373] uppercase tracking-wider mb-3">
                      Sobre o Projeto
                    </h3>
                    <p className="text-[#525252] leading-relaxed text-sm">
                      {project.description ||
                        "Um projeto exclusivo desenvolvido com atenção aos mínimos detalhes, combinando design contemporâneo com funcionalidade."}
                    </p>
                  </motion.div>

                  {/* Features */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="mb-6"
                  >
                    <div className="flex flex-wrap gap-2">
                      {["Acabamento Premium", "Projeto Personalizado", "Entrega no Prazo", "Garantia"].map(
                        (feature, index) => (
                          <motion.span
                            key={feature}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8 + index * 0.1 }}
                            className="text-xs px-3 py-1.5 rounded-full bg-[#1a1a1a]/5 text-[#525252]"
                          >
                            {feature}
                          </motion.span>
                        )
                      )}
                    </div>
                  </motion.div>

                  {/* CTA Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                  >
                    <a
                      href="#contato"
                      onClick={onClose}
                      className="inline-flex items-center justify-center w-full md:w-auto px-8 py-4 bg-[#1a1a1a] text-white font-semibold rounded-xl hover:bg-[#333] transition-colors"
                    >
                      Quero um Projeto Assim
                      <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                  </motion.div>
                </div>
              </div>

              {/* Decorative elements */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 0.5 }}
                className="absolute -top-20 -right-20 w-40 h-40 rounded-full pointer-events-none"
                style={{
                  background: "radial-gradient(circle, rgba(196,30,58,0.1) 0%, transparent 70%)",
                }}
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ delay: 0.6 }}
                className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full pointer-events-none"
                style={{
                  background: "radial-gradient(circle, rgba(26,26,26,0.1) 0%, transparent 70%)",
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Lightbox */}
      <AnimatePresence>
        {imageLightboxOpen && currentMedia?.type === 'image' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            onClick={() => setImageLightboxOpen(false)}
          >
            <div className="absolute inset-0 bg-black/90" />

            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              onClick={() => setImageLightboxOpen(false)}
              className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-6xl max-h-[90vh] aspect-auto"
            >
              <Image
                src={currentMedia.url}
                alt={`${project?.title} - Foto ${currentIndex + 1}`}
                width={1920}
                height={1080}
                className="w-full h-full max-h-[90vh] object-contain rounded-xl cursor-zoom-out"
                onClick={() => setImageLightboxOpen(false)}
              />
            </motion.div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-sm">
              Pressione ESC para fechar
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Modal */}
      <AnimatePresence>
        {videoModalOpen && project?.video_url && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            onClick={() => setVideoModalOpen(false)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/90" />

            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              onClick={() => setVideoModalOpen(false)}
              className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>

            {/* Video Container */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl aspect-video"
            >
              {videoEmbedUrl ? (
                <iframe
                  src={videoEmbedUrl}
                  className="w-full h-full rounded-xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={project.video_url}
                  controls
                  autoPlay
                  className="w-full h-full rounded-xl object-contain bg-black"
                />
              )}
            </motion.div>

            {/* Press ESC hint */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-sm">
              Pressione ESC para fechar
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
