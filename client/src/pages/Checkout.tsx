
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useLocation, useParams } from "wouter";
import { useState } from "react";
import { ArrowLeft, Check, CreditCard, Lock, Shield } from "lucide-react";
import { toast } from "sonner";

export default function Checkout() {
  const params = useParams<{ productId: string }>();
  const [, setLocation] = useLocation();
  const productId = parseInt(params.productId || "0");

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerDocument: "",
  });
  const [selectedOrderBumps, setSelectedOrderBumps] = useState<number[]>([]);

  const { data: product, isLoading } = trpc.products.getById.useQuery({ id: productId });
  const { data: orderBumps } = trpc.products.getOrderBumps.useQuery(
    { productId },
    { enabled: !!productId }
  );
  const createOrderMutation = trpc.orders.create.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customerName) {
      toast.error("Por favor, preencha o nome completo");
      return;
    }

    try {
      const result = await createOrderMutation.mutateAsync({
        productId,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone || undefined,
        customerDocument: formData.customerDocument.replace(/\D/g, ''),
        orderBumpId: selectedOrderBumps.length > 0 ? selectedOrderBumps[0] : undefined,
      });

      toast.success("Pedido criado com sucesso!");
      setLocation(`/payment/${result.order.orderNumber}`);
    } catch (error) {
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
          {/* Checkout Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Finalizar Compra</CardTitle>
                <CardDescription>
                  Preencha seus dados para continuar com o pagamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      placeholder="Seu nome completo"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email (opcional)</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      O link de download será enviado para este email
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone (opcional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(00) 00000-0000"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="document">CPF *</Label>
                    <Input
                      id="document"
                      placeholder="000.000.000-00"
                      value={formData.customerDocument}
                      onChange={(e) => {
                        // Remove tudo que não é número
                        const value = e.target.value.replace(/\D/g, '');
                        // Limita a 11 dígitos
                        const limited = value.slice(0, 11);
                        // Aplica máscara
                        let formatted = limited;
                        if (limited.length > 9) {
                          formatted = limited.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
                        } else if (limited.length > 6) {
                          formatted = limited.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
                        } else if (limited.length > 3) {
                          formatted = limited.replace(/(\d{3})(\d{1,3})/, '$1.$2');
                        }
                        setFormData({ ...formData, customerDocument: formatted });
                      }}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Necessário para gerar o PIX
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-luxury hover:opacity-90 text-lg py-6"
                    disabled={createOrderMutation.isPending}
                  >
                    {createOrderMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        Ir para Pagamento
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Order Bumps (Múltiplos) */}
            {orderBumps && orderBumps.length > 0 && (
              <div className="space-y-4">
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

            {/* Security Badges */}
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Pagamento 100% Seguro</p>
                      <p className="text-sm text-muted-foreground">Criptografia de ponta a ponta</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Lock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Seus Dados Protegidos</p>
                      <p className="text-sm text-muted-foreground">Privacidade garantida</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Acesso Imediato</p>
                      <p className="text-sm text-muted-foreground">Receba o link após o pagamento</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Summary */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}
                <div>
                  <h3 className="font-bold text-xl mb-2">{product.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{product.description}</p>
                  
                  {features.length > 0 && (
                    <div className="space-y-2 mb-4">
                      <p className="font-semibold text-sm">O que está incluído:</p>
                      <ul className="space-y-1">
                        {features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">
                      R$ {(product.priceInCents / 100).toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                  
                  {selectedOrderBumps.length > 0 && orderBumps && (
                    <>
                      {orderBumps.filter(ob => selectedOrderBumps.includes(ob.id)).map((orderBump) => (
                        <div key={orderBump.id} className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">{orderBump.name}</span>
                          <span className="font-semibold">
                            R$ {(orderBump.priceInCents / 100).toFixed(2).replace(".", ",")}
                          </span>
                        </div>
                      ))}
                    </>
                  )}

                  {discount > 0 && (
                    <div className="flex justify-between items-center text-sm text-green-600">
                      <span>Desconto ({discount}%)</span>
                      <span>
                        - R$ {((product.originalPriceInCents! - product.priceInCents) / 100).toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">
                      R$ {(
                        (product.priceInCents + 
                        (orderBumps?.filter(ob => selectedOrderBumps.includes(ob.id)).reduce((sum, ob) => sum + ob.priceInCents, 0) || 0)) / 100
                      ).toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                </div>

                {product.originalPriceInCents && (
                  <div className="bg-primary/10 rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Preço original</p>
                    <p className="text-lg line-through text-muted-foreground">
                      R$ {(product.originalPriceInCents / 100).toFixed(2).replace(".", ",")}
                    </p>
                    <Badge variant="default" className="mt-2 bg-primary">
                      Economize {discount}%
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
