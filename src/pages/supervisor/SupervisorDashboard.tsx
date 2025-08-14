import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ROL, Unit } from "@/types";
import { CalendarDays, FileText, Weight, Users } from "lucide-react";
import { format, startOfDay, endOfDay, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { ptBR } from "date-fns/locale";

export const SupervisorDashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Mock data - em um cenário real, viria do backend
  const units: Unit[] = JSON.parse(localStorage.getItem('rol_units') || '[]');
  const rols: ROL[] = JSON.parse(localStorage.getItem('rol_rols') || '[]');

  const today = new Date();
  const todayStart = startOfDay(today);
  const todayEnd = endOfDay(today);

  const selectedMonthStart = startOfMonth(new Date(selectedYear, selectedMonth));
  const selectedMonthEnd = endOfMonth(new Date(selectedYear, selectedMonth));

  // ROLs do dia atual
  const todayROLs = useMemo(() => {
    return rols.filter(rol => 
      isWithinInterval(new Date(rol.date), { start: todayStart, end: todayEnd })
    );
  }, [rols, todayStart, todayEnd]);

  // ROLs do mês selecionado
  const monthROLs = useMemo(() => {
    return rols.filter(rol => 
      isWithinInterval(new Date(rol.date), { start: selectedMonthStart, end: selectedMonthEnd })
    );
  }, [rols, selectedMonthStart, selectedMonthEnd]);

  // Agrupar ROLs por unidade
  const groupROLsByUnit = (rolsList: ROL[]) => {
    return units.map(unit => ({
      unit,
      rols: rolsList.filter(rol => rol.unitId === unit.id),
      totalWeight: rolsList
        .filter(rol => rol.unitId === unit.id)
        .reduce((total, rol) => total + rol.items.reduce((sum, item) => sum + item.weight, 0), 0)
    }));
  };

  const todayByUnit = groupROLsByUnit(todayROLs);
  const monthByUnit = groupROLsByUnit(monthROLs);

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Supervisão de ROLs</h1>
        <p className="text-muted-foreground">Gestão de todos os ROLs por unidade</p>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROLs Hoje</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayROLs.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peso Total Hoje</CardTitle>
            <Weight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {todayROLs.reduce((total, rol) => 
                total + rol.items.reduce((sum, item) => sum + item.weight, 0), 0
              ).toFixed(1)} kg
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unidades Ativas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(todayROLs.map(rol => rol.unitId)).size}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROLs no Mês</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthROLs.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="today" className="space-y-4">
        <TabsList>
          <TabsTrigger value="today">ROLs de Hoje</TabsTrigger>
          <TabsTrigger value="month">ROLs por Mês</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <div className="grid gap-4">
            {todayByUnit.map(({ unit, rols, totalWeight }) => (
              <Card key={unit.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{unit.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{rols.length} ROLs</Badge>
                      <Badge variant="outline">{totalWeight.toFixed(1)} kg</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {rols.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      Nenhum ROL criado hoje nesta unidade
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {rols.map(rol => (
                        <div key={rol.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">ROL #{rol.number}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(rol.date), 'HH:mm', { locale: ptBR })} - {rol.sector}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {rol.items.reduce((sum, item) => sum + item.weight, 0).toFixed(1)} kg
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {rol.items.reduce((sum, item) => sum + item.quantity, 0)} itens
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="month" className="space-y-4">
          <div className="flex items-center space-x-4 mb-4">
            <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((month, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {monthByUnit.map(({ unit, rols, totalWeight }) => (
              <Card key={unit.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{unit.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{rols.length} ROLs</Badge>
                      <Badge variant="outline">{totalWeight.toFixed(1)} kg</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {rols.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      Nenhum ROL neste período para esta unidade
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {rols.map(rol => (
                        <div key={rol.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">ROL #{rol.number}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(rol.date), 'dd/MM/yyyy HH:mm', { locale: ptBR })} - {rol.sector}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {rol.items.reduce((sum, item) => sum + item.weight, 0).toFixed(1)} kg
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {rol.items.reduce((sum, item) => sum + item.quantity, 0)} itens
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};