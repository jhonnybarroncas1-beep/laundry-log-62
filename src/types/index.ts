export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user' | 'supervisor';
  unitId: string;
  sector: 'Área Limpa' | 'Área Suja';
  createdAt: Date;
}

export interface Unit {
  id: string;
  name: string;
  createdAt: Date;
}

export interface ClothingType {
  id: string;
  name: string;
  createdAt: Date;
}

export interface ROLItem {
  id: string;
  clothingTypeId: string;
  quantity: number;
  weight: number;
}

export interface ROL {
  id: string;
  number: string;
  date: Date;
  unitId: string;
  sector: 'Área Limpa' | 'Área Suja';
  items: ROLItem[];
  weighingTime: Date;
  clientSignature?: string;
  laundrySignature?: string;
  userId: string;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}