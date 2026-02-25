import { Metadata } from "next";
import { createServiceClient } from "@/lib/supabase/server";
import CityPageClient from "./CityPageClient";

export const metadata: Metadata = {
  title: "Construtora em Indaiatuba | Casas Personalizadas",
  description:
    "Construtora especializada em construção de casas em Indaiatuba. Projetos personalizados em condomínios fechados com economia de até 40%. Conheça a Plenus Obras.",
  alternates: {
    canonical: "/construtora-em-indaiatuba",
  },
  openGraph: {
    title: "Construtora em Indaiatuba | Casas Personalizadas | Plenus Obras",
    description:
      "Construtora especializada em construção de casas em Indaiatuba. Projetos personalizados em condomínios fechados com economia de até 40%.",
    type: "website",
  },
};

async function getHeroStats() {
  try {
    const supabase = await createServiceClient();
    const { data } = await supabase
      .from('hero_stats')
      .select('position, value, label, prefix')
      .order('position');
    return data && data.length === 4 ? data : undefined;
  } catch {
    return undefined;
  }
}

export default async function ConstrutorIndaiatubaPage() {
  const stats = await getHeroStats();
  return <CityPageClient stats={stats ?? undefined} />;
}
