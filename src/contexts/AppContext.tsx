import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, Product, Order, AppContextType } from '../types';
import { 
  getUsers, 
  saveUsers, 
  getProducts, 
  saveProducts, 
  getOrders, 
  saveOrders, 
  generateId 
} from '../utils/localStorage';

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Cargar datos desde localStorage
    setUsers(getUsers());
    setProducts(getProducts());
    setOrders(getOrders());
  }, []);

  const createUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: generateId(),
      createdAt: new Date(),
    };
    
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    saveUsers(updatedUsers);
  };

  const updateUser = (userId: string, userData: Partial<User>) => {
    const updatedUsers = users.map(user =>
      user.id === userId
        ? { ...user, ...userData }
        : user
    );
    
    setUsers(updatedUsers);
    saveUsers(updatedUsers);
  };

  const deleteUser = (userId: string) => {
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    saveUsers(updatedUsers);
  };

  const createProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: generateId(),
      createdAt: new Date(),
    };
    
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    saveProducts(updatedProducts);
  };

  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newOrder: Order = {
      ...orderData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    saveOrders(updatedOrders);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId
        ? { ...order, status, updatedAt: new Date() }
        : order
    );
    
    setOrders(updatedOrders);
    saveOrders(updatedOrders);
    
    // Automáticamente cambiar "aceptado" a "en fabricacion"
    if (status === 'aceptado') {
      setTimeout(() => {
        const finalOrders = updatedOrders.map(order =>
          order.id === orderId
            ? { ...order, status: 'en fabricacion' as Order['status'], updatedAt: new Date() }
            : order
        );
        setOrders(finalOrders);
        saveOrders(finalOrders);
      }, 1000);
    }
  };

  const deleteProduct = (productId: string) => {
    const updatedProducts = products.filter(product => product.id !== productId);
    setProducts(updatedProducts);
    saveProducts(updatedProducts);
  };

  const updateProduct = (productId: string, productData: Partial<Product>) => {
    const updatedProducts = products.map(product =>
      product.id === productId
        ? { ...product, ...productData }
        : product
    );
    
    setProducts(updatedProducts);
    saveProducts(updatedProducts);
  };

  const value: AppContextType = {
    users,
    products,
    orders,
    createUser,
    updateUser,
    deleteUser,
    createProduct,
    createOrder,
    updateOrderStatus,
    deleteProduct,
    updateProduct,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}; 