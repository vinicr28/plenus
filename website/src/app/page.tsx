import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Differentials from "@/components/Differentials";
import Projects from "@/components/Projects";
import Map3D from "@/components/Map3D";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import PosVenda from "@/components/PosVenda";
import TrabalheConosco from "@/components/TrabalheConosco";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Map3D />
        <Projects />
        <Differentials />
        <Testimonials />
        <Contact />
        <PosVenda />
        <TrabalheConosco />
      </main>
      <Footer />
      <FloatingCTA />
    </>
  );
}
