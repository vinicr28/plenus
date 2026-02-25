"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { BlogPost, getAllPosts } from "@/lib/blog";

const ChatBot = dynamic(() => import("@/components/ChatBot"));

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function renderInline(text: string): React.ReactNode {
  // Parse [text](url) links within text
  const parts: React.ReactNode[] = [];
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const isInternal = match[2].startsWith("/");
    parts.push(
      <a
        key={match.index}
        href={match[2]}
        className="text-[#c41e3a] underline underline-offset-2 hover:text-[#a01830] transition-colors"
        {...(!isInternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {match[1]}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex === 0) return text;
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

function renderMarkdown(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Table: collect all | rows
    if (line.trim().startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      // Parse header, separator, and body rows
      const parseRow = (row: string) =>
        row.split("|").slice(1, -1).map((cell) => cell.trim());
      const header = parseRow(tableLines[0]);
      // Skip separator row (index 1)
      const bodyRows = tableLines.slice(2).map(parseRow);

      elements.push(
        <div key={`table-${i}`} className="overflow-x-auto my-6">
          <table className="w-full border-collapse rounded-xl overflow-hidden text-sm">
            <thead>
              <tr className="bg-[#1a1a1a] text-white">
                {header.map((cell, ci) => (
                  <th key={ci} className="px-5 py-3 text-left font-semibold">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bodyRows.map((row, ri) => (
                <tr
                  key={ri}
                  className={ri % 2 === 0 ? "bg-[#fafafa]" : "bg-white"}
                >
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className="px-5 py-3 text-[#525252] border-b border-gray-100"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    if (line.startsWith("### ")) {
      elements.push(
        <h3
          key={i}
          className="font-[var(--font-playfair)] text-xl font-bold text-[#1a1a1a] mt-8 mb-3"
        >
          {renderInline(line.slice(4))}
        </h3>
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2
          key={i}
          className="font-[var(--font-playfair)] text-2xl font-bold text-[#1a1a1a] mt-10 mb-4"
        >
          {renderInline(line.slice(3))}
        </h2>
      );
    } else if (line.trim() === "") {
      // skip empty lines
    } else {
      elements.push(
        <p key={i} className="text-[#525252] leading-relaxed mb-4">
          {renderInline(line)}
        </p>
      );
    }

    i++;
  }

  return elements;
}

export default function BlogPostClient({ post }: { post: BlogPost }) {
  const relatedPosts = getAllPosts().filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Header */}
        <section className="relative pt-32 pb-8 bg-gradient-to-b from-[#fafafa] to-white">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            {/* Breadcrumb */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <Breadcrumbs
                items={[
                  { label: "Blog", href: "/blog" },
                  { label: post.title },
                ]}
              />
            </motion.div>

            {/* Category & Meta */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="inline-block px-3 py-1 bg-[#c41e3a]/10 text-[#c41e3a] text-xs font-semibold rounded-full mb-4">
                {post.category}
              </span>

              <h1 className="font-[var(--font-playfair)] text-3xl md:text-5xl font-bold text-[#1a1a1a] mb-4">
                {post.title}
              </h1>

              <div className="flex items-center gap-3 text-sm text-[#737373] mb-8">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span className="w-1 h-1 bg-[#d4d4d4] rounded-full" />
                <span>{post.readTime}</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Cover Image */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="pb-12"
        >
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-[#f5f5f5]">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 896px"
                priority
              />
            </div>
          </div>
        </motion.section>

        {/* Content */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="pb-24"
        >
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <article className="text-base lg:text-lg">
              {renderMarkdown(post.content)}
            </article>

            {/* CTA + Back */}
            <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-start gap-4">
              <Link
                href="/#contato"
                className="inline-flex items-center px-6 py-3 bg-[#c41e3a] text-white text-sm font-semibold rounded-full hover:bg-[#a01830] transition-colors"
              >
                Fale com a Plenus
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center px-6 py-3 bg-[#1a1a1a] text-white text-sm font-semibold rounded-full hover:bg-[#333] transition-colors"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Voltar ao Blog
              </Link>
            </div>
          </div>
        </motion.section>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <section className="pb-24 bg-[#fafafa]">
            <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
              <h2 className="font-[var(--font-playfair)] text-2xl font-bold text-[#1a1a1a] mb-8 text-center">
                Artigos Relacionados
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {relatedPosts.map((related) => (
                  <Link key={related.slug} href={`/blog/${related.slug}`} className="group block">
                    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_32px_-4px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300">
                      <div className="relative aspect-[16/9] overflow-hidden bg-[#f5f5f5]">
                        <Image
                          src={related.coverImage}
                          alt={related.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, 50vw"
                        />
                      </div>
                      <div className="p-5">
                        <span className="inline-block px-3 py-1 bg-[#c41e3a]/10 text-[#c41e3a] text-xs font-semibold rounded-full mb-2">
                          {related.category}
                        </span>
                        <h3 className="font-[var(--font-playfair)] text-lg font-bold text-[#1a1a1a] group-hover:text-[#c41e3a] transition-colors line-clamp-2 mb-2">
                          {related.title}
                        </h3>
                        <p className="text-[#525252] text-sm leading-relaxed line-clamp-2">
                          {related.excerpt}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
      <ChatBot />
    </>
  );
}
