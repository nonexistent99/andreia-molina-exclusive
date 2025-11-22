import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useLocation, useParams } from "wouter";
import { useEffect, useState } from "react";
import { Check, Clock, Copy, QrCode, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function Payment() {
  const params = useParams<{ orderNumber: string }>();
  const [, setLocation] = useLocation();
  const orderNumber = params.orderNumber || "";

  const [pixData, setPixData] = useState<{
    pixCode: string;
    pixQrCode: string;
    expiresAt: Date;
  } | null>(null);

  const { data: order } = trpc.orders.getByNumber.useQuery({ orderNumber });
  const createPixChargeMutation = trpc.payment.createPixCharge.useMutation();
  const { data: paymentStatus, refetch: refetchStatus } = trpc.payment.checkStatus.useQuery(
    { orderNumber },
    {
      refetchInterval: order?.status === "pending" ? 5000 : false, // Poll a cada 5 segundos se pendente
    }
  );

  useEffect(() => {
    if (order && !pixData && order.status === "pending") {
      handleCreatePixCharge();
    }
  }, [order]);

  useEffect(() => {
    if (paymentStatus?.status === "paid") {
      toast.success("Pagamento confirmado!");
      setTimeout(() => {
        setLocation("/success");
      }, 2000);
    }
  }, [paymentStatus]);

  const handleCreatePixCharge = async () => {
    try {
      const result = await createPixChargeMutation.mutateAsync({ orderNumber });
      setPixData({
        pixCode: result.pixCode,
        pixQrCode: result.pixQrCode,
        expiresAt: new Date(result.expiresAt),
      });
    } catch (error) {
      toast.error("Erro ao gerar código Pix. Tente novamente.");
      console.error(error);
    }
  };

  const copyPixCode = () => {
    if (pixData) {
      navigator.clipboard.writeText(pixData.pixCode);
      toast.success("Código Pix copiado!");
    }
  };

  const handleRefresh = () => {
    refetchStatus();
    toast.info("Verificando pagamento...");
  };

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando pedido...</p>
        </div>
      </div>
    );
  }

  if (order.status === "paid") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
        <Card className="max-w-md text-center">
          <CardHeader>
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Pagamento Confirmado!</CardTitle>
            <CardDescription>
              Você receberá o link de download por email em instantes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation("/")}>Voltar para Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const timeRemaining = pixData ? Math.max(0, Math.floor((pixData.expiresAt.getTime() - Date.now()) / 1000 / 60)) : 30;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
      <div className="container max-w-4xl">
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-gradient-luxury text-white border-0">
            <Clock className="w-4 h-4 mr-1" />
            {timeRemaining} minutos restantes
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Finalize Seu <span className="text-gradient-luxury">Pagamento</span>
          </h1>
          <p className="text-muted-foreground">
            Pedido: <strong>{order.orderNumber}</strong>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* QR Code Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                Pague com Pix
              </CardTitle>
              <CardDescription>
                Escaneie o QR Code ou copie o código para pagar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {createPixChargeMutation.isPending ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Gerando código Pix...</p>
                </div>
              ) : pixData ? (
                <>
                  {/* QR Code */}
                  <div className="bg-white p-6 rounded-lg flex items-center justify-center">
                    <img 
                      src={pixData.pixQrCode} 
                      alt="QR Code Pix"
                      className="w-64 h-64"
                    />
                  </div>

                  {/* Pix Code */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Código Pix (Copia e Cola)</label>
                    <div className="flex gap-2">
                      <div className="flex-1 p-3 bg-muted rounded-lg text-sm font-mono break-all">
                        {pixData.pixCode}
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={copyPixCode}
                        className="flex-shrink-0"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Refresh Button */}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleRefresh}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Verificar Pagamento
                  </Button>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">Erro ao gerar código Pix</p>
                  <Button onClick={handleCreatePixCharge}>
                    Tentar Novamente
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Instructions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Como Pagar</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  <li className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-semibold">Abra seu app de banco</p>
                      <p className="text-sm text-muted-foreground">
                        Acesse a área Pix do seu banco ou carteira digital
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-semibold">Escaneie o QR Code</p>
                      <p className="text-sm text-muted-foreground">
                        Ou copie e cole o código Pix
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-semibold">Confirme o pagamento</p>
                      <p className="text-sm text-muted-foreground">
                        Verifique o valor e confirme a transação
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
                      4
                    </div>
                    <div>
                      <p className="font-semibold">Receba seu conteúdo</p>
                      <p className="text-sm text-muted-foreground">
                        O link de download será enviado por email instantaneamente
                      </p>
                    </div>
                  </li>
                </ol>
              </CardContent>
            </Card>

            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Pagamento Instantâneo</p>
                      <p className="text-sm text-muted-foreground">
                        Confirmação em segundos via Pix
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">100% Seguro</p>
                      <p className="text-sm text-muted-foreground">
                        Transação protegida e criptografada
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Acesso Imediato</p>
                      <p className="text-sm text-muted-foreground">
                        Link de download enviado por email após confirmação
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
