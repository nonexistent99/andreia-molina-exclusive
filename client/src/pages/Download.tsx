import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useParams } from "wouter";
import { AlertCircle, Check, Download as DownloadIcon, Lock } from "lucide-react";
import { toast } from "sonner";

export default function Download() {
  const params = useParams<{ token: string }>();
  const token = params.token || "";

  const { data: downloadLink, isLoading, error } = trpc.downloads.validate.useQuery({ token });
  const downloadMutation = trpc.downloads.download.useMutation();

  const handleDownload = async () => {
    try {
      const result = await downloadMutation.mutateAsync({ token });
      
      // Redirecionar para o arquivo
      window.location.href = result.downloadUrl;
      toast.success("Download iniciado!");
    } catch (error) {
      toast.error("Erro ao iniciar download. Tente novamente.");
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Validando link...</p>
        </div>
      </div>
    );
  }

  if (error || !downloadLink) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
        <Card className="max-w-md">
          <CardHeader>
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl text-center">Link Inválido</CardTitle>
            <CardDescription className="text-center">
              Este link de download não é válido, expirou ou já foi usado o número máximo de vezes.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Se você acredita que isso é um erro, entre em contato com nosso suporte.
            </p>
            <Button onClick={() => window.location.href = "/"}>
              Voltar para Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isExpired = new Date(downloadLink.expiresAt) < new Date();
  const downloadsRemaining = downloadLink.maxDownloads - downloadLink.downloadCount;
  const expirationDate = new Date(downloadLink.expiresAt).toLocaleDateString('pt-BR');

  if (isExpired || downloadsRemaining <= 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
        <Card className="max-w-md">
          <CardHeader>
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl text-center">Link Expirado</CardTitle>
            <CardDescription className="text-center">
              {isExpired 
                ? `Este link expirou em ${expirationDate}.`
                : "Você já atingiu o número máximo de downloads permitidos."
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Entre em contato com nosso suporte se precisar de um novo link.
            </p>
            <Button onClick={() => window.location.href = "/"}>
              Voltar para Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
      <div className="container max-w-3xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-luxury flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Seu Conteúdo <span className="text-gradient-luxury">Está Pronto!</span>
          </h1>
          <p className="text-muted-foreground">
            Clique no botão abaixo para fazer o download
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{downloadLink.product.name}</CardTitle>
            <CardDescription>{downloadLink.product.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Download Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg text-center">
                <p className="text-2xl font-bold text-primary">{downloadsRemaining}</p>
                <p className="text-sm text-muted-foreground">Downloads Restantes</p>
              </div>
              <div className="p-4 bg-muted rounded-lg text-center">
                <p className="text-2xl font-bold text-primary">{expirationDate}</p>
                <p className="text-sm text-muted-foreground">Expira em</p>
              </div>
            </div>

            {/* Download Button */}
            <Button
              className="w-full bg-gradient-luxury hover:opacity-90 text-lg py-6"
              onClick={handleDownload}
              disabled={downloadMutation.isPending}
            >
              {downloadMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Preparando Download...
                </>
              ) : (
                <>
                  <DownloadIcon className="w-5 h-5 mr-2" />
                  Baixar Agora
                </>
              )}
            </Button>

            {/* Instructions */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold">Instruções Importantes:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Salve o arquivo em um local seguro no seu dispositivo</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Você pode fazer até {downloadLink.maxDownloads} downloads com este link</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Este link expira em {expirationDate}</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                  <span>Não compartilhe este link com outras pessoas</span>
                </li>
              </ul>
            </div>

            {/* Warning */}
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold mb-1">Conteúdo Protegido</p>
                  <p className="text-muted-foreground">
                    Este conteúdo é exclusivo e protegido por direitos autorais. 
                    O compartilhamento ou distribuição não autorizada é proibido e pode resultar em ações legais.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Problemas com o download?
          </p>
          <a 
            href="mailto:suporte@andreiamolina.com" 
            className="text-primary hover:text-primary/80 font-semibold underline"
          >
            Entre em contato com o suporte
          </a>
        </div>
      </div>
    </div>
  );
}
