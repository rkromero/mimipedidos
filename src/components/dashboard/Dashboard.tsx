import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../hooks/useApp';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { orders, products, users } = useApp();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'nuevo pedido':
        return 'bg-blue-100 text-blue-800';
      case 'aceptado':
        return 'bg-green-100 text-green-800';
      case 'en fabricacion':
        return 'bg-yellow-100 text-yellow-800';
      case 'terminado':
        return 'bg-purple-100 text-purple-800';
      case 'entregado':
        return 'bg-indigo-100 text-indigo-800';
      case 'completo':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProfileSpecificData = () => {
    if (user?.profile === 'dueño') {
      return {
        title: 'Panel de Administración',
        stats: [
          { label: 'Total Pedidos', value: orders.length },
          { label: 'Total Productos', value: products.length },
          { label: 'Total Usuarios', value: users.length },
        ],
        recentOrders: orders.slice(0, 5)
      };
    } else if (user?.profile === 'local') {
      const userOrders = orders.filter(order => order.clientId === user.id);
      return {
        title: 'Mis Pedidos',
        stats: [
          { label: 'Mis Pedidos', value: userOrders.length },
          { label: 'Pendientes', value: userOrders.filter(o => o.status === 'nuevo pedido').length },
          { label: 'En Proceso', value: userOrders.filter(o => ['aceptado', 'en fabricacion'].includes(o.status)).length },
        ],
        recentOrders: userOrders.slice(0, 5)
      };
    } else if (user?.profile === 'fabrica') {
      const factoryOrders = orders.filter(order => order.status === 'en fabricacion');
      return {
        title: 'Órdenes de Fabricación',
        stats: [
          { label: 'En Fabricación', value: factoryOrders.length },
          { label: 'Terminados Hoy', value: orders.filter(o => o.status === 'terminado').length },
          { label: 'Total Procesados', value: orders.filter(o => ['terminado', 'entregado', 'completo'].includes(o.status)).length },
        ],
        recentOrders: factoryOrders.slice(0, 5)
      };
    }
    return { title: 'Dashboard', stats: [], recentOrders: [] };
  };

  const data = getProfileSpecificData();

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{data.title}</h1>
        <p className="text-gray-600">
          Bienvenido, {user?.username} ({user?.profile})
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {data.stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-bold">{stat.value}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Pedidos Recientes</h2>
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            Ver todos
          </button>
        </div>
        
        {data.recentOrders.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay pedidos recientes</p>
        ) : (
          <div className="space-y-3">
            {data.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    Pedido #{order.id.slice(-8)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.client.username} - {order.items.length} productos
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    ${order.total.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 