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
  modelName = "Andreia Molina",
  title = "Conteúdo Exclusivo",
  subtitle = "Acesse pacotes premium com fotos e vídeos em alta qualidade. Conteúdo inédito e exclusivo para admiradores.",
  heroImageUrl,
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
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={heroImageUrl} type="video/mp4" />
          </video>
        ) : heroImageUrl ? (
          <img 
            src={heroImageUrl} 
            alt={modelName}
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/assets/hero-video.mp4" type="video/mp4" />
          </video>
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container text-center text-white px-4 py-20">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-luxury backdrop-blur-sm border border-white/20 animate-shimmer">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">Conteúdo Exclusivo VIP</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
            {modelName}
            <span className="block text-gradient-gold mt-2">{title}</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto">
            {subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              size="lg"
              className="bg-gradient-luxury hover:opacity-90 text-white font-semibold px-8 py-6 text-lg group"
              onClick={scrollToPackages}
            >
              Ver Pacotes Exclusivos
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white/30 hover:bg-white/10 text-white font-semibold px-8 py-6 text-lg backdrop-blur-sm"
              onClick={scrollToPackages}
            >
              Saiba Mais
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 pt-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span>Pagamento Seguro via Pix</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span>Acesso Imediato</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span>100% Exclusivo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-white/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
