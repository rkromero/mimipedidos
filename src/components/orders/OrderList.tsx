import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../hooks/useApp';
import type { Order } from '../../types';
import OrderDetail from './OrderDetail';

const OrderList: React.FC = () => {
  const { user } = useAuth();
  const { orders } = useApp();
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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

  const getFilteredOrders = () => {
    let filtered = orders;

    // Filtrar por perfil de usuario
    if (user?.profile === 'local') {
      filtered = filtered.filter(order => order.clientId === user.id);
    } else if (user?.profile === 'fabrica') {
      filtered = filtered.filter(order => order.status === 'en fabricacion');
    }

    // Filtrar por estado seleccionado
    if (selectedStatus) {
      filtered = filtered.filter(order => order.status === selectedStatus);
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const getTitle = () => {
    switch (user?.profile) {
      case 'dueño':
        return 'Gestión de Pedidos';
      case 'local':
        return 'Mis Pedidos';
      case 'fabrica':
        return 'Pedidos en Fabricación';
      default:
        return 'Pedidos';
    }
  };

  const getEmptyMessage = () => {
    switch (user?.profile) {
      case 'local':
        return 'No tienes pedidos creados';
      case 'fabrica':
        return 'No hay pedidos en fabricación';
      default:
        return 'No hay pedidos disponibles';
    }
  };

  const filteredOrders = getFilteredOrders();

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">{getTitle()}</h1>
        
        {/* Filtros */}
        <div className="flex space-x-4">
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-48"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="nuevo pedido">Nuevo Pedido</option>
            <option value="aceptado">Aceptado</option>
            <option value="en fabricacion">En Fabricación</option>
            <option value="terminado">Terminado</option>
            <option value="entregado">Entregado</option>
            <option value="completo">Completo</option>
          </select>
        </div>
      </div>

      {/* Lista de pedidos */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{getEmptyMessage()}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Número de Pedido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr 
                    key={order.id} 
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{order.id.slice(-8)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.date instanceof Date 
                        ? order.date.toLocaleDateString() 
                        : new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.client.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                      ${order.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Información adicional */}
      {filteredOrders.length > 0 && (
        <div className="mt-4 text-sm text-gray-600 flex items-center justify-between">
          <span>
            Haz click en cualquier pedido para ver los detalles
          </span>
          <span>
            {filteredOrders.length} pedido{filteredOrders.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Modal de detalle */}
      {selectedOrder && (
        <OrderDetail
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default OrderList; 