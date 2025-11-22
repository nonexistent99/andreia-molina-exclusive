import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Edit, Trash2, ArrowLeft } from "lucide-react";

interface OrderBump {
  id: number;
  name: string;
  description: string;
  priceInCents: number;
  originalPriceInCents: number | null;
  imageUrl: string | null;
  modelId: number | null;
  isActive: boolean;
  displayOrder: number;
}

export default function OrderBumpsPage() {
  const [, setLocation] = useLocation();
  const [orderBumps, setOrderBumps] = useState<OrderBump[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrderBumps();
  }, []);

  const loadOrderBumps = async () => {
    try {
      const response = await fetch("/api/admin/order-bumps");
      if (response.ok) {
        const data = await response.json();
        setOrderBumps(data);
      } else {
        toast.error("Erro ao carregar order bumps");
      }
    } catch (error) {
      toast.error("Erro ao carregar order bumps");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este order bump?")) return;

    try {
      const response = await fetch(`/api/admin/order-bumps/${id}`, { method: "DELETE" });
      if (response.ok) {
        toast.success("Order bump excluído");
        loadOrderBumps();
      } else {
        toast.error("Erro ao excluir order bump");
      }
    } catch (error) {
      toast.error("Erro ao excluir order bump");
    }
  };

  const formatPrice = (cents: number) => {
    return `R$ ${(cents / 100).toFixed(2).replace(".", ",")}`;
  };

  const calculateDiscount = (original: number | null, current: number) => {
    if (!original || original <= current) return null;
    return Math.round(((original - current) / original) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/admin/dashboard")}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
            </div>
            <h1 className="text-3xl font-bold text-white">Gerenciar Order Bumps</h1>
            <p className="text-gray-400 mt-1">Ofertas adicionais exibidas no checkout</p>
          </div>
          <Button onClick={() => setLocation("/admin/order-bumps/new")} className="gap-2">
            <Plus className="w-4 h-4" />
            Novo Order Bump
          </Button>
        </div>

        <Card className="bg-black/40 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white">Order Bumps Cadastrados</CardTitle>
            <CardDescription className="text-gray-400">
              {orderBumps.length} {orderBumps.length === 1 ? "order bump cadastrado" : "order bumps cadastrados"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-400">Carregando...</div>
            ) : orderBumps.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 mb-4">Nenhum order bump cadastrado</p>
                <Button onClick={() => setLocation("/admin/order-bumps/new")} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Criar Primeiro Order Bump
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-purple-500/20">
                    <TableHead className="text-gray-400">Imagem</TableHead>
                    <TableHead className="text-gray-400">Nome</TableHead>
                    <TableHead className="text-gray-400">Preço</TableHead>
                    <TableHead className="text-gray-400">Modelo</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400 text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderBumps.map((bump) => {
                    const discount = calculateDiscount(bump.originalPriceInCents, bump.priceInCents);
                    return (
                      <TableRow key={bump.id} className="border-purple-500/20">
                        <TableCell>
                          {bump.imageUrl ? (
                            <img
                              src={bump.imageUrl}
                              alt={bump.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-800 rounded flex items-center justify-center text-gray-500 text-xs">
                              Sem imagem
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-white">{bump.name}</p>
                            <p className="text-sm text-gray-400 line-clamp-1">{bump.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-semibold text-white">{formatPrice(bump.priceInCents)}</p>
                            {bump.originalPriceInCents && (
                              <div className="flex items-center gap-2">
                                <p className="text-sm text-gray-500 line-through">
                                  {formatPrice(bump.originalPriceInCents)}
                                </p>
                                {discount && (
                                  <Badge variant="destructive" className="text-xs">
                                    {discount}% OFF
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-gray-400">
                            {bump.modelId ? `Modelo #${bump.modelId}` : "Global"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={bump.isActive ? "default" : "secondary"}>
                            {bump.isActive ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setLocation(`/admin/order-bumps/edit/${bump.id}`)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(bump.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
