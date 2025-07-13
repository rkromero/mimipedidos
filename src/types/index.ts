export interface User {
  id: string;
  username: string;
  password: string;
  profile: 'dueño' | 'local' | 'fabrica';
  createdAt: Date;
  createdBy?: string;
}

export interface Product {
  id: string;
  name: string;
  presentation: string;
  weight: number;
  price: number;
  category: string;
  tipoDeProducto: 'panaderia' | 'pasteleria';
  createdAt: Date;
  createdBy: string;
}

export interface OrderItem {
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: string;
  date: Date;
  clientId: string;
  client: User;
  items: OrderItem[];
  total: number;
  notes: string;
  tipoDeOrder: 'panaderia' | 'pasteleria';
  status: 'nuevo pedido' | 'aceptado' | 'en fabricacion' | 'terminado' | 'entregado' | 'completo';
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface AppContextType {
  users: User[];
  products: Product[];
  orders: Order[];
  createUser: (userData: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (userId: string, userData: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  createProduct: (productData: Omit<Product, 'id' | 'createdAt'>) => void;
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  deleteProduct: (productId: string) => void;
  updateProduct: (productId: string, productData: Partial<Product>) => void;
} 