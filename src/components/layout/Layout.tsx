import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { 
  HomeIcon, 
  ShoppingCartIcon, 
  PackageIcon, 
  UsersIcon, 
  ClipboardIcon, 
  FactoryIcon, 
  LogoutIcon, 
  MenuIcon 
} from './Icons';
import Dashboard from '../dashboard/Dashboard';
import ProductList from '../products/ProductList';
import OrderList from '../orders/OrderList';
import CreateOrderForm from '../orders/CreateOrderForm';
import FactoryInterface from '../factory/FactoryInterface';
import UserList from '../users/UserList';

interface LayoutProps {
  children?: ReactNode;
}

interface NavigationItem {
  id: string;
  label: string;
  icon: React.FC<{ className?: string; size?: number }>;
  path: string;
  profiles: string[];
}

const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: HomeIcon,
    path: '/dashboard',
    profiles: ['dueño', 'local', 'fabrica']
  },
  {
    id: 'orders',
    label: 'Pedidos',
    icon: ShoppingCartIcon,
    path: '/orders',
    profiles: ['dueño', 'local', 'fabrica']
  },
  {
    id: 'products',
    label: 'Productos',
    icon: PackageIcon,
    path: '/products',
    profiles: ['dueño']
  },
  {
    id: 'users',
    label: 'Usuarios',
    icon: UsersIcon,
    path: '/users',
    profiles: ['dueño']
  },
  {
    id: 'create-order',
    label: 'Crear Pedido',
    icon: ClipboardIcon,
    path: '/create-order',
    profiles: ['local']
  },
  {
    id: 'factory',
    label: 'Fabricación',
    icon: FactoryIcon,
    path: '/factory',
    profiles: ['fabrica']
  }
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const [activeItem, setActiveItem] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!user) return null;

  const filteredNavItems = navigationItems.filter(item => 
    item.profiles.includes(user.profile)
  );

  const handleNavClick = (itemId: string) => {
    setActiveItem(itemId);
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
  };

  const renderContent = () => {
    if (children) return children;
    
    switch (activeItem) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <ProductList />;
      case 'orders':
        return <OrderList />;
      case 'users':
        return <UserList />;
      case 'create-order':
        return <CreateOrderForm />;
      case 'factory':
        return <FactoryInterface />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h2 className="text-xl font-bold text-gray-800">MimiPedidos</h2>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeItem === item.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon
                      className={`mr-3 flex-shrink-0 h-6 w-6 ${
                        activeItem === item.id ? 'text-primary-500' : 'text-gray-400'
                      }`}
                    />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center w-full">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{user.username}</p>
                <p className="text-xs text-gray-500 capitalize">{user.profile}</p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-3 p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <LogoutIcon size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden">
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 py-2">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-800">MimiPedidos</h1>
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <MenuIcon size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div className="fixed inset-0 flex z-40 md:hidden">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsSidebarOpen(false)} />
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                >
                  <span className="sr-only">Cerrar menú</span>
                  <MenuIcon className="h-6 w-6 text-white" />
                </button>
              </div>
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <nav className="mt-5 px-2 space-y-1">
                  {filteredNavItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors ${
                          activeItem === item.id
                            ? 'bg-primary-100 text-primary-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <Icon
                          className={`mr-4 flex-shrink-0 h-6 w-6 ${
                            activeItem === item.id ? 'text-primary-500' : 'text-gray-400'
                          }`}
                        />
                        {item.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
              <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                <div className="flex items-center w-full">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{user.username}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.profile}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="ml-3 p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <LogoutIcon size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1 pb-20 md:pb-0">
          {renderContent()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          {filteredNavItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`nav-link ${activeItem === item.id ? 'active' : ''}`}
              >
                <Icon size={20} className="mb-1" />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Layout; 