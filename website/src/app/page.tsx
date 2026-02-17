import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Hero from "@/components/Hero";

const About = dynamic(() => import("@/components/About"));
const Process = dynamic(() => import("@/components/Process"));
const Projects = dynamic(() => import("@/components/Projects"));
const Map3D = dynamic(() => import("@/components/Map3D"));
const Testimonials = dynamic(() => import("@/components/Testimonials"));
const Contact = dynamic(() => import("@/components/Contact"));
const PosVenda = dynamic(() => import("@/components/PosVenda"));
const TrabalheConosco = dynamic(() => import("@/components/TrabalheConosco"));
const Footer = dynamic(() => import("@/components/Footer"));
const ChatBot = dynamic(() => import("@/components/ChatBot"));

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Map3D />
        <Projects />
        <Process />
        <Testimonials />
        <Contact />
        <PosVenda />
        <TrabalheConosco />
      </main>
      <Footer />
      <ChatBot />
    </>
  );
}
