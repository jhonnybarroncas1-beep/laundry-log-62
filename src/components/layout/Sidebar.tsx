import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Home, 
  FileText, 
  Plus, 
  Download, 
  Settings, 
  Users, 
  Building, 
  ShirtIcon 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const { user } = useAuth();
  
  const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'users', label: 'Usuários', icon: Users },
    { id: 'units', label: 'Unidades', icon: Building },
    { id: 'clothing-types', label: 'Tipos de Roupa', icon: ShirtIcon },
  ];

  const userMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'new-rol', label: 'Novo ROL', icon: Plus },
    { id: 'rol-list', label: 'Lista de ROLs', icon: FileText },
    { id: 'downloads', label: 'Downloads', icon: Download },
  ];

  const supervisorMenuItems = [
    { id: 'supervisor-dashboard', label: 'Supervisão ROLs', icon: Settings },
  ];

  const getMenuItems = () => {
    if (user?.role === 'admin') return adminMenuItems;
    if (user?.role === 'supervisor') return supervisorMenuItems;
    return userMenuItems;
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-64 bg-card border-r border-border">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "w-full justify-start",
                activeTab === item.id && "bg-primary text-primary-foreground"
              )}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </nav>
    </aside>
  );
};