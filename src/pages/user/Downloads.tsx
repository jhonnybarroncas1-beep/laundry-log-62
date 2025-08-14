import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/hooks/useData";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export const Downloads = () => {
  const { user } = useAuth();
  const { rols, units, clothingTypes } = useData();
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('individual');

  // Filter ROLs based on user role
  const userRols = user?.role === 'admin' ? rols : rols.filter(rol => rol.userId === user?.id);

  // Filter by period
  const filteredRols = userRols.filter(rol => {
    const rolDate = new Date(rol.date);
    const now = new Date();
    
    switch (selectedPeriod) {
      case 'today':
        return rolDate.toDateString() === now.toDateString();
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return rolDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return rolDate >= monthAgo;
      default:
        return true;
    }
  });

  const generateIndividualPDF = (rol: any) => {
    const unit = units.find(u => u.id === rol.unitId);
    const totalWeight = rol.items.reduce((sum: number, item: any) => sum + item.weight, 0);
    const totalQuantity = rol.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
    
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
          </style>
        </head>
        <body>
          <div class="header">
            <h1>ROL ${rol.number}</h1>
            <h2>Sistema de Gestão de Roupas Hospitalares</h2>
          </div>
          <div class="info"><strong>Data:</strong> ${new Date(rol.date).toLocaleDateString('pt-BR')}</div>
          <div class="info"><strong>Unidade:</strong> ${unit?.name}</div>
          <div class="info"><strong>Setor:</strong> ${rol.sector}</div>
          <div class="info"><strong>Itens:</strong></div>
          <table border="1" style="width: 100%; margin: 10px 0; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="padding: 8px; background-color: #f2f2f2;">Tipo de Roupa</th>
                <th style="padding: 8px; background-color: #f2f2f2;">Quantidade</th>
                <th style="padding: 8px; background-color: #f2f2f2;">Peso (kg)</th>
              </tr>
            </thead>
            <tbody>
              ${rol.items.map(item => {
                const clothingType = clothingTypes.find(ct => ct.id === item.clothingTypeId);
                return `
                  <tr>
                    <td style="padding: 8px;">${clothingType?.name}</td>
                    <td style="padding: 8px;">${item.quantity}</td>
                    <td style="padding: 8px;">${item.weight}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
          <div class="info"><strong>Total de Itens:</strong> ${totalQuantity}</div>
          <div class="info"><strong>Peso Total:</strong> ${totalWeight.toFixed(1)} kg</div>
          <div class="info"><strong>Horário da Pesagem:</strong> ${new Date(rol.weighingTime).toLocaleString('pt-BR')}</div>
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

  const generateBatchPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    let content = `
      <html>
        <head>
          <title>Relatório de ROLs</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .summary { margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Relatório de ROLs</h1>
            <h2>Sistema de Gestão de Roupas Hospitalares</h2>
            <p>Período: ${selectedPeriod === 'all' ? 'Todos' : selectedPeriod}</p>
          </div>
          <div class="summary">
            <h3>Resumo</h3>
            <p><strong>Total de ROLs:</strong> ${filteredRols.length}</p>
            <p><strong>Peso Total:</strong> ${filteredRols.reduce((sum, rol) => sum + rol.items.reduce((itemSum, item) => itemSum + item.weight, 0), 0).toFixed(1)} kg</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>ROL</th>
                <th>Data</th>
                <th>Unidade</th>
                <th>Setor</th>
                <th>Tipo</th>
                <th>Quantidade</th>
                <th>Peso (kg)</th>
              </tr>
            </thead>
            <tbody>
    `;
    
    filteredRols.forEach(rol => {
      const unit = units.find(u => u.id === rol.unitId);
      
      rol.items.forEach((item, index) => {
        const clothingType = clothingTypes.find(ct => ct.id === item.clothingTypeId);
        
        content += `
          <tr>
            <td>${index === 0 ? rol.number : ''}</td>
            <td>${index === 0 ? new Date(rol.date).toLocaleDateString('pt-BR') : ''}</td>
            <td>${index === 0 ? unit?.name : ''}</td>
            <td>${index === 0 ? rol.sector : ''}</td>
            <td>${clothingType?.name}</td>
            <td>${item.quantity}</td>
            <td>${item.weight}</td>
          </tr>
        `;
      });
    });
    
    content += `
            </tbody>
          </table>
        </body>
      </html>
    `;
    
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Downloads</h1>
        <p className="text-muted-foreground">Baixe relatórios e ROLs em PDF</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Configurações de Download
          </CardTitle>
          <CardDescription>
            Configure o período e formato para download
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="period">Período</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os ROLs</SelectItem>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="week">Última Semana</SelectItem>
                  <SelectItem value="month">Último Mês</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="format">Formato</Label>
              <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">ROLs Individuais</SelectItem>
                  <SelectItem value="batch">Relatório Consolidado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {selectedFormat === 'batch' && (
            <div className="pt-4">
              <Button onClick={generateBatchPDF} className="w-full md:w-auto">
                <Download className="mr-2 h-4 w-4" />
                Baixar Relatório Consolidado ({filteredRols.length} ROLs)
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Individual ROLs */}
      {selectedFormat === 'individual' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">ROLs Disponíveis para Download</h2>
          
          {filteredRols.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhum ROL encontrado para o período selecionado.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredRols.map((rol) => {
                const unit = units.find(u => u.id === rol.unitId);
      const totalWeight = rol.items.reduce((sum, item) => sum + item.weight, 0);
      const totalQuantity = rol.items.reduce((sum, item) => sum + item.quantity, 0);
                
                return (
                  <Card key={rol.id}>
                    <CardContent className="flex items-center justify-between p-6">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">ROL {rol.number}</h3>
                          <Badge className={rol.sector === 'Área Limpa' ? 'bg-success' : 'bg-warning'}>
                            {rol.sector}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{new Date(rol.date).toLocaleDateString('pt-BR')}</span>
                          <span>{unit?.name}</span>
                          <span>{rol.items.length} tipos</span>
                          <span>{totalWeight.toFixed(1)} kg</span>
                        </div>
                      </div>
                      
                      <Button onClick={() => generateIndividualPDF(rol)}>
                        <Download className="h-4 w-4 mr-2" />
                        Baixar PDF
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};