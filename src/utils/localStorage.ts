import type { User, Product, Order } from '../types';
import { createSampleProducts, createSampleUsers, createSampleOrders } from './sampleData';

const STORAGE_KEYS = {
  USERS: 'mimipedidos_users',
  PRODUCTS: 'mimipedidos_products',
  ORDERS: 'mimipedidos_orders',
  CURRENT_USER: 'mimipedidos_current_user',
  INITIALIZED: 'mimipedidos_initialized',
};

// Función para serializar fechas
const serializeData = (data: unknown): string => {
  return JSON.stringify(data, (_key, value) => {
    if (value instanceof Date) {
      return { __type: 'Date', value: value.toISOString() };
    }
    return value;
  });
};

// Función para deserializar fechas
const deserializeData = (data: string): unknown => {
  return JSON.parse(data, (_key, value) => {
    if (value && typeof value === 'object' && value.__type === 'Date') {
      return new Date(value.value);
    }
    return value;
  });
};

// Usuarios
export const getUsers = (): User[] => {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? deserializeData(users) as User[] : [];
};

export const saveUsers = (users: User[]): void => {
  localStorage.setItem(STORAGE_KEYS.USERS, serializeData(users));
};

export const createDefaultUser = (): void => {
  const existingUsers = getUsers();
  const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
  
  if (existingUsers.length === 0 && !isInitialized) {
    const defaultUser: User = {
      id: 'admin',
      username: 'admin',
      password: 'admin123',
      profile: 'dueño',
      createdAt: new Date(),
    };
    
    // Crear usuarios de muestra
    const sampleUsers = createSampleUsers('admin');
    const allUsers = [defaultUser, ...sampleUsers];
    saveUsers(allUsers);
    
    // Crear productos de muestra
    const sampleProducts = createSampleProducts('admin');
    saveProducts(sampleProducts);
    
    // Crear pedidos de muestra
    const sampleOrders = createSampleOrders(allUsers, sampleProducts);
    saveOrders(sampleOrders);
    
    // Marcar como inicializado
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  }
};

// Función para resetear todos los datos y reinicializar
export const resetData = (): void => {
  // Limpiar localStorage completamente
  localStorage.removeItem(STORAGE_KEYS.USERS);
  localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
  localStorage.removeItem(STORAGE_KEYS.ORDERS);
  localStorage.removeItem(STORAGE_KEYS.INITIALIZED);
  
  // Limpiar cualquier otra clave que pueda estar interfiriendo
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('mimi_') || key.includes('pedidos')) {
      localStorage.removeItem(key);
    }
  });
  
  // Forzar reinicialización inmediata
  forceInitialization();
};

// Función para forzar la inicialización inmediata
export const forceInitialization = (): void => {
  const defaultUser: User = {
    id: 'admin',
    username: 'admin',
    password: 'admin123',
    profile: 'dueño',
    createdAt: new Date(),
  };
  
  // Crear usuarios de muestra
  const sampleUsers = createSampleUsers('admin');
  const allUsers = [defaultUser, ...sampleUsers];
  saveUsers(allUsers);
  
  // Crear productos de muestra
  const sampleProducts = createSampleProducts('admin');
  saveProducts(sampleProducts);
  
  // Crear pedidos de muestra
  const sampleOrders = createSampleOrders(allUsers, sampleProducts);
  saveOrders(sampleOrders);
  
  // Marcar como inicializado
  localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  
  console.log('Datos inicializados:', {
    users: allUsers.length,
    products: sampleProducts.length,
    orders: sampleOrders.length,
    productTypes: sampleProducts.reduce((acc, p) => {
      acc[p.tipoDeProducto] = (acc[p.tipoDeProducto] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  });
};

// Productos
export const getProducts = (): Product[] => {
  const products = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  return products ? deserializeData(products) as Product[] : [];
};

export const saveProducts = (products: Product[]): void => {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, serializeData(products));
};

// Pedidos
export const getOrders = (): Order[] => {
  const orders = localStorage.getItem(STORAGE_KEYS.ORDERS);
  return orders ? deserializeData(orders) as Order[] : [];
};

export const saveOrders = (orders: Order[]): void => {
  localStorage.setItem(STORAGE_KEYS.ORDERS, serializeData(orders));
};

// Usuario actual
export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return user ? deserializeData(user) as User : null;
};

export const saveCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, serializeData(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

// Generar ID único
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}; 