import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import { createServiceClient } from "@/lib/supabase/server";

export const revalidate = 0;

const About = dynamic(() => import("@/components/About"));
const Process = dynamic(() => import("@/components/Process"));
const Projects = dynamic(() => import("@/components/Projects"));
const Map3D = dynamic(() => import("@/components/Map3D"));
const Testimonials = dynamic(() => import("@/components/Testimonials"));
const FAQ = dynamic(() => import("@/components/FAQ"));
const Contact = dynamic(() => import("@/components/Contact"));
const PosVenda = dynamic(() => import("@/components/PosVenda"));
const TrabalheConosco = dynamic(() => import("@/components/TrabalheConosco"));
const Footer = dynamic(() => import("@/components/Footer"));
const ChatBot = dynamic(() => import("@/components/ChatBot"));

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

export default async function Home() {
  const heroStats = await getHeroStats();

  return (
    <>
      <Header />
      <main>
        <Hero stats={heroStats ?? undefined} />
        <Testimonials />
        <Projects />
        <About />
        <Map3D />
        <Process />
        <Contact />
        <PosVenda />
        <FAQ />
        <TrabalheConosco />
      </main>
      <Footer />
      <ChatBot />
    </>
  );
}
