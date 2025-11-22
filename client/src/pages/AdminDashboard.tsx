import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Edit, Trash2, LogOut } from "lucide-react";

interface Model {
  id: number;
  name: string;
  slug: string;
  primaryColor: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    loadModels();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/admin/me", {
        credentials: "include", // Include cookies
      });
      if (!response.ok) {
        console.log("Auth failed, redirecting to login");
        setLocation("/admin/login");
      } else {
        const data = await response.json();
        console.log("Authenticated as:", data.username);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setLocation("/admin/login");
    }
  };

  const loadModels = async () => {
    try {
      const response = await fetch("/api/admin/models");
      if (response.ok) {
        const data = await response.json();
        setModels(data);
      }
    } catch (error) {
      toast.error("Erro ao carregar modelos");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      toast.success("Logout realizado");
      setLocation("/admin/login");
    } catch (error) {
      toast.error("Erro ao fazer logout");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este modelo?")) return;

    try {
      const response = await fetch(`/api/admin/models/${id}`, { method: "DELETE" });
      if (response.ok) {
        toast.success("Modelo excluído");
        loadModels();
      } else {
        toast.error("Erro ao excluir modelo");
      }
    } catch (error) {
      toast.error("Erro ao excluir modelo");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Painel Admin</h1>
            <p className="text-gray-400 mt-1">Gerenciar modelos e páginas</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setLocation("/admin/order-bumps")} variant="outline" className="gap-2">
              Order Bumps
            </Button>
            <Button onClick={() => setLocation("/admin/products")} variant="outline" className="gap-2">
              Gerenciar Pacotes
            </Button>
            <Button onClick={() => setLocation("/admin/models/new")} className="gap-2">
              <Plus className="w-4 h-4" />
              Nova Modelo
            </Button>
            <Button onClick={handleLogout} variant="outline" className="gap-2">
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Modelos Cadastradas</CardTitle>
            <CardDescription>Gerencie as páginas de modelos do site</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-gray-500 py-8">Carregando...</p>
            ) : models.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Nenhuma modelo cadastrada ainda</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Cor Principal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {models.map((model) => (
                    <TableRow key={model.id}>
                      <TableCell className="font-medium">{model.name}</TableCell>
                      <TableCell>
                        <code className="text-sm">/modelo/{model.slug}</code>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: model.primaryColor }}
                          />
                          <span className="text-sm text-gray-600">{model.primaryColor}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            model.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {model.isActive ? "Ativa" : "Inativa"}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(model.createdAt).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setLocation(`/admin/models/edit/${model.id}`)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(model.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
