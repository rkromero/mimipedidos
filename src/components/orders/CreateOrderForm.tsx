import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../hooks/useApp';
import { PlusIcon, DeleteIcon } from '../layout/Icons';
import type { Product, OrderItem } from '../../types';

const CreateOrderForm: React.FC = () => {
  const { user } = useAuth();
  const { products, users, createOrder } = useApp();
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addProduct = (product: Product) => {
    const existingItem = selectedItems.find(item => item.productId === product.id);
    
    if (existingItem) {
      setSelectedItems(prev => 
        prev.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.unitPrice }
            : item
        )
      );
    } else {
      const newItem: OrderItem = {
        productId: product.id,
        product: product,
        quantity: 1,
        unitPrice: product.price,
        subtotal: product.price
      };
      setSelectedItems(prev => [...prev, newItem]);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    
    setSelectedItems(prev =>
      prev.map(item =>
        item.productId === productId
          ? { ...item, quantity, subtotal: quantity * item.unitPrice }
          : item
      )
    );
  };

  const removeItem = (productId: string) => {
    setSelectedItems(prev => prev.filter(item => item.productId !== productId));
  };

  const getTotalAmount = () => {
    return selectedItems.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedItems.length === 0) {
      alert('Debes agregar al menos un producto al pedido');
      return;
    }

    setIsSubmitting(true);

    try {
      const currentUser = users.find(u => u.id === user?.id);
      if (!currentUser) {
        throw new Error('Usuario no encontrado');
      }

      createOrder({
        date: new Date(),
        clientId: user!.id,
        client: currentUser,
        items: selectedItems,
        total: getTotalAmount(),
        notes,
        status: 'nuevo pedido'
      });

      // Limpiar formulario
      setSelectedItems([]);
      setNotes('');
      setSearchTerm('');
      
      alert('Pedido creado exitosamente');
    } catch (error) {
      console.error('Error al crear pedido:', error);
      alert('Error al crear el pedido. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Crear Nuevo Pedido</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Búsqueda de productos */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Seleccionar Productos</h2>
          
          <div className="mb-4">
            <input
              type="text"
              placeholder="Buscar productos..."
              className="input-field"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-80 overflow-y-auto">
            {filteredProducts.map((product) => (
              <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.presentation}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => addProduct(product)}
                    className="p-2 text-primary-600 hover:text-primary-700"
                  >
                    <PlusIcon size={20} />
                  </button>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{product.category}</span>
                  <span className="font-semibold text-green-600">${product.price.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Productos seleccionados */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Productos Seleccionados</h2>
          
          {selectedItems.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No has seleccionado productos</p>
          ) : (
            <div className="space-y-3">
              {selectedItems.map((item) => (
                <div key={item.productId} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                    <p className="text-sm text-gray-600">{item.product.presentation}</p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${item.subtotal.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">${item.unitPrice.toFixed(2)} c/u</p>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="p-2 text-red-600 hover:text-red-700"
                    >
                      <DeleteIcon size={16} />
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-green-600">${getTotalAmount().toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notas */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Notas del Pedido</h2>
          <textarea
            className="input-field"
            rows={3}
            placeholder="Agregar notas o instrucciones especiales..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Botones */}
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => {
              setSelectedItems([]);
              setNotes('');
              setSearchTerm('');
            }}
            className="flex-1 btn-secondary"
            disabled={isSubmitting}
          >
            Limpiar
          </button>
          <button
            type="submit"
            className="flex-1 btn-primary"
            disabled={selectedItems.length === 0 || isSubmitting}
          >
            {isSubmitting ? 'Creando Pedido...' : 'Crear Pedido'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateOrderForm; 