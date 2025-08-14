import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useData } from "@/hooks/useData";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, User, Edit2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const UserManagement = () => {
  const { users, units, addUser, updateUser, deleteUser } = useData();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' as 'admin' | 'user' | 'supervisor',
    unitId: '',
    sector: 'Área Limpa' as 'Área Limpa' | 'Área Suja',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUser) {
      // Editing existing user
      const existingUser = users.find(u => u.email === formData.email && u.id !== editingUser);
      if (existingUser) {
        toast({
          title: "Erro",
          description: "Email já está em uso",
          variant: "destructive",
        });
        return;
      }

      const updateData: any = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        unitId: formData.unitId,
        sector: formData.sector,
      };

      // Only update password if it's provided
      if (formData.password) {
        updateData.password = formData.password;
      }

      updateUser(editingUser, updateData);
      toast({
        title: "Sucesso",
        description: "Usuário atualizado com sucesso",
      });
    } else {
      // Creating new user
      if (users.find(user => user.email === formData.email)) {
        toast({
          title: "Erro",
          description: "Email já está em uso",
          variant: "destructive",
        });
        return;
      }

      addUser(formData);
      toast({
        title: "Sucesso",
        description: "Usuário criado com sucesso",
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'user',
      unitId: '',
      sector: 'Área Limpa',
    });
    setEditingUser(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (user: any) => {
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // Don't pre-fill password for security
      role: user.role,
      unitId: user.unitId,
      sector: user.sector,
    });
    setEditingUser(user.id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteUser(id);
    toast({
      title: "Sucesso",
      description: "Usuário removido com sucesso",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gerenciar Usuários</h1>
          <p className="text-muted-foreground">Administre os usuários do sistema</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingUser ? 'Editar Usuário' : 'Criar Novo Usuário'}
              </DialogTitle>
              <DialogDescription>
                {editingUser ? 'Atualize os dados do usuário' : 'Preencha os dados do novo usuário'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">
                  Senha {editingUser && <span className="text-muted-foreground text-xs">(deixe em branco para manter atual)</span>}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingUser}
                  placeholder={editingUser ? "Nova senha (opcional)" : ""}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Perfil</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: 'admin' | 'user' | 'supervisor') => 
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Usuário</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="unit">Unidade</Label>
                <Select
                  value={formData.unitId}
                  onValueChange={(value) => setFormData({ ...formData, unitId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma unidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        {unit.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sector">Setor</Label>
                <Select
                  value={formData.sector}
                  onValueChange={(value: 'Área Limpa' | 'Área Suja') => 
                    setFormData({ ...formData, sector: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Área Limpa">Área Limpa</SelectItem>
                    <SelectItem value="Área Suja">Área Suja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button type="submit" className="w-full">
                {editingUser ? 'Atualizar Usuário' : 'Criar Usuário'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-primary-light p-2 rounded-full">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant={user.role === 'admin' ? 'default' : user.role === 'supervisor' ? 'secondary' : 'outline'}>
                      {user.role === 'admin' ? 'Administrador' : user.role === 'supervisor' ? 'Supervisor' : 'Usuário'}
                    </Badge>
                    <Badge 
                      variant="outline"
                      className={user.sector === 'Área Limpa' ? 'border-success text-success' : 'border-warning text-warning'}
                    >
                      {user.sector}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-right text-sm">
                  <p className="font-medium">
                    {units.find(u => u.id === user.unitId)?.name || 'N/A'}
                  </p>
                  <p className="text-muted-foreground">
                    Criado em {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(user)}
                    className="text-primary hover:text-primary"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(user.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};