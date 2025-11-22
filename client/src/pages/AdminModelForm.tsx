import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function AdminModelForm() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const isEdit = !!params.id;

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    title: "",
    subtitle: "",
    description: "",
    primaryColor: "#FF0066",
    secondaryColor: "#9333EA",
    accentColor: "#FF0066",
    heroImageUrl: "",
    aboutImageUrl: "",
    instagramUrl: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<{productId: number, displayOrder: number}[]>([]);

  useEffect(() => {
    loadProducts();
    if (isEdit) {
      loadModel();
    }
  }, [params.id]);

  const loadProducts = async () => {
    try {
      const response = await fetch("/api/admin/products", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setAllProducts(data);
      }
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  const loadModel = async () => {
    try {
      const response = await fetch(`/api/admin/models/${params.id}`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setFormData(data);
        if (data.products && Array.isArray(data.products)) {
          setSelectedProducts(data.products.map((p: any) => ({
            productId: p.productId,
            displayOrder: p.displayOrder || 0
          })));
        }
      } else {
        toast.error("Erro ao carregar modelo");
        setLocation("/admin/dashboard");
      }
    } catch (error) {
      toast.error("Erro ao carregar modelo");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEdit ? `/api/admin/models/${params.id}` : "/api/admin/models";
      const method = isEdit ? "PUT" : "POST";

      const payload = {
        ...formData,
        products: selectedProducts,
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (response.ok) {
        toast.success(isEdit ? "Modelo atualizado!" : "Modelo criado!");
        setLocation("/admin/dashboard");
      } else {
        const data = await response.json();
        toast.error(data.error || "Erro ao salvar modelo");
      }
    } catch (error) {
      toast.error("Erro ao salvar modelo");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    handleChange("name", name);
    if (!isEdit) {
      const slug = name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      handleChange("slug", slug);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black p-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          className="mb-4 text-white"
          onClick={() => setLocation("/admin/dashboard")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>{isEdit ? "Editar Modelo" : "Criar Novo Modelo"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Informações Básicas</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome da Modelo *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="Ex: Andreia Molina"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug (URL) *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => handleChange("slug", e.target.value)}
                      placeholder="Ex: andreia-molina"
                      required
                      disabled={isEdit}
                    />
                    <p className="text-xs text-muted-foreground">
                      URL: /modelo/{formData.slug || "..."}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Título Hero *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder="Ex: Conteúdo Exclusivo"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtítulo Hero</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle || ""}
                    onChange={(e) => handleChange("subtitle", e.target.value)}
                    placeholder="Ex: Acesse pacotes premium com fotos e vídeos..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição (Sobre)</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ""}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Texto da seção 'Sobre'..."
                    rows={4}
                  />
                </div>
              </div>

              {/* Colors */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Cores do Tema</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Cor Primária</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={formData.primaryColor}
                        onChange={(e) => handleChange("primaryColor", e.target.value)}
                        className="w-20 h-10"
                      />
                      <Input
                        type="text"
                        value={formData.primaryColor}
                        onChange={(e) => handleChange("primaryColor", e.target.value)}
                        placeholder="#FF0066"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">Cor Secundária</Label>
                    <div className="flex gap-2">
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={formData.secondaryColor}
                        onChange={(e) => handleChange("secondaryColor", e.target.value)}
                        className="w-20 h-10"
                      />
                      <Input
                        type="text"
                        value={formData.secondaryColor}
                        onChange={(e) => handleChange("secondaryColor", e.target.value)}
                        placeholder="#9333EA"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accentColor">Cor de Destaque</Label>
                    <div className="flex gap-2">
                      <Input
                        id="accentColor"
                        type="color"
                        value={formData.accentColor}
                        onChange={(e) => handleChange("accentColor", e.target.value)}
                        className="w-20 h-10"
                      />
                      <Input
                        type="text"
                        value={formData.accentColor}
                        onChange={(e) => handleChange("accentColor", e.target.value)}
                        placeholder="#FF0066"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Imagens</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="heroImageUrl">URL da Imagem Hero</Label>
                  <Input
                    id="heroImageUrl"
                    type="url"
                    value={formData.heroImageUrl || ""}
                    onChange={(e) => handleChange("heroImageUrl", e.target.value)}
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aboutImageUrl">URL da Imagem Sobre</Label>
                  <Input
                    id="aboutImageUrl"
                    type="url"
                    value={formData.aboutImageUrl || ""}
                    onChange={(e) => handleChange("aboutImageUrl", e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Redes Sociais</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="instagramUrl">Link do Instagram</Label>
                  <Input
                    id="instagramUrl"
                    type="url"
                    value={formData.instagramUrl || ""}
                    onChange={(e) => handleChange("instagramUrl", e.target.value)}
                    placeholder="https://instagram.com/..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Este link será exibido no footer da página da modelo
                  </p>
                </div>
              </div>

              {/* Pacotes */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Pacotes Disponíveis</h3>
                <p className="text-sm text-muted-foreground">
                  Selecione quais pacotes aparecerão na página desta modelo
                </p>
                
                <div className="space-y-2">
                  {allProducts.map((product) => {
                    const isSelected = selectedProducts.some(sp => sp.productId === product.id);
                    return (
                      <div key={product.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                        <input
                          type="checkbox"
                          id={`product-${product.id}`}
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProducts([...selectedProducts, {
                                productId: product.id,
                                displayOrder: selectedProducts.length
                              }]);
                            } else {
                              setSelectedProducts(selectedProducts.filter(sp => sp.productId !== product.id));
                            }
                          }}
                          className="w-4 h-4"
                        />
                        <Label htmlFor={`product-${product.id}`} className="flex-1 cursor-pointer">
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              R$ {(product.priceInCents / 100).toFixed(2).replace(".", ",")}
                            </p>
                          </div>
                        </Label>
                      </div>
                    );
                  })}
                  {allProducts.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Nenhum pacote cadastrado. <a href="/admin/products/new" className="text-primary underline">Criar pacote</a>
                    </p>
                  )}
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => handleChange("isActive", e.target.checked)}
                  className="w-4 h-4"
                />
                <Label htmlFor="isActive">Modelo ativa (visível no site)</Label>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Salvando..." : isEdit ? "Atualizar Modelo" : "Criar Modelo"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/admin/dashboard")}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
