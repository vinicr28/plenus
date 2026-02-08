"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "./ScrollAnimations";
import ProjectModal from "./ProjectModal";

export interface Project {
  id: string;
  title: string;
  location: string;
  area: string;
  category: string;
  image: string;
  description?: string;
}

export default function Projects() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const smoothX = useSpring(x, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Fetch projects from API
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

  const openModal = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollPosition();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollPosition);
      return () => container.removeEventListener("scroll", checkScrollPosition);
    }
  }, [projects]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.offsetWidth / 3;
      const scrollAmount = direction === "left" ? -cardWidth : cardWidth;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <section ref={sectionRef} id="projetos" className="py-24 lg:py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-[#737373] text-sm font-semibold tracking-[0.2em] uppercase mb-4">
              Portfólio
            </p>
            <h2 className="font-[var(--font-playfair)] text-3xl md:text-5xl font-bold text-[#1a1a1a] mb-6">
              Nossos <span className="text-[#525252]">Projetos</span>
            </h2>
          </div>
          <div className="flex gap-6 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-shrink-0 w-[85%] sm:w-[45%] lg:w-[30%]">
                <div className="aspect-[3/4] rounded-2xl bg-gray-200 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return null;
  }

  return (
    <section ref={sectionRef} id="projetos" className="py-24 lg:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <FadeIn>
            <p className="text-[#737373] text-sm font-semibold tracking-[0.2em] uppercase mb-4">
              Portfólio
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <motion.h2
              className="font-[var(--font-playfair)] text-3xl md:text-5xl font-bold text-[#1a1a1a] mb-6"
              style={{ x: smoothX }}
            >
              Nossos <span className="text-[#525252]">Projetos</span>
            </motion.h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-lg text-[#525252] leading-relaxed">
              Conheça alguns dos sonhos que já realizamos para famílias como a
              sua.
            </p>
          </FadeIn>
        </div>

        {/* Projects horizontal scroll container */}
        <FadeIn delay={0.3}>
          <div
            className="relative group"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {/* Navigation Arrow - Left */}
            <button
              onClick={() => scroll("left")}
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 ${
                canScrollLeft && isHovering
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-4 pointer-events-none"
              }`}
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)",
                border: "1px solid rgba(0,0,0,0.1)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
              }}
              aria-label="Scroll left"
            >
              <svg className="w-5 h-5 text-[#1a1a1a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Navigation Arrow - Right */}
            <button
              onClick={() => scroll("right")}
              className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 ${
                canScrollRight && isHovering
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-4 pointer-events-none"
              }`}
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)",
                border: "1px solid rgba(0,0,0,0.1)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
              }}
              aria-label="Scroll right"
            >
              <svg className="w-5 h-5 text-[#1a1a1a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Scrollable container */}
            <div
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto scroll-smooth pb-4"
              style={{
                scrollSnapType: "x mandatory",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>

              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex-shrink-0 w-[85%] sm:w-[45%] lg:w-[30%] cursor-pointer group/card"
                  style={{ scrollSnapAlign: "start" }}
                  onClick={() => openModal(project)}
                >
                  {/* Card with image background */}
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                    {/* Project image */}
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                      sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 30vw"
                    />

                    {/* Gradient overlay for readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Liquid Glass info overlay at bottom */}
                    <div
                      className="absolute bottom-0 left-0 right-0 p-6 backdrop-blur-xl transition-all duration-300 group-hover/card:backdrop-blur-2xl"
                      style={{
                        background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)",
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
                        <span className="text-xs text-white/60">{project.area}</span>
                      </div>

                      {/* Title */}
                      <h3 className="font-[var(--font-playfair)] text-xl font-bold text-white mb-2 group-hover/card:text-[#c41e3a] transition-colors duration-300">
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
                    <div className="absolute inset-0 bg-[#c41e3a]/0 group-hover/card:bg-[#c41e3a]/10 transition-colors duration-300" />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Scroll indicator dots (mobile) */}
            <div className="flex justify-center gap-2 mt-6 lg:hidden">
              {projects.map((_, index) => (
                <div
                  key={index}
                  className="w-2 h-2 rounded-full bg-[#1a1a1a]/30"
                />
              ))}
            </div>
          </div>
        </FadeIn>

        {/* CTA */}
        <FadeIn delay={0.4}>
          <div className="text-center mt-12">
            <Link
              href="/projetos"
              className="inline-flex items-center text-[#525252] font-semibold hover:text-[#1a1a1a] transition-colors duration-300"
            >
              Ver todos os projetos
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
          </div>
        </FadeIn>
      </div>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </section>
  );
}
