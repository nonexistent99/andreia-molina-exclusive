import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

interface OrderBumpForm {
  name: string;
  description: string;
  priceInCents: number;
  originalPriceInCents: number | null;
  imageUrl: string | null;
  accessLink: string | null;
  deliveryDescription: string | null;
  modelId: number | null;
  isActive: boolean;
  displayOrder: number;
}

export default function OrderBumpFormPage() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<OrderBumpForm>({
    name: "",
    description: "",
    priceInCents: 0,
    originalPriceInCents: null,
    imageUrl: null,
    accessLink: null,
    deliveryDescription: null,
    modelId: null,
    isActive: true,
    displayOrder: 0,
  });

  const isEdit = !!params.id;

  useEffect(() => {
    if (isEdit) {
      loadOrderBump();
    }
  }, [params.id]);

  const loadOrderBump = async () => {
    try {
      const response = await fetch(`/api/admin/order-bumps/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setForm({
          name: data.name,
          description: data.description,
          priceInCents: data.priceInCents,
          originalPriceInCents: data.originalPriceInCents,
          imageUrl: data.imageUrl,
          accessLink: data.accessLink || null,
          deliveryDescription: data.deliveryDescription || null,
          modelId: data.modelId,
          isActive: data.isActive,
          displayOrder: data.displayOrder,
        });
      } else {
        toast.error("Erro ao carregar order bump");
        setLocation("/admin/order-bumps");
      }
    } catch (error) {
      toast.error("Erro ao carregar order bump");
      setLocation("/admin/order-bumps");
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.description || form.priceInCents <= 0) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);
    try {
      const url = isEdit
        ? `/api/admin/order-bumps/${params.id}`
        : "/api/admin/order-bumps";
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        toast.success(isEdit ? "Order bump atualizado" : "Order bump criado");
        setLocation("/admin/order-bumps");
      } else {
        toast.error("Erro ao salvar order bump");
      }
    } catch (error) {
      toast.error("Erro ao salvar order bump");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/admin/order-bumps")}
            className="gap-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold text-white">
            {isEdit ? "Editar Order Bump" : "Novo Order Bump"}
          </h1>
          <p className="text-gray-400 mt-1">
            {isEdit ? "Atualize as informações do order bump" : "Crie uma nova oferta adicional"}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="bg-black/40 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">Informações do Order Bump</CardTitle>
              <CardDescription className="text-gray-400">
                Configure a oferta adicional que será exibida no checkout
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">
                  Nome do Order Bump *
                </Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ex: Pacote Bônus Especial"
                  className="bg-black/20 border-purple-500/30 text-white"
                />
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">
                  Descrição *
                </Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Descreva o que está incluído nesta oferta"
                  rows={4}
                  className="bg-black/20 border-purple-500/30 text-white"
                />
              </div>

              {/* Preços */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-white">
                    Preço (R$) *
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={(form.priceInCents / 100).toFixed(2)}
                    onChange={(e) =>
                      setForm({ ...form, priceInCents: Math.round(parseFloat(e.target.value) * 100) })
                    }
                    placeholder="49.00"
                    className="bg-black/20 border-purple-500/30 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="originalPrice" className="text-white">
                    Preço Original (R$)
                  </Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    step="0.01"
                    value={form.originalPriceInCents ? (form.originalPriceInCents / 100).toFixed(2) : ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        originalPriceInCents: e.target.value
                          ? Math.round(parseFloat(e.target.value) * 100)
                          : null,
                      })
                    }
                    placeholder="99.00"
                    className="bg-black/20 border-purple-500/30 text-white"
                  />
                  <p className="text-xs text-gray-500">Para mostrar desconto</p>
                </div>
              </div>

              {/* Imagem */}
              <div className="space-y-2">
                <Label htmlFor="imageUrl" className="text-white">
                  URL da Imagem do Order Bump
                </Label>
                {form.imageUrl && (
                  <div className="mb-4">
                    <img
                      src={form.imageUrl}
                      alt="Preview"
                      className="w-full max-w-xs rounded-lg border border-purple-500/30"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <Input
                  id="imageUrl"
                  type="url"
                  value={form.imageUrl || ""}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://exemplo.com/imagem.jpg"
                  className="bg-black/20 border-purple-500/30 text-white"
                />
                <p className="text-xs text-gray-500">Cole a URL da imagem do order bump</p>
              </div>

              {/* Link de Acesso */}
              <div className="space-y-2">
                <Label htmlFor="accessLink" className="text-white">
                  Link de Acesso ao Conteúdo
                </Label>
                <Input
                  id="accessLink"
                  type="url"
                  value={form.accessLink || ""}
                  onChange={(e) => setForm({ ...form, accessLink: e.target.value })}
                  placeholder="https://drive.google.com/..."
                  className="bg-black/20 border-purple-500/30 text-white"
                />
                <p className="text-xs text-gray-500">Link que será enviado ao comprador após a compra</p>
              </div>

              {/* Descrição do que será entregue */}
              <div className="space-y-2">
                <Label htmlFor="deliveryDescription" className="text-white">
                  Descrição do que será Entregue
                </Label>
                <Textarea
                  id="deliveryDescription"
                  value={form.deliveryDescription || ""}
                  onChange={(e) => setForm({ ...form, deliveryDescription: e.target.value })}
                  placeholder="Ex: 10 fotos extras em alta resolução, 2 vídeos exclusivos..."
                  className="bg-black/20 border-purple-500/30 text-white min-h-[100px]"
                />
                <p className="text-xs text-gray-500">Descreva o que o comprador receberá neste order bump</p>
              </div>

              {/* Switches */}
              <div className="space-y-4 pt-4 border-t border-purple-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="isActive" className="text-white">
                      Order Bump Ativo
                    </Label>
                    <p className="text-sm text-gray-500">Exibir no checkout</p>
                  </div>
                  <Switch
                    id="isActive"
                    checked={form.isActive}
                    onCheckedChange={(checked) => setForm({ ...form, isActive: checked })}
                  />
                </div>
              </div>

              {/* Botões */}
              <div className="flex gap-4 pt-6">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Salvando..." : isEdit ? "Atualizar Order Bump" : "Criar Order Bump"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/admin/order-bumps")}
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
