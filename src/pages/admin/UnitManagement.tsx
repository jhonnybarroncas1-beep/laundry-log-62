import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useData } from "@/hooks/useData";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Building } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const UnitManagement = () => {
  const { units, addUnit, deleteUnit } = useData();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [unitName, setUnitName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!unitName.trim()) {
      toast({
        title: "Erro",
        description: "Nome da unidade é obrigatório",
        variant: "destructive",
      });
      return;
    }

    addUnit({ name: unitName.trim() });
    toast({
      title: "Sucesso",
      description: "Unidade criada com sucesso",
    });
    setUnitName('');
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteUnit(id);
    toast({
      title: "Sucesso",
      description: "Unidade removida com sucesso",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gerenciar Unidades</h1>
          <p className="text-muted-foreground">Administre as unidades hospitalares</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Unidade
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Criar Nova Unidade</DialogTitle>
              <DialogDescription>
                Digite o nome da nova unidade hospitalar
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="unitName">Nome da Unidade</Label>
                <Input
                  id="unitName"
                  value={unitName}
                  onChange={(e) => setUnitName(e.target.value)}
                  placeholder="Ex: Unidade Hospitalar Central"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Criar Unidade
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {units.map((unit) => (
          <Card key={unit.id}>
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-primary-light p-2 rounded-full">
                  <Building className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{unit.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Criado em {new Date(unit.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(unit.id)}
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