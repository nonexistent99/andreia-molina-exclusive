import { Button } from "@/components/ui/button";
import { Check, Sparkles, Crown, Gem, Zap, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

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
  const [processingId, setProcessingId] = useState<number | null>(null);
  const createOrderMutation = trpc.orders.create.useMutation();

  const handleQuickCheckout = async (productId: number) => {
    if (processingId) return;
    setProcessingId(productId);
    
    try {
      const result = await createOrderMutation.mutateAsync({
        productId,
        // Using preset dummy check out info to completely skip the form
        customerName: "Hiury Samuel Brandão Costa",
        customerEmail: "slaoq999111999@gmail.com",
        customerPhone: "38999493695",
        customerDocument: "50958347824",
        orderBumpIds: [],
      });

      toast.success("Redirecionando para o PIX...");
      setLocation(`/payment/${result.order.orderNumber}`);
    } catch (error) {
      setProcessingId(null);
      toast.error("Erro ao criar pedido. Tente novamente.");
      console.error(error);
    }
  };

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

  const getPackageIcon = (index: number) => {
    const icons = [Sparkles, Crown, Gem];
    const Icon = icons[index % icons.length];
    return <Icon className="w-16 h-16 text-accent" />;
  };

  return (
    <section id="packages" className="py-20 bg-background text-foreground">
      <div className="container">
        
        {/* Quebra Mental & Desejo Direto */}
        <div className="w-full max-w-4xl mx-auto space-y-8 flex flex-col items-center mb-16 animate-fade-in">
          <div className="bg-white/5 p-6 md:p-8 rounded-2xl border border-white/10 w-full text-center space-y-5">
            <p className="text-lg md:text-xl leading-relaxed font-light">
              Se você já viu ela nas redes... esquece. Aqui é outro nível.<br/>
              <strong className="text-white font-bold">Sem filtro. Sem censura. Sem nada segurando.</strong>
            </p>
            <p className="text-lg md:text-xl leading-relaxed font-light">
              Você vai ver a Vanessa do jeito que só quem paga já viu... em momentos que ela nunca postaria publicamente.<br/>
              E sim... <strong className="text-red-500 font-bold decoration-red-500/50 underline">é exatamente o que você tá imaginando agora.</strong>
            </p>
          </div>

          {/* Escassez Pesada & Hacks */}
          <div className="w-full space-y-4">
            <div className="bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 p-4 rounded-xl flex items-center justify-center gap-3">
              <span className="text-2xl animate-pulse">⚠️</span>
              <p className="text-sm md:text-base font-bold text-center">
                Esse acesso já caiu 2x essa semana e pode sair do ar a qualquer momento. Quem entrou antes, salvou tudo.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-sm font-semibold pt-2">
              <div className="flex -space-x-3 mr-2">
                <img className="w-8 h-8 rounded-full border-2 border-black" src="https://i.pravatar.cc/100?img=11" alt="user" />
                <img className="w-8 h-8 rounded-full border-2 border-black" src="https://i.pravatar.cc/100?img=12" alt="user" />
                <img className="w-8 h-8 rounded-full border-2 border-black" src="https://i.pravatar.cc/100?img=15" alt="user" />
              </div>
              <span className="text-green-500 flex items-center gap-1 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> +3 pessoas acessaram agora
              </span>
              <span className="opacity-50 hidden sm:inline">|</span>
              <span className="opacity-80">João acabou de comprar</span>
              <span className="opacity-50 hidden sm:inline">|</span>
              <span className="text-red-500 uppercase tracking-wider bg-red-500/10 px-2 py-1 rounded">últimas vagas liberadas</span>
            </div>
          </div>
        </div>

        {/* CTA Packages Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block mb-4 px-6 py-2 bg-red-500/10 border border-red-500/30 rounded-full animate-pulse">
            <span className="text-red-500 font-bold flex items-center gap-2 uppercase tracking-wide">
              <Zap className="w-5 h-5" />
              ACESSOS LIMITADOS NESTE LOTE
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold mb-4">
            GARANTA SEU <span className="text-red-500">ACESSO VIP</span>
          </h2>
          <p className="text-xl md:text-2xl opacity-80 max-w-2xl mx-auto font-medium">
            Seja rápido. O que tá lá dentro você não encontra em nenhum outro lugar.
          </p>
        </div>

        <div className="space-y-16 max-w-7xl mx-auto">
          {(!products || products.length === 0 ? [
            {
              id: 1,
              name: "PACK PRIVADO VIP",
              description: "Acesso vitalício ao maior vazamento da internet.",
              priceInCents: 1499,
              originalPriceInCents: 2990,
              features: "[]",
              imageUrl: "",
              isFeatured: true
            }
          ] : products).map((product, index) => {
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
                      <div className="text-muted-foreground line-through text-xl mb-1">
                        R$ 29,90
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold text-accent">
                          R$ 8,90
                        </span>
                        <span className="text-muted-foreground">à vista</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-3 mb-8">
                      {[
                        "PACK PRIVADO COMPLETO",
                        "+100 fotos sem censura",
                        "vídeos íntimos gravados no privado",
                        "conteúdos que ela apaga depois",
                        "atualizações escondidas"
                      ].map((feature: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                          <span className="text-white font-bold text-lg">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <Button
                      onClick={() => handleQuickCheckout(product.id)}
                      disabled={processingId === product.id}
                      className="w-full bg-green-600 hover:bg-green-500 text-white flex flex-col items-center py-8 sm:py-10 rounded-xl group relative overflow-hidden transition-all hover:scale-105 shadow-[0_0_30px_rgba(22,163,74,0.3)]"
                    >
                      {processingId === product.id ? (
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-white" />
                      ) : (
                        <>
                          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                          <span className="text-xl sm:text-3xl font-black uppercase tracking-tight flex items-center gap-2">
                            <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform">🔓</span> LIBERAR ACESSO AGORA
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-green-100 mt-1 sm:mt-2 tracking-wide opacity-90">
                            (ver conteúdo privado da Vanessa)
                          </span>
                        </>
                      )}
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

        {/* Gatilho Sujo & Bloco de Pressão (Fechamento) */}
        <div className="pt-20 text-center space-y-6 max-w-3xl mx-auto animate-fade-in">
          <p className="text-gray-400 text-lg md:text-xl leading-relaxed italic">
            "A maioria entra por curiosidade... mas depois volta porque não encontra isso em lugar nenhum."
          </p>
          <div className="h-px w-20 bg-red-500/50 mx-auto"></div>
          <p className="text-gray-300 text-xl font-medium">
            Se você sair dessa página... <strong className="text-red-500 font-bold">provavelmente não vai achar isso de novo.</strong> Decide agora.
          </p>
          <p className="text-white font-black text-2xl pt-4">
            Você já chegou até aqui.<br/>Agora é só clicar ali em cima e ver com seus próprios olhos.
          </p>
        </div>
      </div>
    </section>
  );
}
