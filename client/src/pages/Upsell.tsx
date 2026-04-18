import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useLocation, useParams } from "wouter";
import { useState } from "react";
import { Loader2, AlertCircle, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

export default function Upsell() {
  const params = useParams<{ orderNumber: string }>();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const orderNumber = params.orderNumber || "";

  const createUpsellMutation = trpc.orders.createUpsell.useMutation();

  const handleAuthorize = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    try {
      const result = await createUpsellMutation.mutateAsync({ parentOrderNumber: orderNumber });
      
      toast.success("Gerando taxa de autorização...");
      // Reutiliza a página de pagamentos para lidar com o PIX
      setLocation(`/payment/${result.order.orderNumber}?parent=${orderNumber}`);
    } catch (error) {
      setIsProcessing(false);
      toast.error("Erro ao processar. Tente novamente.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-xl w-full space-y-8 animate-fade-in">
        
        {/* Header Bloqueio */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-600/20 text-red-500 mb-2 animate-pulse">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase text-red-500 uppercase tracking-tight">
            Acesso Retido
          </h1>
          <p className="text-xl md:text-2xl font-bold text-gray-300">
            Aguardando Autorização de Dispositivo
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-white/5 border border-red-500/30 p-6 md:p-8 rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.1)] space-y-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-8 h-8 text-yellow-500 flex-shrink-0 mt-1" />
            <div>
              <p className="text-lg text-gray-200 leading-relaxed font-medium">
                Seu pagamento principal foi aprovado, mas detectamos que este é o seu <strong>primeiro acesso</strong> a esse conteúdo VIP exclusivo de nosso app.
              </p>
            </div>
          </div>
          <div className="h-px w-full bg-white/10" />
          <p className="text-gray-300">
            Para evitar vazamentos e proteger o conteúdo privado da Vanessa, exigimos uma taxa única obrigatória para o registro do seu IP e dispositivo.
          </p>
          <div className="bg-black/50 p-4 rounded-xl border border-white/5 flex justify-between items-center">
            <span className="font-semibold text-gray-400 uppercase tracking-widest text-sm">Taxa Obrigatória</span>
            <span className="text-3xl font-black text-white">R$ 4,90</span>
          </div>
        </div>

        {/* CTA */}
        <div className="space-y-4 pt-4">
          <Button
            onClick={handleAuthorize}
            disabled={isProcessing}
            className="w-full bg-red-600 hover:bg-red-500 text-white flex flex-col items-center py-8 rounded-xl relative overflow-hidden transition-all hover:scale-105"
          >
            {isProcessing ? (
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-white" />
            ) : (
              <>
                <span className="text-xl md:text-2xl font-black uppercase tracking-wide">
                  PAGAR TAXA E LIBERAR O PACK
                </span>
                <span className="text-sm font-bold text-red-100 mt-1 opacity-90">
                  (Seu link será enviado instantaneamente)
                </span>
              </>
            )}
          </Button>
          
          <p className="text-center text-gray-500 text-xs uppercase font-semibold">
            Ao sair da página sem concluir, seu acesso principal atual será bloqueado por segurança.
          </p>
        </div>

      </div>
    </div>
  );
}
