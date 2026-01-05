
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useLocation, useParams } from "wouter";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Dados fixos para preenchimento automático
const FIXED_CUSTOMER_DATA = {
  customerName: "Hiury Samuel Brandão Costa",
  customerEmail: "slaoq999111999@gmail.com",
  customerPhone: "38999493695",
  customerDocument: "50958347824",
};

export default function Checkout() {
  const params = useParams<{ productId: string }>();
  const [, setLocation] = useLocation();
  const productId = parseInt(params.productId || "0");

  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedOrderBumps, setSelectedOrderBumps] = useState<number[]>([]);

  const { data: product, isLoading } = trpc.products.getById.useQuery({ id: productId });
  const { data: orderBumps } = trpc.products.getOrderBumps.useQuery(
    { productId },
    { enabled: !!productId }
  );
  const createOrderMutation = trpc.orders.create.useMutation();

  // Efeito para criar pedido automaticamente quando a página carrega
  useEffect(() => {
    if (product && !isProcessing) {
      handleAutoCreateOrder();
    }
  }, [product]);

  const handleAutoCreateOrder = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const result = await createOrderMutation.mutateAsync({
        productId,
        customerName: FIXED_CUSTOMER_DATA.customerName,
        customerEmail: FIXED_CUSTOMER_DATA.customerEmail,
        customerPhone: FIXED_CUSTOMER_DATA.customerPhone,
        customerDocument: FIXED_CUSTOMER_DATA.customerDocument,
        orderBumpIds: selectedOrderBumps,
      });

      toast.success("Pedido criado com sucesso!");
      setLocation(`/payment/${result.order.orderNumber}`);
    } catch (error) {
      setIsProcessing(false);
      toast.error("Erro ao criar pedido. Tente novamente.");
      console.error(error);
    }
  };

  const toggleOrderBump = (orderBumpId: number) => {
    setSelectedOrderBumps(prev =>
      prev.includes(orderBumpId)
        ? prev.filter(id => id !== orderBumpId)
        : [...prev, orderBumpId]
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Produto não encontrado</CardTitle>
            <CardDescription>O produto que você está procurando não existe.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation("/")}>Voltar para Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const features = JSON.parse(product.features as string) as string[];
  const discount = product.originalPriceInCents 
    ? Math.round((1 - product.priceInCents / product.originalPriceInCents) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
      <div className="container max-w-6xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-8"
          onClick={() => setLocation("/")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Processing Status */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Processando Compra</CardTitle>
                <CardDescription>
                  Preparando seu pedido para pagamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold mb-2">Criando seu pedido...</p>
                    <p className="text-muted-foreground text-sm">
                      Você será redirecionado para o pagamento em instantes
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Bumps (Múltiplos) */}
            {orderBumps && orderBumps.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold">Ofertas Especiais</h3>
                {orderBumps.filter(ob => ob.isActive).map((orderBump) => (
                  <Card key={orderBump.id} className="border-2 border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <input
                          type="checkbox"
                          id={`orderBump-${orderBump.id}`}
                          checked={selectedOrderBumps.includes(orderBump.id)}
                          onChange={() => toggleOrderBump(orderBump.id)}
                          className="w-5 h-5 mt-1 cursor-pointer"
                          disabled={isProcessing}
                        />
                        <label htmlFor={`orderBump-${orderBump.id}`} className="flex-1 cursor-pointer">
                          <div className="flex gap-4">
                            {orderBump.imageUrl && (
                              <img
                                src={orderBump.imageUrl}
                                alt={orderBump.name}
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                            )}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="default" className="bg-primary">Oferta Especial</Badge>
                                <span className="text-sm text-muted-foreground">Apenas hoje!</span>
                              </div>
                              <h4 className="font-bold text-lg mb-1">{orderBump.name}</h4>
                              <p className="text-sm text-muted-foreground mb-2">{orderBump.description}</p>
                              <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-primary">
                                  R$ {(orderBump.priceInCents / 100).toFixed(2).replace(".", ",")}
                                </span>
                                {orderBump.originalPriceInCents && (
                                  <span className="text-sm text-muted-foreground line-through">
                                    R$ {(orderBump.originalPriceInCents / 100).toFixed(2).replace(".", ",")}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </label>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Product Summary */}
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <div className="relative h-64 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                {product.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-primary/30 text-6xl">📦</div>
                )}
              </div>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                    <p className="text-muted-foreground">{product.description}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-gradient-luxury">
                        R$ {(product.priceInCents / 100).toFixed(2).replace(".", ",")}
                      </span>
                      {product.originalPriceInCents && (
                        <span className="text-lg text-muted-foreground line-through">
                          R$ {(product.originalPriceInCents / 100).toFixed(2).replace(".", ",")}
                        </span>
                      )}
                    </div>
                    {discount > 0 && (
                      <Badge className="bg-red-500/20 text-red-600">
                        Economize {discount}%
                      </Badge>
                    )}
                  </div>

                  {features && features.length > 0 && (
                    <div className="space-y-2 pt-4 border-t">
                      <p className="font-semibold text-sm">O que você vai receber:</p>
                      <ul className="space-y-2">
                        {features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <span className="text-primary">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
