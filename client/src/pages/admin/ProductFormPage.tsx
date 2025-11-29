import { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

export default function ProductFormPage() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const productId = params.id ? parseInt(params.id) : null;
  const isEdit = productId !== null;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(isEdit);
  const [uploading, setUploading] = useState(false);
const [features, setFeatures] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priceInCents: "",
    originalPriceInCents: "",
    imageUrl: "",
    accessLink: "",
    orderBumpId: null as number | null,
    isFeatured: false,
    isActive: true,
  });
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        orderBumpId: product.orderBumpId || null,
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Imagem muito grande. Máximo 10MB");
      return;
    }

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append("image", file);
    formDataUpload.append("type", "products");

    try {
      const response = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: formDataUpload,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      setFormData(prev => ({ ...prev, imageUrl: data.url }));
      toast.success("Imagem enviada com sucesso");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Erro ao enviar imagem");
    } finally {
      setUploading(false);
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
      features: validFeatures,
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
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Pacote Premium"
                required
              />
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva o que está incluído neste pacote"
                rows={3}
                required
              />
            </div>

            {/* Preços */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Preço Atual (R$) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.priceInCents}
                  onChange={(e) => setFormData(prev => ({ ...prev, priceInCents: e.target.value }))}
                  placeholder="99.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="originalPrice">Preço Original (R$)</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.originalPriceInCents}
                  onChange={(e) => setFormData(prev => ({ ...prev, originalPriceInCents: e.target.value }))}
                  placeholder="199.00"
                />
                <p className="text-xs text-muted-foreground">
                  Para mostrar desconto
                </p>
              </div>
            </div>

            {/* Imagem */}
            <div className="space-y-2">
              <Label>Imagem do Pacote</Label>
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
                  label="URL da Imagem do Pacote"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://exemplo.com/sua-imagem.jpg"
                  />

                  <p className="text-xs text-muted-foreground mt-2">
                    Máximo 10MB. Formatos: JPG, PNG, WEBP
                  </p>
                </div>
              </div>
            </div>

            {/* Link de Acesso */}
            <div className="space-y-2">
              <Label>Link de Acesso ao Conteúdo</Label>
              <Input
                placeholder="https://drive.google.com/... ou https://t.me/..."
                value={formData.accessLink}
                onChange={(e) => setFormData({ ...formData, accessLink: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Link para onde o cliente será redirecionado após o pagamento confirmado
              </p>
            </div>

            {/* Features */}
            <div className="space-y-2">
              <Label>Características do Pacote *</Label>
              <div className="space-y-2">
                {features.map((feature, index) => (
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

            {/* Switches */}
            <div className="space-y-4">
              {/* Order Bump */}
              <div className="space-y-2">
                <Label htmlFor="orderBumpId">Order Bump (opcional)</Label>
                <p className="text-sm text-muted-foreground">
                  Selecione um order bump para exibir no checkout deste pacote
                </p>
                <select
                  id="orderBumpId"
                  value={formData.orderBumpId || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, orderBumpId: e.target.value ? parseInt(e.target.value) : null }))}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Nenhum order bump</option>
                  {allOrderBumps.filter(ob => ob.isActive).map((orderBump) => (
                    <option key={orderBump.id} value={orderBump.id}>
                      {orderBump.name} - R$ {(orderBump.priceInCents / 100).toFixed(2).replace(".", ",")}
                    </option>
                  ))}
                </select>
                {allOrderBumps.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Nenhum order bump cadastrado. <a href="/admin/order-bumps/new" className="text-primary underline">Criar order bump</a>
                  </p>
                )}
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
