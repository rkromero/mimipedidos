import React from 'react';
import { useApp } from '../../hooks/useApp';
import { CheckIcon, FactoryIcon } from '../layout/Icons';
import type { Order } from '../../types';

const FactoryInterface: React.FC = () => {
  const { orders, updateOrderStatus } = useApp();

  const fabricationOrders = orders.filter(order => order.status === 'en fabricacion');

  const handleCompleteOrder = (orderId: string) => {
    if (window.confirm('¿Marcar este pedido como terminado?')) {
      updateOrderStatus(orderId, 'terminado');
    }
  };

  const getOrderPriority = (order: Order) => {
    const daysSinceCreated = Math.floor((new Date().getTime() - new Date(order.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceCreated >= 3) return 'alta';
    if (daysSinceCreated >= 1) return 'media';
    return 'baja';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta':
        return 'bg-red-100 text-red-800';
      case 'media':
        return 'bg-yellow-100 text-yellow-800';
      case 'baja':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'alta':
        return 'Prioridad Alta';
      case 'media':
        return 'Prioridad Media';
      case 'baja':
        return 'Prioridad Baja';
      default:
        return 'Sin Prioridad';
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center mb-6">
        <FactoryIcon size={32} className="mr-3 text-primary-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Área de Fabricación</h1>
          <p className="text-gray-600">Pedidos listos para producir</p>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">En Fabricación</p>
              <p className="text-2xl font-bold text-gray-900">{fabricationOrders.length}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <FactoryIcon size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Prioridad Alta</p>
              <p className="text-2xl font-bold text-red-600">
                {fabricationOrders.filter(order => getOrderPriority(order) === 'alta').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 font-bold">!</span>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Productos Totales</p>
              <p className="text-2xl font-bold text-gray-900">
                {fabricationOrders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold">#</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de pedidos */}
      <div className="space-y-4">
        {fabricationOrders.length === 0 ? (
          <div className="text-center py-12">
            <FactoryIcon size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">No hay pedidos en fabricación</p>
            <p className="text-gray-400 text-sm">Los pedidos aparecerán aquí cuando el dueño los acepte</p>
          </div>
        ) : (
          fabricationOrders
            .sort((a, b) => {
              const priorityOrder = { alta: 3, media: 2, baja: 1 };
              const aPriority = getOrderPriority(a);
              const bPriority = getOrderPriority(b);
              return priorityOrder[bPriority] - priorityOrder[aPriority];
            })
            .map((order) => {
              const priority = getOrderPriority(order);
              return (
                <div key={order.id} className="card border-l-4 border-l-yellow-400">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Pedido #{order.id.slice(-8)}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(priority)}`}>
                          {getPriorityLabel(priority)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        Cliente: {order.client.username}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        Fecha del pedido: {new Date(order.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Total: ${order.total.toFixed(2)}
                      </p>
                    </div>

                    <div className="mt-4 lg:mt-0">
                      <button
                        onClick={() => handleCompleteOrder(order.id)}
                        className="w-full lg:w-auto btn-primary flex items-center justify-center"
                      >
                        <CheckIcon size={20} className="mr-2" />
                        Marcar como Terminado
                      </button>
                    </div>
                  </div>

                  {/* Detalles de productos */}
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-medium text-gray-900 mb-3">Productos a fabricar:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">{item.product.name}</h5>
                              <p className="text-sm text-gray-600">{item.product.presentation}</p>
                            </div>
                            <span className="text-lg font-bold text-primary-600">x{item.quantity}</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            <p>Peso unit.: {item.product.weight} kg</p>
                            <p>Peso total: {(item.product.weight * item.quantity).toFixed(2)} kg</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {order.notes && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Notas del cliente:</strong> {order.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
};

export default FactoryInterface; 