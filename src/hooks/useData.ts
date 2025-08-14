import { useState, useEffect } from 'react';
import { Unit, ClothingType, ROL, User, ROLItem } from '@/types';

export const useData = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [clothingTypes, setClothingTypes] = useState<ClothingType[]>([]);
  const [rols, setRols] = useState<ROL[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Initialize mock data
    if (!localStorage.getItem('rol_units')) {
      const mockUnits: Unit[] = [
        { id: '1', name: 'Unidade Hospitalar A', createdAt: new Date() },
        { id: '2', name: 'Unidade Hospitalar B', createdAt: new Date() },
        { id: '3', name: 'Unidade Hospitalar C', createdAt: new Date() },
      ];
      localStorage.setItem('rol_units', JSON.stringify(mockUnits));
    }

    if (!localStorage.getItem('rol_clothing_types')) {
      const mockClothingTypes: ClothingType[] = [
        { id: '1', name: 'Camisa', createdAt: new Date() },
        { id: '2', name: 'Calça', createdAt: new Date() },
        { id: '3', name: 'Avental', createdAt: new Date() },
        { id: '4', name: 'Lençol', createdAt: new Date() },
        { id: '5', name: 'Toalha', createdAt: new Date() },
        { id: '6', name: 'Uniforme Completo', createdAt: new Date() },
      ];
      localStorage.setItem('rol_clothing_types', JSON.stringify(mockClothingTypes));
    }

    // Load data from localStorage
    setUnits(JSON.parse(localStorage.getItem('rol_units') || '[]'));
    setClothingTypes(JSON.parse(localStorage.getItem('rol_clothing_types') || '[]'));
    setRols(JSON.parse(localStorage.getItem('rol_rols') || '[]'));
    setUsers(JSON.parse(localStorage.getItem('rol_users') || '[]'));
  }, []);

  const addUnit = (unit: Omit<Unit, 'id' | 'createdAt'>) => {
    const newUnit: Unit = {
      ...unit,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    const updatedUnits = [...units, newUnit];
    setUnits(updatedUnits);
    localStorage.setItem('rol_units', JSON.stringify(updatedUnits));
  };

  const addClothingType = (clothingType: Omit<ClothingType, 'id' | 'createdAt'>) => {
    const newClothingType: ClothingType = {
      ...clothingType,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    const updatedTypes = [...clothingTypes, newClothingType];
    setClothingTypes(updatedTypes);
    localStorage.setItem('rol_clothing_types', JSON.stringify(updatedTypes));
  };

  const addUser = (user: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('rol_users', JSON.stringify(updatedUsers));
  };

  const addROL = (rol: Omit<ROL, 'id' | 'createdAt' | 'number'>) => {
    const existingRols: ROL[] = JSON.parse(localStorage.getItem('rol_rols') || '[]');
    const nextNumber = (existingRols.length + 1).toString().padStart(6, '0');
    
    const newROL: ROL = {
      ...rol,
      id: Date.now().toString(),
      number: nextNumber,
      createdAt: new Date(),
    };
    const updatedRols = [...rols, newROL];
    setRols(updatedRols);
    localStorage.setItem('rol_rols', JSON.stringify(updatedRols));
    return newROL;
  };

  const updateUser = (id: string, userData: Partial<Omit<User, 'id' | 'createdAt'>>) => {
    const updatedUsers = users.map(user => 
      user.id === id ? { ...user, ...userData } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('rol_users', JSON.stringify(updatedUsers));
  };

  const deleteUser = (id: string) => {
    const updatedUsers = users.filter(user => user.id !== id);
    setUsers(updatedUsers);
    localStorage.setItem('rol_users', JSON.stringify(updatedUsers));
  };

  const deleteUnit = (id: string) => {
    const updatedUnits = units.filter(unit => unit.id !== id);
    setUnits(updatedUnits);
    localStorage.setItem('rol_units', JSON.stringify(updatedUnits));
  };

  const deleteClothingType = (id: string) => {
    const updatedTypes = clothingTypes.filter(type => type.id !== id);
    setClothingTypes(updatedTypes);
    localStorage.setItem('rol_clothing_types', JSON.stringify(updatedTypes));
  };

  const updateUnit = (id: string, unitData: Partial<Omit<Unit, 'id' | 'createdAt'>>) => {
    const updatedUnits = units.map(unit => 
      unit.id === id ? { ...unit, ...unitData } : unit
    );
    setUnits(updatedUnits);
    localStorage.setItem('rol_units', JSON.stringify(updatedUnits));
  };

  const updateClothingType = (id: string, typeData: Partial<Omit<ClothingType, 'id' | 'createdAt'>>) => {
    const updatedTypes = clothingTypes.map(type => 
      type.id === id ? { ...type, ...typeData } : type
    );
    setClothingTypes(updatedTypes);
    localStorage.setItem('rol_clothing_types', JSON.stringify(updatedTypes));
  };

  return {
    units,
    clothingTypes,
    rols,
    users,
    addUnit,
    addClothingType,
    addUser,
    addROL,
    updateUser,
    updateUnit,
    updateClothingType,
    deleteUser,
    deleteUnit,
    deleteClothingType,
  };
};