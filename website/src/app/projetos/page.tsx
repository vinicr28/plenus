import { Metadata } from "next";
import ProjetosClient from "./ProjetosClient";

export const metadata: Metadata = {
  title: "Projetos",
  description:
    "Explore nossa galeria de projetos realizados. Casas personalizadas construídas com excelência em Indaiatuba e Jundiaí. Veja nosso portfólio completo.",
  openGraph: {
    title: "Projetos | Plenus Obras",
    description:
      "Explore nossa galeria de projetos realizados. Casas personalizadas construídas com excelência em Indaiatuba e Jundiaí.",
    type: "website",
  },
};

export default function ProjetosPage() {
  return <ProjetosClient />;
}
