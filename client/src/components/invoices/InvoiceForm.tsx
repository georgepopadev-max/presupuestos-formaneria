import React, { useState } from 'react';
import type { LineaFactura, Cliente } from '../../types';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';

// Props para el componente InvoiceForm
interface InvoiceFormProps {
  clientes: Cliente[];
  presupuestoId?: string;
  initialData?: Partial<{
    clienteId: string;
    lineas: LineaFactura[];
    fechaVencimiento: string;
  }>;
  onSubmit: (data: {
    clienteId: string;
    lineas: LineaFactura[];
    fechaVencimiento: string;
    presupuestoId?: string;
  }) => void;
  onCancel?: () => void;
}

/**
 * Formulario para crear o editar facturas
 */
export function InvoiceForm({ clientes, presupuestoId, initialData, onSubmit, onCancel }: InvoiceFormProps) {
  const [clienteId, setClienteId] = useState(initialData?.clienteId || '');
  const [lineas, setLineas] = useState<LineaFactura[]>(initialData?.lineas || []);
  
  // Fecha de vencimiento por defecto (30 días)
  const defaultVencimiento = initialData?.fechaVencimiento || (() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
  })();
  const [fechaVencimiento, setFechaVencimiento] = useState(defaultVencimiento);

  const handleAddLinea = () => {
    const nuevaLinea: LineaFactura = {
      id: crypto.randomUUID(),
      descripcion: '',
      cantidad: 1,
      precioUnitario: 0,
      importe: 0,
    };
    setLineas([...lineas, nuevaLinea]);
  };

  const handleUpdateLinea = (index: number, updates: Partial<LineaFactura>) => {
    setLineas(prev => prev.map((linea, i) => {
      if (i !== index) return linea;
      const updated = { ...linea, ...updates };
      updated.importe = updated.cantidad * updated.precioUnitario;
      return updated;
    }));
  };

  const handleRemoveLinea = (index: number) => {
    setLineas(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      clienteId,
      lineas,
      fechaVencimiento,
      presupuestoId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Selector de cliente */}
      <Select
        label="Cliente"
        options={(Array.isArray(clientes) ? clientes : []).map(c => ({ value: c.id, label: c.nombre }))}
        value={clienteId}
        onChange={(e) => setClienteId(e.target.value)}
        placeholder="Seleccione un cliente"
      />

      {/* Fecha de vencimiento */}
      <Input
        label="Fecha de vencimiento"
        type="date"
        value={fechaVencimiento}
        onChange={(e) => setFechaVencimiento(e.target.value)}
      />

      {/* Líneas de la factura */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Líneas de la factura</h3>
          <Button type="button" variant="outline" size="sm" onClick={handleAddLinea}>
            + Añadir línea
          </Button>
        </div>
        
        {lineas.map((linea, index) => (
          <div key={linea.id} className="flex gap-4 items-start bg-gray-50 p-4 rounded-lg">
            <div className="flex-1">
              <Input
                label="Descripción"
                value={linea.descripcion}
                onChange={(e) => handleUpdateLinea(index, { descripcion: e.target.value })}
                placeholder="Descripción del trabajo o material"
              />
            </div>
            <div className="w-24">
              <Input
                label="Cantidad"
                type="number"
                min={1}
                value={linea.cantidad}
                onChange={(e) => handleUpdateLinea(index, { cantidad: Number(e.target.value) })}
              />
            </div>
            <div className="w-32">
              <Input
                label="Precio ud."
                type="number"
                step="0.01"
                value={linea.precioUnitario}
                onChange={(e) => handleUpdateLinea(index, { precioUnitario: Number(e.target.value) })}
              />
            </div>
            <div className="w-32 pt-6 text-right font-medium">
              {(linea.cantidad * linea.precioUnitario).toFixed(2)} €
            </div>
            <button
              type="button"
              onClick={() => handleRemoveLinea(index)}
              className="mt-6 text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end gap-4 pt-4 border-t">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit">
          Emitir factura
        </Button>
      </div>
    </form>
  );
}

export default InvoiceForm;