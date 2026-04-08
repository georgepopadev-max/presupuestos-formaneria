import React, { useState } from 'react';
import type { Cliente } from '../../types';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

// Props para el componente ClientForm
interface ClientFormProps {
  initialData?: Partial<Cliente>;
  onSubmit: (data: Omit<Cliente, 'id' | 'createdAt'>) => void;
  onCancel?: () => void;
}

/**
 * Formulario para crear o editar clientes
 */
export function ClientForm({ initialData, onSubmit, onCancel }: ClientFormProps) {
  const [nombre, setNombre] = useState(initialData?.nombre || '');
  const [cif, setCif] = useState(initialData?.cif || '');
  const [direccion, setDireccion] = useState(initialData?.direccion || '');
  const [telefono, setTelefono] = useState(initialData?.telefono || '');
  const [email, setEmail] = useState(initialData?.email || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      nombre,
      cif,
      direccion,
      telefono,
      email,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nombre */}
      <Input
        label="Nombre / Razón social"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre del cliente o empresa"
        required
      />

      {/* CIF */}
      <Input
        label="CIF / NIF"
        value={cif}
        onChange={(e) => setCif(e.target.value.toUpperCase())}
        placeholder="B12345678"
        required
        maxLength={9}
      />

      {/* Dirección */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Dirección
        </label>
        <textarea
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          placeholder="Dirección completa"
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Teléfono */}
      <Input
        label="Teléfono"
        type="tel"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        placeholder="600123456"
      />

      {/* Email */}
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="cliente@ejemplo.com"
      />

      {/* Botones */}
      <div className="flex justify-end gap-4 pt-4 border-t">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit">
          {initialData?.id ? 'Actualizar' : 'Crear'} cliente
        </Button>
      </div>
    </form>
  );
}

export default ClientForm;