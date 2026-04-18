import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

interface HeroProps {
  modelName?: string;
  title?: string;
  subtitle?: string;
  heroImageUrl?: string | null;
  isVideo?: boolean;
}

export default function Hero({ 
  modelName = "Vanessa",
  title = "Pack Exclusivo",
  subtitle = "Acesse o pack da Vanessa com fotos e vídeos em alta qualidade. Conteúdo inédito e exclusivo para admiradores.",
  heroImageUrl = "/assets/jesusvaimeperdoar.mp4",
  isVideo = true
}: HeroProps) {
  const scrollToPackages = () => {
    const packagesSection = document.getElementById('packages');
    packagesSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background (Video or Image) */}
      <div className="absolute inset-0 z-0">
        {isVideo && heroImageUrl ? (
          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
            <source src={heroImageUrl} type="video/mp4" />
          </video>
        ) : heroImageUrl ? (
          <img src={heroImageUrl} alt={modelName} className="w-full h-full object-cover" />
        ) : (
          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
            <source src="/assets/hero-video.mp4" type="video/mp4" />
          </video>
        )}
        {/* Overlay gradient: aggressive black filter to make text pop */}
        <div className="absolute inset-0 bg-black/70 sm:bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container text-center text-white px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Topo / Hook */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600/20 text-red-500 backdrop-blur-sm border border-red-500/50 animate-pulse">
            <span className="text-sm font-black tracking-widest uppercase">🚫 ISSO ERA PRA TER FICADO NO PRIVADO...</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight drop-shadow-2xl">
            O que a Vanessa grava quando tá sozinha <span className="text-red-500 block sm:inline">finalmente vazou</span>
          </h1>
          <p className="text-xl md:text-3xl text-gray-200 max-w-3xl mx-auto font-medium drop-shadow-lg">
            — e tá disponível por tempo limitado.
          </p>
          
          {/* Sutil seta indicando para rolar para baixo */}
          <div className="pt-16 animate-bounce flex justify-center">
             <div onClick={scrollToPackages} className="cursor-pointer w-10 h-16 border-2 border-white/50 rounded-full flex justify-center p-2 hover:border-white transition-colors">
               <div className="w-2 h-4 bg-white rounded-full animate-pulse" />
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
