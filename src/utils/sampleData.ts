import type { Product, User, Order, OrderItem } from '../types';
import { generateId } from './localStorage';

export const createSampleProducts = (userId: string): Product[] => {
  const now = new Date();
  
  return [
    {
      id: generateId(),
      name: 'Torta de Chocolate',
      presentation: 'Caja redonda de cartón',
      weight: 1.5,
      price: 45.00,
      category: 'Tortas',
      tipoDeProducto: 'pasteleria',
      createdAt: now,
      createdBy: userId,
    },
    {
      id: generateId(),
      name: 'Cupcakes Vainilla',
      presentation: 'Bandeja de 6 unidades',
      weight: 0.8,
      price: 25.00,
      category: 'Pasteles',
      tipoDeProducto: 'pasteleria',
      createdAt: now,
      createdBy: userId,
    },
    {
      id: generateId(),
      name: 'Pan Integral',
      presentation: 'Bolsa de plástico',
      weight: 0.5,
      price: 8.50,
      category: 'Panes',
      tipoDeProducto: 'panaderia',
      createdAt: now,
      createdBy: userId,
    },
    {
      id: generateId(),
      name: 'Galletas de Avena',
      presentation: 'Paquete de 12 unidades',
      weight: 0.3,
      price: 15.00,
      category: 'Galletas',
      tipoDeProducto: 'panaderia',
      createdAt: now,
      createdBy: userId,
    },
    {
      id: generateId(),
      name: 'Cheesecake Frutos Rojos',
      presentation: 'Envase de vidrio',
      weight: 1.2,
      price: 38.00,
      category: 'Postres',
      tipoDeProducto: 'pasteleria',
      createdAt: now,
      createdBy: userId,
    },
    {
      id: generateId(),
      name: 'Brownie con Nueces',
      presentation: 'Caja cuadrada',
      weight: 0.6,
      price: 20.00,
      category: 'Postres',
      tipoDeProducto: 'pasteleria',
      createdAt: now,
      createdBy: userId,
    }
  ];
};

export const createSampleUsers = (adminId: string): User[] => {
  const now = new Date();
  
  return [
    {
      id: generateId(),
      username: 'local1',
      password: 'local123',
      profile: 'local',
      createdAt: now,
      createdBy: adminId,
    },
    {
      id: generateId(),
      username: 'local2',
      password: 'local123',
      profile: 'local',
      createdAt: now,
      createdBy: adminId,
    },
    {
      id: generateId(),
      username: 'fabrica1',
      password: 'fabrica123',
      profile: 'fabrica',
      createdAt: now,
      createdBy: adminId,
    }
  ];
};

export const createSampleOrders = (users: User[], products: Product[]): Order[] => {
  if (users.length === 0 || products.length === 0) return [];
  
  const now = new Date();
  const localUsers = users.filter(u => u.profile === 'local');
  
  const orders: Order[] = [];
  
  // Crear algunos pedidos de muestra
  localUsers.forEach((localUser, index) => {
    // Pedido 1: Nuevo pedido
    const items1: OrderItem[] = [
      {
        productId: products[0].id,
        product: products[0],
        quantity: 2,
        unitPrice: products[0].price,
        subtotal: products[0].price * 2
      },
      {
        productId: products[1].id,
        product: products[1],
        quantity: 1,
        unitPrice: products[1].price,
        subtotal: products[1].price * 1
      }
    ];
    
    const order1: Order = {
      id: generateId(),
      date: new Date(now.getTime() - index * 24 * 60 * 60 * 1000),
      clientId: localUser.id,
      client: localUser,
      items: items1,
      total: items1.reduce((sum, item) => sum + item.subtotal, 0),
      notes: `Pedido de muestra ${index + 1}`,
      tipoDeOrder: 'pasteleria',
      status: 'nuevo pedido',
      createdAt: new Date(now.getTime() - index * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - index * 24 * 60 * 60 * 1000)
    };
    
    orders.push(order1);
    
    // Pedido 2: En fabricación
    if (index === 0) {
      const items2: OrderItem[] = [
        {
          productId: products[2].id,
          product: products[2],
          quantity: 3,
          unitPrice: products[2].price,
          subtotal: products[2].price * 3
        }
      ];
      
      const order2: Order = {
        id: generateId(),
        date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        clientId: localUser.id,
        client: localUser,
        items: items2,
        total: items2.reduce((sum, item) => sum + item.subtotal, 0),
        notes: 'Pedido urgente para mañana',
        tipoDeOrder: 'panaderia',
        status: 'en fabricacion',
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      };
      
      orders.push(order2);
    }
  });
  
  return orders;
}; 