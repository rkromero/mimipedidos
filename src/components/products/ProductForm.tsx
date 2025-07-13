import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../hooks/useApp';
import type { Product } from '../../types';

interface ProductFormProps {
  product?: Product;
  onSubmit: () => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit, onCancel }) => {
  const { user } = useAuth();
  const { createProduct, updateProduct } = useApp();
  
  const [formData, setFormData] = useState({
    name: product?.name || '',
    presentation: product?.presentation || '',
    weight: product?.weight || 0,
    price: product?.price || 0,
    category: product?.category || '',
    tipoDeProducto: product?.tipoDeProducto || 'panaderia' as 'panaderia' | 'pasteleria',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (product) {
        updateProduct(product.id, formData);
      } else {
        createProduct({
          ...formData,
          createdBy: user!.id,
        });
      }
      onSubmit();
    } catch (error) {
      console.error('Error al guardar producto:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'weight' || name === 'price' ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {product ? 'Editar Producto' : 'Agregar Producto'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="input-field"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej: Torta de chocolate"
              />
            </div>

            <div>
              <label htmlFor="presentation" className="block text-sm font-medium text-gray-700 mb-1">
                Presentación *
              </label>
              <input
                id="presentation"
                name="presentation"
                type="text"
                required
                className="input-field"
                value={formData.presentation}
                onChange={handleChange}
                placeholder="Ej: Caja de cartón"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                  Peso (kg) *
                </label>
                <input
                  id="weight"
                  name="weight"
                  type="number"
                  step="0.1"
                  min="0"
                  required
                  className="input-field"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="0.5"
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Precio ($) *
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  className="input-field"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="25.00"
                />
              </div>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Categoría *
              </label>
              <select
                id="category"
                name="category"
                required
                className="input-field"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Seleccionar categoría</option>
                <option value="Tortas">Tortas</option>
                <option value="Pasteles">Pasteles</option>
                <option value="Galletas">Galletas</option>
                <option value="Panes">Panes</option>
                <option value="Postres">Postres</option>
                <option value="Bebidas">Bebidas</option>
                <option value="Otros">Otros</option>
              </select>
            </div>

            <div>
              <label htmlFor="tipoDeProducto" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Producto *
              </label>
              <select
                id="tipoDeProducto"
                name="tipoDeProducto"
                required
                className="input-field"
                value={formData.tipoDeProducto}
                onChange={handleChange}
              >
                <option value="panaderia">🥖 Panadería</option>
                <option value="pasteleria">🍰 Pastelería</option>
              </select>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 btn-secondary"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Guardando...' : product ? 'Actualizar' : 'Agregar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm; 