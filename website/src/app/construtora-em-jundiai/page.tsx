import { Metadata } from "next";
import { createServiceClient } from "@/lib/supabase/server";
import CityPageClient from "./CityPageClient";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Construtora em Jundiaí | Casas Personalizadas",
  description:
    "Construtora especializada em construção de casas em Jundiaí. Projetos residenciais personalizados com qualidade premium e economia real. Conheça a Plenus Obras.",
  alternates: {
    canonical: "/construtora-em-jundiai",
  },
  openGraph: {
    title: "Construtora em Jundiaí | Casas Personalizadas | Plenus Obras",
    description:
      "Construtora especializada em construção de casas em Jundiaí. Projetos residenciais personalizados com qualidade premium e economia real.",
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
    return data && data.length === 3 ? data : undefined;
  } catch {
    return undefined;
  }
}

export default async function ConstrutorJundiaiPage() {
  const stats = await getHeroStats();
  return <CityPageClient stats={stats ?? undefined} />;
}
