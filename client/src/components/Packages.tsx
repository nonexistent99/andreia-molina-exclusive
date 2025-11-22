import { Button } from "@/components/ui/button";
import { Check, Sparkles, Crown, Gem, Zap } from "lucide-react";
import { useLocation } from "wouter";

interface Product {
  id: number;
  name: string;
  description: string;
  priceInCents: number;
  originalPriceInCents: number | null;
  imageUrl: string | null;
  features: string;
  isFeatured: boolean;
}

interface PackagesProps {
  products?: Product[];
  isLoading?: boolean;
}

export default function Packages({ products = [], isLoading = false }: PackagesProps) {
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <section id="packages" className="py-20 bg-background">
        <div className="container">
          <div className="text-center">
            <p className="text-muted-foreground">Carregando pacotes...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <section id="packages" className="py-20 bg-background">
        <div className="container">
          <div className="text-center">
            <p className="text-muted-foreground">Nenhum pacote disponível no momento.</p>
          </div>
        </div>
      </section>
    );
  }

  const getPackageIcon = (index: number) => {
    const icons = [Sparkles, Crown, Gem];
    const Icon = icons[index % icons.length];
    return <Icon className="w-16 h-16 text-accent" />;
  };

  return (
    <section id="packages" className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block mb-4 px-4 py-2 bg-accent/10 border border-accent/30 rounded-full">
            <span className="text-accent font-semibold flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Conteúdo Exclusivo Premium
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Escolha Seu <span className="text-accent">Pacote Exclusivo</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Acesso imediato após pagamento. Conteúdo inédito e exclusivo de alta qualidade.
          </p>
        </div>

        <div className="space-y-16 max-w-7xl mx-auto">
          {products.map((product, index) => {
            const features = JSON.parse(product.features || "[]");
            const isReversed = index % 2 !== 0;
            const discount = product.originalPriceInCents ? Math.round(
              ((product.originalPriceInCents - product.priceInCents) / product.originalPriceInCents) * 100
            ) : 0;

            return (
              <div
                key={product.id}
                className="group relative animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Badge de Desconto */}
                {discount > 0 && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 bg-accent text-accent-foreground px-6 py-2 rounded-full font-bold text-sm shadow-lg">
                    🔥 {discount}% OFF
                  </div>
                )}

                {/* Badge Mais Vendido */}
                {product.isFeatured && (
                  <div className="absolute -top-4 right-8 z-20 bg-secondary text-secondary-foreground px-6 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                    Mais Vendido
                  </div>
                )}

                <div
                  className={`flex flex-col ${
                    isReversed ? "lg:flex-row-reverse" : "lg:flex-row"
                  } items-stretch gap-0 bg-card border-2 border-border rounded-2xl overflow-hidden hover:border-accent/50 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/20`}
                >
                  {/* Imagem/Logo do Pacote */}
                  <div className="w-full lg:w-1/2 relative overflow-hidden bg-black">
                    <div className="aspect-[4/3] lg:aspect-auto lg:h-full relative">
                      <img
                        src={product.imageUrl || "/assets/package-premium.jpg"}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-secondary/20" />
                      
                      {/* Logo/Icon overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black/40 backdrop-blur-md p-10 rounded-full border-2 border-accent group-hover:scale-110 group-hover:border-secondary transition-all duration-500">
                          {getPackageIcon(index)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Conteúdo do Pacote */}
                  <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                    <h3 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                      {product.name}
                    </h3>
                    <p className="text-muted-foreground mb-6 text-lg">
                      {product.description}
                    </p>

                    {/* Preço */}
                    <div className="mb-6">
                      {product.originalPriceInCents && product.originalPriceInCents > product.priceInCents && (
                        <div className="text-muted-foreground line-through text-xl mb-1">
                          R$ {(product.originalPriceInCents / 100).toFixed(2)}
                        </div>
                      )}
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold text-accent">
                          R$ {(product.priceInCents / 100).toFixed(2)}
                        </span>
                        <span className="text-muted-foreground">à vista</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-3 mb-8">
                      {features.map((feature: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                          <span className="text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <Button
                      onClick={() => setLocation(`/checkout/${product.id}`)}
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base sm:text-lg py-6 sm:py-7 rounded-xl font-bold shadow-lg hover:shadow-accent/50 transition-all duration-300 hover:scale-[1.02]"
                    >
                      <span className="hidden sm:inline">🔒 Comprar Agora - Acesso Imediato</span>
                      <span className="sm:hidden">🔒 Comprar Agora</span>
                    </Button>

                    {/* Garantias */}
                    <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground justify-center lg:justify-start">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-accent" />
                        Pagamento Seguro Pix
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-accent" />
                        Acesso Imediato
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-accent" />
                        Garantia 7 Dias
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
