import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Download, Lock, Shield, Star, Zap } from "lucide-react";

interface AboutProps {
  description?: string | null;
  aboutImageUrl?: string | null;
}

export default function About({ 
  description = "Oferecemos a melhor experiência em conteúdo exclusivo com qualidade incomparável e segurança total.",
  aboutImageUrl
}: AboutProps) {
  const benefits = [
    {
      icon: Camera,
      title: "Alta Qualidade",
      description: "Fotos e vídeos em resolução profissional, capturados com equipamento de última geração"
    },
    {
      icon: Lock,
      title: "100% Exclusivo",
      description: "Conteúdo inédito e exclusivo que você não encontra em nenhum outro lugar"
    },
    {
      icon: Zap,
      title: "Acesso Imediato",
      description: "Receba o link de download instantaneamente após a confirmação do pagamento"
    },
    {
      icon: Download,
      title: "Download Ilimitado",
      description: "Baixe quantas vezes quiser durante o período de acesso do seu pacote"
    },
    {
      icon: Shield,
      title: "Pagamento Seguro",
      description: "Transações protegidas com criptografia de ponta a ponta via Pix"
    },
    {
      icon: Star,
      title: "Satisfação Garantida",
      description: "Garantia de 7 dias ou seu dinheiro de volta, sem perguntas"
    }
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-secondary text-secondary-foreground border-0">
            Por Que Escolher Nosso Conteúdo?
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Experiência <span className="text-gradient-gold">Premium</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* Optional About Image */}
        {aboutImageUrl && (
          <div className="mb-16 max-w-4xl mx-auto">
            <img 
              src={aboutImageUrl} 
              alt="Sobre" 
              className="w-full h-auto rounded-lg shadow-2xl"
            />
          </div>
        )}

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card 
                key={index}
                className="border-2 hover:border-primary transition-all hover:shadow-lg group"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-luxury flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-gradient-luxury mb-2">500+</div>
            <div className="text-muted-foreground">Clientes Satisfeitos</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-gradient-luxury mb-2">1000+</div>
            <div className="text-muted-foreground">Conteúdos Exclusivos</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-gradient-luxury mb-2">4.9</div>
            <div className="text-muted-foreground">Avaliação Média</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-gradient-luxury mb-2">24/7</div>
            <div className="text-muted-foreground">Suporte Disponível</div>
          </div>
        </div>
      </div>
    </section>
  );
}
