import { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { Login } from "./Login";
import { Dashboard } from "./Dashboard";
import { UserManagement } from "./admin/UserManagement";
import { UnitManagement } from "./admin/UnitManagement";
import { ClothingTypeManagement } from "./admin/ClothingTypeManagement";
import { NewROL } from "./user/NewROL";
import { ROLList } from "./user/ROLList";
import { Downloads } from "./user/Downloads";
import { SupervisorDashboard } from "./supervisor/SupervisorDashboard";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

const Index = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState(() => {
    if (user?.role === 'supervisor') return 'supervisor-dashboard';
    return 'dashboard';
  });

  // Reset to appropriate dashboard when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'supervisor') {
        setActiveTab('supervisor-dashboard');
      } else {
        setActiveTab('dashboard');
      }
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <UserManagement />;
      case 'units':
        return <UnitManagement />;
      case 'clothing-types':
        return <ClothingTypeManagement />;
      case 'new-rol':
        return <NewROL />;
      case 'rol-list':
        return <ROLList />;
      case 'downloads':
        return <Downloads />;
      case 'supervisor-dashboard':
        return <SupervisorDashboard />;
      default:
        return user?.role === 'supervisor' ? <SupervisorDashboard /> : <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
