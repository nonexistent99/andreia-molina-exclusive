import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Packages from "@/components/Packages";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main id="hero">
        <Hero />
        <Packages />
      </main>
      <Footer />
    </div>
  );
}
