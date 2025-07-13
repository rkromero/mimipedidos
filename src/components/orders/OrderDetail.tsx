import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../hooks/useApp';
import { CheckIcon, XIcon } from '../layout/Icons';
import type { Order } from '../../types';

interface OrderDetailProps {
  order: Order;
  onClose: () => void;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ order, onClose }) => {
  const { user } = useAuth();
  const { updateOrderStatus } = useApp();

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

  const canUpdateStatus = (order: Order) => {
    if (user?.profile === 'dueño') {
      return order.status === 'nuevo pedido' || order.status === 'terminado';
    } else if (user?.profile === 'fabrica') {
      return order.status === 'en fabricacion';
    }
    return false;
  };

  const handleAcceptOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'aceptado');
  };

  const handleRejectOrder = (orderId: string) => {
    if (window.confirm('¿Estás seguro de que quieres rechazar este pedido?')) {
      updateOrderStatus(orderId, 'nuevo pedido');
    }
  };

  const handleCompleteOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'terminado');
  };

  const handleDeliverOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'entregado');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-bold text-gray-900">
              Pedido #{order.id.slice(-8)}
            </h2>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors p-2"
          >
            <XIcon size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Información general */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Cliente</h3>
              <p className="text-lg font-semibold text-gray-900">{order.client.username}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Fecha</h3>
              <p className="text-lg font-semibold text-gray-900">
                {order.date instanceof Date 
                  ? order.date.toLocaleDateString() 
                  : new Date(order.date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Total</h3>
              <p className="text-lg font-semibold text-primary-600">${order.total.toFixed(2)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Productos</h3>
              <p className="text-lg font-semibold text-gray-900">{order.items.length} productos</p>
            </div>
          </div>

          {/* Productos */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Detalle de Productos</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                      <p className="text-sm text-gray-600">
                        {item.product.presentation} - {item.product.weight}g
                      </p>
                      <p className="text-sm text-gray-500">
                        ${item.unitPrice.toFixed(2)} x {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${item.subtotal.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-300 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total:</span>
                  <span className="text-lg font-bold text-primary-600">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notas */}
          {order.notes && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Notas</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-gray-700">{order.notes}</p>
              </div>
            </div>
          )}

          {/* Fechas de seguimiento */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Seguimiento</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                <strong>Creado:</strong> {order.createdAt instanceof Date 
                  ? order.createdAt.toLocaleDateString() 
                  : new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Actualizado:</strong> {order.updatedAt instanceof Date 
                  ? order.updatedAt.toLocaleDateString() 
                  : new Date(order.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        {canUpdateStatus(order) && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-wrap gap-2">
              {user?.profile === 'dueño' && order.status === 'nuevo pedido' && (
                <>
                  <button
                    onClick={() => handleAcceptOrder(order.id)}
                    className="btn-primary flex items-center text-sm"
                  >
                    <CheckIcon size={16} className="mr-1" />
                    Aceptar
                  </button>
                  <button
                    onClick={() => handleRejectOrder(order.id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center text-sm"
                  >
                    <XIcon size={16} className="mr-1" />
                    Rechazar
                  </button>
                </>
              )}
              {user?.profile === 'dueño' && order.status === 'terminado' && (
                <button
                  onClick={() => handleDeliverOrder(order.id)}
                  className="btn-primary flex items-center text-sm"
                >
                  <CheckIcon size={16} className="mr-1" />
                  Marcar como Entregado
                </button>
              )}
              {user?.profile === 'fabrica' && order.status === 'en fabricacion' && (
                <button
                  onClick={() => handleCompleteOrder(order.id)}
                  className="btn-primary flex items-center text-sm"
                >
                  <CheckIcon size={16} className="mr-1" />
                  Marcar como Terminado
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail; 