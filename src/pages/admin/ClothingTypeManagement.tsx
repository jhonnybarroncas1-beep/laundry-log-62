import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useData } from "@/hooks/useData";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, ShirtIcon, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const ClothingTypeManagement = () => {
  const { clothingTypes, addClothingType, updateClothingType, deleteClothingType } = useData();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTypeId, setEditingTypeId] = useState<string | null>(null);
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

    if (isEditMode && editingTypeId) {
      updateClothingType(editingTypeId, { name: typeName.trim() });
      toast({
        title: "Sucesso",
        description: "Tipo de roupa atualizado com sucesso",
      });
    } else {
      addClothingType({ name: typeName.trim() });
      toast({
        title: "Sucesso",
        description: "Tipo de roupa criado com sucesso",
      });
    }
    
    setTypeName('');
    setIsDialogOpen(false);
    setIsEditMode(false);
    setEditingTypeId(null);
  };

  const handleEdit = (type: any) => {
    setIsEditMode(true);
    setEditingTypeId(type.id);
    setTypeName(type.name);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteClothingType(id);
    toast({
      title: "Sucesso",
      description: "Tipo de roupa removido com sucesso",
    });
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setIsEditMode(false);
    setEditingTypeId(null);
    setTypeName('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gerenciar Tipos de Roupa</h1>
          <p className="text-muted-foreground">Administre os tipos de roupas disponíveis</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Tipo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{isEditMode ? 'Editar Tipo de Roupa' : 'Criar Novo Tipo de Roupa'}</DialogTitle>
              <DialogDescription>
                {isEditMode ? 'Altere o nome do tipo de roupa' : 'Digite o nome do novo tipo de roupa'}
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
                {isEditMode ? 'Atualizar Tipo' : 'Criar Tipo'}
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
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(type)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(type.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};