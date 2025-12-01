import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function ProductFormPage() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const productId = params.id ? parseInt(params.id) : null;
  const isEdit = productId !== null;

  const [loading, setLoading] = useState(isEdit);
  const [features, setFeatures] = useState<string[]>([]);
  const [allOrderBumps, setAllOrderBumps] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priceInCents: "",
    originalPriceInCents: "",
    imageUrl: "",
    accessLink: "",
    orderBumpIds: [] as number[], // Corrigido para múltiplos Order Bumps
    isFeatured: false,
    isActive: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    loadOrderBumps();
    if (isEdit) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`);
      if (!response.ok) throw new Error("Failed to fetch product");
      
      const product = await response.json();
      setFormData({
        name: product.name,
        description: product.description,
        priceInCents: (product.priceInCents / 100).toFixed(2),
        originalPriceInCents: product.originalPriceInCents 
          ? (product.originalPriceInCents / 100).toFixed(2) 
          : "",
        imageUrl: product.imageUrl || "",
        accessLink: product.accessLink || "",
        orderBumpIds: product.orderBumpIds || [], // Corrigido para múltiplos Order Bumps
        isFeatured: product.isFeatured,
        isActive: product.isActive,
      });

      // Parse features from JSON string
      try {
        const parsedFeatures = JSON.parse(product.features);
        setFeatures(parsedFeatures.length > 0 ? parsedFeatures : [""]);
      } catch {
        setFeatures([""]);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Erro ao carregar pacote");
    } finally {
      setLoading(false);
    }
  };

  const loadOrderBumps = async () => {
    try {
      const response = await fetch("/api/admin/order-bumps", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setAllOrderBumps(data);
      }
    } catch (error) {
      console.error("Error loading order bumps:", error);
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const addFeature = () => {
    setFeatures([...features, ""]);
  };

  const removeFeature = (index: number) => {
    if (features.length === 1) return;
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    if (!formData.name || !formData.description || !formData.priceInCents) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    // Filter empty features
    const validFeatures = features.filter(f => f.trim() !== "");
    if (validFeatures.length === 0) {
      toast.error("Adicione pelo menos uma característica");
      return;
    }

    const payload = {
      name: formData.name,
      description: formData.description,
      priceInCents: Math.round(parseFloat(formData.priceInCents) * 100),
      originalPriceInCents: formData.originalPriceInCents 
        ? Math.round(parseFloat(formData.originalPriceInCents) * 100)
        : null,
      imageUrl: formData.imageUrl || null,
      accessLink: formData.accessLink || null, // Adicionado accessLink ao payload
      features: validFeatures,
      orderBumpIds: formData.orderBumpIds, // Corrigido para múltiplos Order Bumps
      isFeatured: formData.isFeatured,
      isActive: formData.isActive,
    };

    try {
      const url = isEdit 
        ? `/api/admin/products/${productId}` 
        : "/api/admin/products";
      
      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to save product");

      toast.success(isEdit ? "Pacote atualizado com sucesso" : "Pacote criado com sucesso");
      setLocation("/admin/products");
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Erro ao salvar pacote");
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-3xl">
      <Button
        variant="ghost"
        onClick={() => setLocation("/admin/products")}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? "Editar Pacote" : "Novo Pacote"}</CardTitle>
          <CardDescription>
            {isEdit 
              ? "Atualize as informações do pacote" 
              : "Crie um novo pacote de conteúdo"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Pacote *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Pacote Premium"
                required
              />
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descreva o que está incluído neste pacote"
                rows={3}
                required
              />
            </div>

            {/* Preços */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priceInCents">Preço Atual (R$) *</Label>
                <Input
                  id="priceInCents"
                  name="priceInCents"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.priceInCents}
                  onChange={handleChange}
                  placeholder="99.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="originalPriceInCents">Preço Original (R$)</Label>
                <Input
                  id="originalPriceInCents"
                  name="originalPriceInCents"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.originalPriceInCents}
                  onChange={handleChange}
                  placeholder="199.00"
                />
                <p className="text-xs text-muted-foreground">
                  Para mostrar desconto
                </p>
              </div>
            </div>

            {/* Imagem (URL) */}
            <div className="space-y-2">
              <Label htmlFor="imageUrl">URL da Imagem do Pacote</Label>
              <div className="flex gap-4 items-start">
                {formData.imageUrl && (
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://exemplo.com/sua-imagem.jpg"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Use uma URL para a imagem do pacote.
                  </p>
                </div>
              </div>
            </div>

            {/* Link de Acesso */}
            <div className="space-y-2">
              <Label htmlFor="accessLink">Link de Acesso ao Conteúdo</Label>
              <Input
                id="accessLink"
                name="accessLink"
                placeholder="https://drive.google.com/... ou https://t.me/..."
                value={formData.accessLink}
                onChange={handleChange}
              />
              <p className="text-xs text-muted-foreground">
                Link para onde o cliente será redirecionado após o pagamento confirmado
              </p>
            </div>

            {/* Features */}
            <div className="space-y-2">
              <Label>Características do Pacote *</Label>
              <div className="space-y-2">
                {features.map((feature, index ) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      placeholder="Ex: 50 fotos em alta resolução"
                    />
                    {features.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeFeature(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addFeature}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Característica
              </Button>
            </div>

            {/* Switches e Order Bumps */}
            <div className="space-y-4">
              {/* Order Bumps (Múltiplos) */}
              <div className="space-y-2">
                <Label>Order Bumps (opcional)</Label>
                <p className="text-sm text-muted-foreground">
                  Selecione os order bumps para exibir no checkout deste pacote
                </p>
                <div className="space-y-2">
                  {allOrderBumps.filter(ob => ob.isActive).map((orderBump) => (
                    <div key={orderBump.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`ob-${orderBump.id}`}
                        checked={formData.orderBumpIds.includes(orderBump.id)}
                        onChange={(e) => {
                          const id = orderBump.id;
                          setFormData(prev => ({
                            ...prev,
                            orderBumpIds: e.target.checked
                              ? [...prev.orderBumpIds, id]
                              : prev.orderBumpIds.filter(obId => obId !== id),
                          }));
                        }}
                        className="h-4 w-4 text-purple-600 border-gray-300 rounded"
                      />
                      <label htmlFor={`ob-${orderBump.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {orderBump.name} - R$ {(orderBump.priceInCents / 100).toFixed(2).replace(".", ",")}
                      </label>
                    </div>
                  ))}
                  {allOrderBumps.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      Nenhum order bump cadastrado. <a href="/admin/order-bumps/new" className="text-primary underline">Criar order bump</a>
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="featured">Marcar como Destaque</Label>
                  <p className="text-sm text-muted-foreground">
                    Exibe badge "Mais Vendido"
                  </p>
                </div>
                <Switch
                  id="featured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, isFeatured: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="active">Pacote Ativo</Label>
                  <p className="text-sm text-muted-foreground">
                    Desative para ocultar do site
                  </p>
                </div>
                <Switch
                  id="active"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, isActive: checked }))
                  }
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                {isEdit ? "Atualizar Pacote" : "Criar Pacote"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation("/admin/products")}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
