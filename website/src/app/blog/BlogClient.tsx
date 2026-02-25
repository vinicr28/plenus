"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getAllPosts } from "@/lib/blog";

const ChatBot = dynamic(() => import("@/components/ChatBot"));

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogClient() {
  const posts = getAllPosts();

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
              <Breadcrumbs items={[{ label: "Blog" }]} />
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="max-w-3xl"
            >
              <p className="text-[#737373] text-sm font-semibold tracking-[0.2em] uppercase mb-4">
                Artigos & Novidades
              </p>
              <h1 className="font-[var(--font-playfair)] text-4xl md:text-6xl font-bold text-[#1a1a1a] mb-6">
                Nosso <span className="text-[#525252]">Blog</span>
              </h1>
              <p className="text-lg text-[#525252] leading-relaxed">
                Dicas, tendências e novidades sobre construção residencial,
                arquitetura e construção personalizada. Conteúdo feito para quem planeja
                construir.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {posts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-[#737373] text-lg">
                  Nenhum artigo publicado ainda. Volte em breve!
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {posts.map((post, index) => (
                  <motion.div
                    key={post.slug}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1,
                      ease: [0.21, 0.47, 0.32, 0.98],
                    }}
                  >
                    <Link href={`/blog/${post.slug}`} className="group block">
                      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_32px_-4px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300">
                        {/* Cover Image */}
                        <div className="relative aspect-[16/9] overflow-hidden bg-[#f5f5f5]">
                          <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          {/* Category Badge */}
                          <span className="inline-block px-3 py-1 bg-[#c41e3a]/10 text-[#c41e3a] text-xs font-semibold rounded-full mb-3">
                            {post.category}
                          </span>

                          {/* Title */}
                          <h2 className="font-[var(--font-playfair)] text-xl font-bold text-[#1a1a1a] mb-2 group-hover:text-[#c41e3a] transition-colors line-clamp-2">
                            {post.title}
                          </h2>

                          {/* Excerpt */}
                          <p className="text-[#525252] text-sm leading-relaxed mb-4 line-clamp-3">
                            {post.excerpt}
                          </p>

                          {/* Meta */}
                          <div className="flex items-center gap-3 text-xs text-[#737373]">
                            <time dateTime={post.date}>
                              {formatDate(post.date)}
                            </time>
                            <span className="w-1 h-1 bg-[#d4d4d4] rounded-full" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <ChatBot />
    </>
  );
}
