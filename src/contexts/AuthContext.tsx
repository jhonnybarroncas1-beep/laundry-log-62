import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '@/types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    // Force complete refresh of all data to include supervisor
    localStorage.clear();
    
    // Initialize mock data if not exists
    if (!localStorage.getItem('rol_users')) {
      const mockUsers: User[] = [
        {
          id: '1',
          name: 'Admin Sistema',
          email: 'admin@hospital.com',
          password: 'admin123',
          role: 'admin',
          unitId: '1',
          sector: 'Área Limpa',
          createdAt: new Date(),
        },
        {
          id: '2',
          name: 'Maria Silva',
          email: 'maria@hospital.com',
          password: 'user123',
          role: 'user',
          unitId: '1',
          sector: 'Área Limpa',
          createdAt: new Date(),
        },
        {
          id: '3',
          name: 'João Santos',
          email: 'joao@hospital.com',
          password: 'b@123456',
          role: 'user',
          unitId: '2',
          sector: 'Área Suja',
          createdAt: new Date(),
        },
        {
          id: '4',
          name: 'Carlos Supervisor',
          email: 'supervisor@hospital.com',
          password: 'supervisor123',
          role: 'supervisor',
          unitId: '1',
          sector: 'Área Limpa',
          createdAt: new Date(),
        },
      ];
      localStorage.setItem('rol_users', JSON.stringify(mockUsers));
    }

    // Check for existing session
    const savedUser = localStorage.getItem('rol_current_user');
    if (savedUser) {
      setAuthState({
        user: JSON.parse(savedUser),
        isAuthenticated: true,
      });
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const users: User[] = JSON.parse(localStorage.getItem('rol_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      setAuthState({
        user,
        isAuthenticated: true,
      });
      localStorage.setItem('rol_current_user', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
    });
    localStorage.removeItem('rol_current_user');
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};