import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ExternalLink, Package } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "wouter";

interface SuccessData {
  productName: string;
  productAccessLink: string | null;
  orderBumpName: string | null;
  orderBumpAccessLink: string | null;
  hasOrderBump: boolean;
}

export default function Success() {
  const params = useParams<{ orderNumber?: string }>();
  const [data, setData] = useState<SuccessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.orderNumber) {
      loadSuccessData();
    } else {
      setError("Número do pedido não fornecido");
      setLoading(false);
    }
  }, [params.orderNumber]);

  const loadSuccessData = async () => {
    try {
      const response = await fetch(`/api/orders/success/${params.orderNumber}`);
      if (response.ok) {
        const successData = await response.json();
        setData(successData);
      }
    } catch (error) {
      console.error("Error loading success data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black flex items-center justify-center">
        <Card className="bg-black/40 border-purple-500/30 max-w-md">
          <CardHeader>
            <CardTitle className="text-white">Pedido não encontrado</CardTitle>
            <CardDescription className="text-gray-400">
              Não foi possível carregar os dados do seu pedido.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black flex items-center justify-center p-4">
      <Card className="bg-black/40 border-purple-500/30 max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
            <Check className="w-8 h-8 text-green-500" />
          </div>
          <CardTitle className="text-3xl text-white">
            🎉 Compra Realizada com Sucesso!
          </CardTitle>
          <CardDescription className="text-gray-300 text-lg mt-2">
            Obrigado pela sua compra! Acesse seu conteúdo exclusivo abaixo.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Botão do Pacote Principal */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-400" />
              Seu Pacote
            </h3>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <p className="text-white font-medium mb-3">{data.productName}</p>
              {data.productAccessLink ? (
                <Button
                  onClick={() => window.open(data.productAccessLink!, "_blank")}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Acessar Conteúdo do Pacote
                </Button>
              ) : (
                <p className="text-gray-400 text-sm">
                  O link de acesso será enviado em breve para seu e-mail.
                </p>
              )}
            </div>
          </div>

          {/* Botão do Order Bump (se houver) */}
          {data.hasOrderBump && data.orderBumpName && (
            <div className="space-y-3">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Package className="w-5 h-5 text-pink-400" />
                Bônus Adicional
              </h3>
              <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-4">
                <p className="text-white font-medium mb-3">{data.orderBumpName}</p>
                {data.orderBumpAccessLink ? (
                  <Button
                    onClick={() => window.open(data.orderBumpAccessLink!, "_blank")}
                    className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Acessar Conteúdo do Bônus
                  </Button>
                ) : (
                  <p className="text-gray-400 text-sm">
                    O link de acesso será enviado em breve para seu e-mail.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Informações Adicionais */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-300 text-sm">
              <strong>💡 Dica:</strong> Salve esses links em um lugar seguro para acessar seu conteúdo sempre que quiser!
            </p>
          </div>

          {/* Informações de Suporte */}
          <div className="text-center text-gray-400 text-sm">
            <p>Pedido: #{params.orderNumber}</p>
            <p className="mt-2">
              Em caso de dúvidas, entre em contato conosco.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
