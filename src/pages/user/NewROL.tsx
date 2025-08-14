import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/hooks/useData";
import { useToast } from "@/hooks/use-toast";
import { SignatureCanvas } from "@/components/forms/SignatureCanvas";
import { Badge } from "@/components/ui/badge";
import { ROLItem } from "@/types";
import { Plus, Trash2 } from "lucide-react";
export const NewROL = () => {
  const {
    user
  } = useAuth();
  const {
    units,
    clothingTypes,
    addROL
  } = useData();
  const {
    toast
  } = useToast();
  const [items, setItems] = useState<ROLItem[]>([]);
  const [currentItem, setCurrentItem] = useState({
    clothingTypeId: '',
    quantity: '',
    weight: ''
  });
  const [signatures, setSignatures] = useState({
    clientSignature: '',
    laundrySignature: ''
  });
  const userUnit = units.find(u => u.id === user?.unitId);
  const isCleanArea = user?.sector === 'Área Limpa';
  const rolType = isCleanArea ? 'Entrega' : 'Coleta';
  const addItem = () => {
    if (!currentItem.clothingTypeId || !currentItem.quantity || !currentItem.weight) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos do item",
        variant: "destructive"
      });
      return;
    }
    const newItem: ROLItem = {
      id: Date.now().toString(),
      clothingTypeId: currentItem.clothingTypeId,
      quantity: parseInt(currentItem.quantity),
      weight: parseFloat(currentItem.weight)
    };
    setItems([...items, newItem]);
    setCurrentItem({
      clothingTypeId: '',
      quantity: '',
      weight: ''
    });
  };
  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (items.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos um item ao ROL",
        variant: "destructive"
      });
      return;
    }
    const newROL = addROL({
      date: new Date(),
      unitId: user.unitId,
      sector: user.sector,
      items: items,
      weighingTime: new Date(),
      clientSignature: signatures.clientSignature,
      laundrySignature: signatures.laundrySignature,
      userId: user.id
    });
    toast({
      title: "Sucesso",
      description: `ROL ${newROL.number} criado com sucesso`
    });

    // Reset form
    setItems([]);
    setCurrentItem({
      clothingTypeId: '',
      quantity: '',
      weight: ''
    });
    setSignatures({
      clientSignature: '',
      laundrySignature: ''
    });
  };
  if (!user) return null;
  return <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Criar Novo ROL de {rolType}</h1>
        <p className="text-muted-foreground">{userUnit?.name || 'Unidade não encontrada'}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações Automáticas</CardTitle>
          <CardDescription>
            Dados preenchidos automaticamente baseados no seu perfil
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Data</Label>
              <p className="text-sm bg-muted p-2 rounded">
                {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div>
              <Label>Horário da Pesagem</Label>
              <p className="text-sm bg-muted p-2 rounded">
                {new Date().toLocaleTimeString('pt-BR')}
              </p>
            </div>
            
            
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Adicionar Item</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="clothingType">Tipo de Roupa *</Label>
              <Select value={currentItem.clothingTypeId} onValueChange={value => setCurrentItem({
              ...currentItem,
              clothingTypeId: value
            })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {clothingTypes.map(type => <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade *</Label>
              <Input id="quantity" type="number" min="1" value={currentItem.quantity} onChange={e => setCurrentItem({
              ...currentItem,
              quantity: e.target.value
            })} placeholder="Qtd" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weight">Peso (kg) *</Label>
              <Input id="weight" type="number" step="0.1" min="0" value={currentItem.weight} onChange={e => setCurrentItem({
              ...currentItem,
              weight: e.target.value
            })} placeholder="Peso" />
            </div>

            <Button onClick={addItem} type="button" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Adicionar
            </Button>
          </div>
        </CardContent>
      </Card>

      {items.length > 0 && <Card>
          <CardHeader>
            <CardTitle>Itens Adicionados ({items.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {items.map(item => {
            const clothingType = clothingTypes.find(ct => ct.id === item.clothingTypeId);
            return <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="grid grid-cols-3 gap-4 flex-1">
                      <div>
                        <p className="font-medium">{clothingType?.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Qtd: {item.quantity}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Peso: {item.weight}kg</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => removeItem(item.id)} className="text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>;
          })}
              
              <div className="border-t pt-3 mt-3">
                <div className="grid grid-cols-2 gap-4 text-sm font-medium">
                  <div>Total de Itens: {items.reduce((sum, item) => sum + item.quantity, 0)}</div>
                  <div>Peso Total: {items.reduce((sum, item) => sum + item.weight, 0).toFixed(1)}kg</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>}

      <Card>
        <CardHeader>
          <CardTitle>Assinaturas</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <SignatureCanvas label="Assinatura do Cliente" onSignatureChange={signature => setSignatures({
              ...signatures,
              clientSignature: signature
            })} />
              
              <SignatureCanvas label="Assinatura da Lavanderia" onSignatureChange={signature => setSignatures({
              ...signatures,
              laundrySignature: signature
            })} />
            </div>

            <Button type="submit" className="w-full" disabled={items.length === 0}>
              Criar ROL de {rolType} ({items.length} itens)
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>;
};