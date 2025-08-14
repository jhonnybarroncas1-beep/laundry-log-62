import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useData } from "@/hooks/useData";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, ShirtIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const ClothingTypeManagement = () => {
  const { clothingTypes, addClothingType, deleteClothingType } = useData();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [typeName, setTypeName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!typeName.trim()) {
      toast({
        title: "Erro",
        description: "Nome do tipo de roupa é obrigatório",
        variant: "destructive",
      });
      return;
    }

    addClothingType({ name: typeName.trim() });
    toast({
      title: "Sucesso",
      description: "Tipo de roupa criado com sucesso",
    });
    setTypeName('');
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteClothingType(id);
    toast({
      title: "Sucesso",
      description: "Tipo de roupa removido com sucesso",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gerenciar Tipos de Roupa</h1>
          <p className="text-muted-foreground">Administre os tipos de roupas disponíveis</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Tipo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Criar Novo Tipo de Roupa</DialogTitle>
              <DialogDescription>
                Digite o nome do novo tipo de roupa
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="typeName">Nome do Tipo</Label>
                <Input
                  id="typeName"
                  value={typeName}
                  onChange={(e) => setTypeName(e.target.value)}
                  placeholder="Ex: Jaleco, Touca, etc."
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Criar Tipo
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {clothingTypes.map((type) => (
          <Card key={type.id}>
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-primary-light p-2 rounded-full">
                  <ShirtIcon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{type.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Criado em {new Date(type.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(type.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};