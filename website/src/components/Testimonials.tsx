"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { FadeIn } from "./ScrollAnimations";

interface Review {
  id: string;
  name: string;
  email: string;
  rating: number;
  comment: string;
  location: string | null;
  approved: boolean;
  created_at: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${
            i < rating ? "text-[#c41e3a]" : "text-[#e5e5e5]"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function InteractiveStarRating({
  rating,
  onRatingChange
}: {
  rating: number;
  onRatingChange: (rating: number) => void;
}) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          className="transition-transform hover:scale-110"
        >
          <svg
            className={`w-8 h-8 transition-colors ${
              star <= (hoverRating || rating) ? "text-[#c41e3a]" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

function RatingModal({
  isOpen,
  onClose,
  onSuccess
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const resetForm = () => {
    setRating(0);
    setComment("");
    setName("");
    setEmail("");
    setError("");
    setSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (rating === 0) {
      setError("Por favor, selecione uma avaliação");
      return;
    }
    if (!name.trim()) {
      setError("Por favor, informe seu nome");
      return;
    }
    if (!email.trim()) {
      setError("Por favor, informe seu e-mail");
      return;
    }
    if (!comment.trim()) {
      setError("Por favor, deixe um comentário");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, rating, comment }),
      });

      if (!response.ok) {
        throw new Error("Erro ao enviar avaliação");
      }

      setSuccess(true);
      onSuccess();
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch {
      setError("Erro ao enviar avaliação. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#1a1a1a] px-6 py-5">
              <h3 className="text-xl font-bold text-white">Deixe sua Avaliação</h3>
              <p className="text-white/60 text-sm mt-1">
                Sua opinião é muito importante para nós
              </p>
            </div>

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {success ? (
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Obrigado pela sua avaliação!</h4>
                <p className="text-gray-600">Sua avaliação será analisada e publicada em breve.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}

                {/* Star Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Como você avalia a Plenus?
                  </label>
                  <div className="flex justify-center">
                    <InteractiveStarRating rating={rating} onRatingChange={setRating} />
                  </div>
                  {rating > 0 && (
                    <p className="text-center text-sm text-gray-500 mt-2">
                      {rating === 1 && "Muito ruim"}
                      {rating === 2 && "Ruim"}
                      {rating === 3 && "Regular"}
                      {rating === 4 && "Bom"}
                      {rating === 5 && "Excelente"}
                    </p>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label htmlFor="rating-name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome
                  </label>
                  <input
                    id="rating-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#c41e3a] focus:border-transparent outline-none transition-all"
                    placeholder="Seu nome completo"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="rating-email" className="block text-sm font-medium text-gray-700 mb-2">
                    E-mail
                  </label>
                  <input
                    id="rating-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#c41e3a] focus:border-transparent outline-none transition-all"
                    placeholder="seu@email.com"
                  />
                </div>

                {/* Comment */}
                <div>
                  <label htmlFor="rating-comment" className="block text-sm font-medium text-gray-700 mb-2">
                    Comentário
                  </label>
                  <textarea
                    id="rating-comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#c41e3a] focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Conte sua experiência com a Plenus..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-4 bg-[#c41e3a] text-white font-semibold rounded-lg hover:bg-[#a01830] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Enviando..." : "Enviar Avaliação"}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ScaleOnScrollCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.6, 1]);

  const smoothScale = useSpring(scale, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const smoothOpacity = useSpring(opacity, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div ref={ref} style={{ scale: smoothScale, opacity: smoothOpacity }}>
      {children}
    </motion.div>
  );
}

export default function Testimonials() {
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  const fetchReviews = async () => {
    try {
      const response = await fetch("/api/reviews");
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch {
      // keep reviews as empty array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

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
  }, [reviews]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.offsetWidth / 3;
      const scrollAmount = direction === "left" ? -cardWidth : cardWidth;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section id="depoimentos" className="py-24 lg:py-32 bg-[#1a1a1a] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <FadeIn>
            <p className="text-[#c41e3a] text-sm font-semibold tracking-[0.2em] uppercase mb-4">
              Depoimentos
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="font-[var(--font-playfair)] text-3xl md:text-5xl font-bold text-white mb-6">
              O Que Nossos{" "}
              <span className="text-[#c41e3a]">Clientes Dizem</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-lg text-white/70 leading-relaxed">
              A satisfação de nossos clientes é o nosso maior patrimônio.
            </p>
          </FadeIn>
        </div>

        {/* Testimonials horizontal scroll container */}
        {loading ? (
          <div className="flex gap-6 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-shrink-0 w-[85%] sm:w-[45%] lg:w-[30%]">
                <div className="bg-white/5 rounded-2xl p-8 animate-pulse">
                  <div className="h-6 w-6 bg-white/10 rounded mb-6" />
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((j) => (
                      <div key={j} className="h-5 w-5 bg-white/10 rounded" />
                    ))}
                  </div>
                  <div className="h-20 bg-white/10 rounded mb-6" />
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-full" />
                    <div className="flex-1">
                      <div className="h-4 bg-white/10 rounded w-24 mb-2" />
                      <div className="h-3 bg-white/10 rounded w-20" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <FadeIn delay={0.3}>
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <p className="text-white/50 text-lg">
                Ainda não há avaliações. Seja o primeiro a avaliar!
              </p>
            </div>
          </FadeIn>
        ) : (
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
                className="flex gap-6 overflow-x-auto scroll-smooth pb-4 scrollbar-hide"
                style={{
                  scrollSnapType: "x mandatory",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >

                {reviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex-shrink-0 w-[85%] sm:w-[45%] lg:w-[30%]"
                    style={{ scrollSnapAlign: "start" }}
                  >
                    <ScaleOnScrollCard>
                      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl h-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                        {/* Quote icon */}
                        <div className="mb-6">
                          <svg
                            className="w-10 h-10 text-[#c41e3a]/40"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                          </svg>
                        </div>

                        {/* Rating */}
                        <div className="mb-4">
                          <StarRating rating={review.rating} />
                        </div>

                        {/* Text */}
                        <p className="text-white/80 leading-relaxed mb-6">
                          &ldquo;{review.comment}&rdquo;
                        </p>

                        {/* Author */}
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#c41e3a]/20 rounded-full flex items-center justify-center">
                            <span className="text-[#c41e3a] font-bold text-lg">
                              {review.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-white">
                              {review.name}
                            </p>
                            <p className="text-sm text-white/50">
                              {review.location || "Cliente Plenus"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </ScaleOnScrollCard>
                  </motion.div>
                ))}
              </div>

              {/* Scroll indicator dots (mobile) */}
              <div className="flex justify-center gap-2 mt-6 lg:hidden">
                {reviews.map((_, index) => (
                  <div
                    key={index}
                    className="w-2 h-2 rounded-full bg-white/30"
                  />
                ))}
              </div>
            </div>
          </FadeIn>
        )}

        {/* CTA to leave a review */}
        <FadeIn delay={0.4}>
          <div className="text-center mt-12">
            <button
              onClick={() => setIsRatingModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#c41e3a] text-white font-semibold rounded-xl hover:bg-[#a01830] transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Deixe sua Avaliação
            </button>
          </div>
        </FadeIn>
      </div>

      {/* Rating Modal */}
      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        onSuccess={fetchReviews}
      />
    </section>
  );
}
