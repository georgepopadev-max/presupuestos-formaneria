import React, { useState } from 'react';
import type { Material } from '../../types';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';

// Props para el componente MaterialForm
interface MaterialFormProps {
  proveedores?: Array<{ id: string; nombre: string }>;
  initialData?: Partial<Material>;
  onSubmit: (data: Omit<Material, 'id' | 'createdAt'>) => void;
  onCancel?: () => void;
}

/**
 * Formulario para crear o editar materiales
 */
export function MaterialForm({ proveedores = [], initialData, onSubmit, onCancel }: MaterialFormProps) {
  const [nombre, setNombre] = useState(initialData?.nombre || '');
  const [descripcion, setDescripcion] = useState(initialData?.descripcion || '');
  const [precioUnitario, setPrecioUnitario] = useState(initialData?.precioUnitario || 0);
  const [unidadMedida, setUnidadMedida] = useState(initialData?.unidadMedida || 'ud');
  const [proveedorId, setProveedorId] = useState(initialData?.proveedorId || '');
  const [stock, setStock] = useState(initialData?.stock || 0);

  // Unidades comunes
  const unidadOptions = [
    { value: 'ud', label: 'Unidades' },
    { value: 'm', label: 'Metros' },
    { value: 'kg', label: 'Kilogramos' },
    { value: 'l', label: 'Litros' },
    { value: 'm2', label: 'Metros cuadrados' },
    { value: 'm3', label: 'Metros cúbicos' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      nombre,
      descripcion,
      precioUnitario,
      unidadMedida,
      proveedorId: proveedorId || undefined,
      stock,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nombre */}
      <Input
        label="Nombre del material"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Ej: Tubo PVC 32mm"
        required
      />

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Descripción detallada del material"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Precio y unidad */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Precio unitario (€)"
          type="number"
          step="0.01"
          min={0}
          value={precioUnitario}
          onChange={(e) => setPrecioUnitario(Number(e.target.value))}
          required
        />
        <Select
          label="Unidad"
          options={unidadOptions}
          value={unidadMedida}
          onChange={(e) => setUnidadMedida(e.target.value)}
        />
      </div>

      {/* Proveedor */}
      {Array.isArray(proveedores) && proveedores.length > 0 && (
        <Select
          label="Proveedor"
          options={proveedores.map(p => ({ value: p.id, label: p.nombre }))}
          value={proveedorId}
          onChange={(e) => setProveedorId(e.target.value)}
          placeholder="Seleccione un proveedor (opcional)"
        />
      )}

      {/* Stock */}
      <Input
        label="Stock actual"
        type="number"
        min={0}
        value={stock}
        onChange={(e) => setStock(Number(e.target.value))}
      />

      {/* Botones */}
      <div className="flex justify-end gap-4 pt-4 border-t">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit">
          {initialData?.id ? 'Actualizar' : 'Crear'} material
        </Button>
      </div>
    </form>
  );
}

export default MaterialForm;