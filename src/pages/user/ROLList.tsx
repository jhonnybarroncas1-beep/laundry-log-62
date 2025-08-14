import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/hooks/useData";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Eye, Filter } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
export const ROLList = () => {
  const {
    user
  } = useAuth();
  const {
    rols,
    units,
    clothingTypes
  } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('all');
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedROL, setSelectedROL] = useState<any>(null);

  // Filter ROLs based on user role
  const userRols = user?.role === 'admin' ? rols : rols.filter(rol => rol.userId === user?.id);

  // Apply filters
  const filteredRols = userRols.filter(rol => {
    const hasMatchingClothingType = rol.items.some(item => clothingTypes.find(ct => ct.id === item.clothingTypeId)?.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSearch = rol.number.toLowerCase().includes(searchTerm.toLowerCase()) || hasMatchingClothingType;
    const matchesUnit = selectedUnit === 'all' || rol.unitId === selectedUnit;
    const matchesSector = selectedSector === 'all' || rol.sector === selectedSector;
    return matchesSearch && matchesUnit && matchesSector;
  });
  const generatePDF = (rol: any) => {
    const unit = units.find(u => u.id === rol.unitId);
    const totalWeight = rol.items.reduce((sum: number, item: any) => sum + item.weight, 0);
    const totalQuantity = rol.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
    const rolType = rol.sector === 'Área Limpa' ? 'Entrega' : 'Coleta';

    // Simple PDF generation using window.print (in a real app, use a proper PDF library)
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>ROL ${rol.number}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .info { margin: 10px 0; }
            .signatures { display: flex; justify-content: space-between; margin-top: 50px; }
            .signature { text-align: center; width: 45%; }
            .signature img { max-width: 200px; border: 1px solid #ccc; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>ROL ${rol.number}</h1>
            <h2>Sistema de Gestão de Roupas Hospitalares</h2>
          </div>
          <div class="info"><strong>Tipo:</strong> ROL de ${rolType}</div>
          <div class="info"><strong>Data:</strong> ${new Date(rol.date).toLocaleDateString('pt-BR')}</div>
          <div class="info"><strong>Unidade:</strong> ${unit?.name}</div>
          <div class="info"><strong>Setor:</strong> ${rol.sector}</div>
          <div class="info"><strong>Horário da Pesagem:</strong> ${new Date(rol.weighingTime).toLocaleString('pt-BR')}</div>
          
          <h3>Itens:</h3>
          <table>
            <thead>
              <tr>
                <th>Tipo de Roupa</th>
                <th>Quantidade</th>
                <th>Peso (kg)</th>
              </tr>
            </thead>
            <tbody>
              ${rol.items.map((item: any) => {
      const clothingType = clothingTypes.find(ct => ct.id === item.clothingTypeId);
      return `
                  <tr>
                    <td>${clothingType?.name}</td>
                    <td>${item.quantity}</td>
                    <td>${item.weight}</td>
                  </tr>
                `;
    }).join('')}
            </tbody>
          </table>
          
          <div class="info"><strong>Total de Itens:</strong> ${totalQuantity}</div>
          <div class="info"><strong>Peso Total:</strong> ${totalWeight.toFixed(1)} kg</div>
          <div class="signatures">
            <div class="signature">
              <h3>Assinatura do Cliente</h3>
              ${rol.clientSignature ? `<img src="${rol.clientSignature}" alt="Assinatura Cliente" />` : '<div style="border: 1px solid #ccc; height: 100px; line-height: 100px;">Sem assinatura</div>'}
            </div>
            <div class="signature">
              <h3>Assinatura da Lavanderia</h3>
              ${rol.laundrySignature ? `<img src="${rol.laundrySignature}" alt="Assinatura Lavanderia" />` : '<div style="border: 1px solid #ccc; height: 100px; line-height: 100px;">Sem assinatura</div>'}
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };
  return <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Lista de ROLs</h1>
        <p className="text-muted-foreground">Visualize e gerencie seus ROLs</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </CardTitle>
          <CardDescription>
            Use os filtros para encontrar ROLs específicos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="search" placeholder="Número do ROL ou tipo de roupa" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
            </div>
            
            {user?.role === 'admin' && <div className="space-y-2">
                <Label htmlFor="unit">Unidade</Label>
                <Select value={selectedUnit} onValueChange={setSelectedUnit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Unidades</SelectItem>
                    {units.map(unit => <SelectItem key={unit.id} value={unit.id}>
                        {unit.name}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>}
            
            <div className="space-y-2">
              <Label htmlFor="sector">Setor</Label>
              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Setores</SelectItem>
                  <SelectItem value="Área Limpa">Área Limpa</SelectItem>
                  <SelectItem value="Área Suja">Área Suja</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ROL List */}
      <div className="grid gap-4">
        {filteredRols.map(rol => {
        const unit = units.find(u => u.id === rol.unitId);
        const totalWeight = rol.items.reduce((sum, item) => sum + item.weight, 0);
        const totalQuantity = rol.items.reduce((sum, item) => sum + item.quantity, 0);
        const rolType = rol.sector === 'Área Limpa' ? 'Entrega' : 'Coleta';
        return <Card key={rol.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold">ROL {rol.number}</h3>
                      
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
                        {rolType}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Data:</span>
                        <p>{new Date(rol.date).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <div>
                        <span className="font-medium">Unidade:</span>
                        <p>{unit?.name}</p>
                      </div>
                      <div>
                        <span className="font-medium">Itens:</span>
                        <p>{rol.items.length} tipos ({totalQuantity} peças)</p>
                      </div>
                      <div>
                        <span className="font-medium">Peso Total:</span>
                        <p>{totalWeight.toFixed(1)} kg</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedROL(rol)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>ROL {rol.number} - Detalhes</DialogTitle>
                        </DialogHeader>
                        {selectedROL && <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Tipo</Label>
                                <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
                                  {selectedROL.sector === 'Área Limpa' ? 'Entrega' : 'Coleta'}
                                </Badge>
                              </div>
                              <div>
                                <Label>Data</Label>
                                <p>{new Date(selectedROL.date).toLocaleDateString('pt-BR')}</p>
                              </div>
                              <div>
                                <Label>Horário da Pesagem</Label>
                                <p>{new Date(selectedROL.weighingTime).toLocaleTimeString('pt-BR')}</p>
                              </div>
                              <div>
                                <Label>Unidade</Label>
                                <p>{units.find(u => u.id === selectedROL.unitId)?.name}</p>
                              </div>
                              <div>
                                <Label>Setor</Label>
                                <Badge className={selectedROL.sector === 'Área Limpa' ? 'bg-success' : 'bg-warning'}>
                                  {selectedROL.sector}
                                </Badge>
                              </div>
                              <div className="col-span-2">
                                <Label>Itens do ROL</Label>
                                <div className="mt-2 space-y-2">
                                  {selectedROL.items.map((item: any, index: number) => {
                              const clothingType = clothingTypes.find(ct => ct.id === item.clothingTypeId);
                              return <div key={index} className="flex justify-between p-2 border rounded">
                                        <span>{clothingType?.name}</span>
                                        <span>{item.quantity} peças - {item.weight}kg</span>
                                      </div>;
                            })}
                                  <div className="border-t pt-2 font-medium">
                                    Total: {selectedROL.items.reduce((sum: number, item: any) => sum + item.quantity, 0)} peças - {selectedROL.items.reduce((sum: number, item: any) => sum + item.weight, 0).toFixed(1)}kg
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {(selectedROL.clientSignature || selectedROL.laundrySignature) && <div className="space-y-4">
                                <Label>Assinaturas</Label>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium mb-2">Cliente</p>
                                    {selectedROL.clientSignature ? <img src={selectedROL.clientSignature} alt="Assinatura Cliente" className="border rounded max-h-32" /> : <p className="text-muted-foreground">Sem assinatura</p>}
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium mb-2">Lavanderia</p>
                                    {selectedROL.laundrySignature ? <img src={selectedROL.laundrySignature} alt="Assinatura Lavanderia" className="border rounded max-h-32" /> : <p className="text-muted-foreground">Sem assinatura</p>}
                                  </div>
                                </div>
                              </div>}
                          </div>}
                      </DialogContent>
                    </Dialog>
                    
                    <Button size="sm" onClick={() => generatePDF(rol)}>
                      <Download className="h-4 w-4 mr-2" />
                      PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>;
      })}
      </div>

      {filteredRols.length === 0 && <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Nenhum ROL encontrado com os filtros aplicados.</p>
          </CardContent>
        </Card>}
    </div>;
};