import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/hooks/useData";
import { FileText, Users, Building, ShirtIcon, TrendingUp, Clock, Package } from "lucide-react";

export const Dashboard = () => {
  const { user } = useAuth();
  const { units, clothingTypes, rols, users } = useData();

  const todayRols = rols.filter(rol => {
    const today = new Date().toDateString();
    return new Date(rol.date).toDateString() === today;
  });

  const userRols = user?.role === 'user' 
    ? rols.filter(rol => rol.userId === user.id)
    : rols;

  const totalWeight = rols.reduce((sum, rol) => sum + rol.items.reduce((itemSum, item) => itemSum + item.weight, 0), 0);

  if (user?.role === 'admin') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Administrativo</h1>
          <p className="text-muted-foreground">Visão geral do sistema ROL</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">
                Usuários cadastrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unidades</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{units.length}</div>
              <p className="text-xs text-muted-foreground">
                Unidades hospitalares
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tipos de Roupa</CardTitle>
              <ShirtIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clothingTypes.length}</div>
              <p className="text-xs text-muted-foreground">
                Tipos cadastrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ROLs Total</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rols.length}</div>
              <p className="text-xs text-muted-foreground">
                ROLs processados
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>ROLs por Unidade</CardTitle>
              <CardDescription>Distribuição de ROLs por unidade hospitalar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {units.map(unit => {
                  const unitRols = rols.filter(rol => rol.unitId === unit.id);
                  return (
                    <div key={unit.id} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{unit.name}</span>
                      <span className="text-sm text-muted-foreground">{unitRols.length} ROLs</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
              <CardDescription>ROLs criados hoje</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">{todayRols.length}</div>
              <p className="text-sm text-muted-foreground">
                ROLs processados hoje
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Meu Dashboard</h1>
        <p className="text-muted-foreground">Bem-vindo, {user?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meus ROLs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userRols.length}</div>
            <p className="text-xs text-muted-foreground">
              ROLs criados por você
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoje</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayRols.filter(rol => rol.userId === user?.id).length}</div>
            <p className="text-xs text-muted-foreground">
              ROLs criados hoje
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peso Total</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWeight.toFixed(1)} kg</div>
            <p className="text-xs text-muted-foreground">
              Peso processado
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Meu Perfil</CardTitle>
          <CardDescription>Informações do seu perfil</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Setor</p>
              <p className={`text-sm px-2 py-1 rounded ${
                user?.sector === 'Área Limpa' 
                  ? 'bg-success-light text-success' 
                  : 'bg-warning-light text-warning'
              }`}>
                {user?.sector}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Unidade</p>
              <p className="text-sm text-muted-foreground">
                {units.find(u => u.id === user?.unitId)?.name || 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};