import { Metadata } from "next";
import BlogClient from "./BlogClient";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Dicas, tendências e novidades sobre construção residencial e arquitetura. Conteúdo especializado da Plenus Obras.",
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: "Blog | Plenus Obras",
    description:
      "Dicas, tendências e novidades sobre construção residencial e arquitetura.",
    type: "website",
  },
};

export default function BlogPage() {
  return <BlogClient />;
}
