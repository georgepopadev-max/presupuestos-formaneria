import React, { useState, useEffect } from 'react';
import type { LineaPresupuesto, Cliente } from '../../types';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';

// Props para el componente BudgetForm
interface BudgetFormProps {
  clientes: Cliente[];
  initialData?: Partial<{
    clienteId: string;
    lineas: LineaPresupuesto[];
    estado: string;
    tipoIva: string;
  }>;
  onSubmit: (data: {
    clienteId: string;
    lineas: LineaPresupuesto[];
    estado: string;
    fechaValidez: string;
    tipoIva: string;
  }) => void;
  onCancel?: () => void;
}

/**
 * Formulario para crear o editar presupuestos
 */
let lineIdCounter = Date.now();
const generateLineId = () => ++lineIdCounter;

const BudgetForm: React.FC<BudgetFormProps> = ({ clientes, initialData, onSubmit, onCancel }) => {
  const [clienteId, setClienteId] = useState(initialData?.clienteId || '');
  const [lineas, setLineas] = useState<LineaPresupuesto[]>(initialData?.lineas || []);
  const [estado, setEstado] = useState(initialData?.estado || 'borrador');
  const [tipoIva, setTipoIva] = useState(initialData?.tipoIva || 'general');

  // Actualizar tipoIva de todas las líneas cuando cambia el tipo global
  useEffect(() => {
    if (lineas.length > 0) {
      setLineas(prev => prev.map(l => ({ ...l, tipoIva })));
    }
  }, [tipoIva]);

  // Estados de presupuesto
  const estadoOptions = [
    { value: 'borrador', label: 'Borrador' },
    { value: 'enviado', label: 'Enviado' },
    { value: 'aceptado', label: 'Aceptado' },
    { value: 'rechazado', label: 'Rechazado' },
    { value: 'facturado', label: 'Facturado' },
  ];

  const handleAddLinea = () => {
    const nuevaLinea: LineaPresupuesto = {
      id: generateLineId(),
      descripcion: '',
      cantidad: 1,
      precioUnitario: 0,
      importe: 0,
    };
    nuevaLinea.tipoIva = tipoIva;
    setLineas([...lineas, nuevaLinea]);
  };

  const handleUpdateLinea = (index: number, updates: Partial<LineaPresupuesto>) => {
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

    // Validar cantidad > 0 y precioUnitario >= 0
    for (const linea of lineas) {
      if (linea.cantidad <= 0) {
        alert('La cantidad debe ser mayor que 0');
        return;
      }
      if (linea.precioUnitario < 0) {
        alert('El precio unitario no puede ser negativo');
        return;
      }
    }

    const fechaValidez = new Date();
    fechaValidez.setDate(fechaValidez.getDate() + 30);

    onSubmit({
      clienteId,
      lineas,
      estado,
      fechaValidez: fechaValidez.toISOString().split('T')[0],
      tipoIva,
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

      {/* Estado */}
      <Select
        label="Estado"
        options={estadoOptions}
        value={estado}
        onChange={(e) => setEstado(e.target.value)}
      />

      {/* Tipo de IVA */}
      <Select
        label="Tipo de IVA"
        options={[
          { value: 'general', label: '21% General' },
          { value: 'reducido', label: '10% Reducido' },
          { value: 'superreducido', label: '4% Superreducido' },
          { value: 'exento', label: 'Exento' },
        ]}
        value={tipoIva}
        onChange={(e) => setTipoIva(e.target.value)}
      />

      {/* Líneas del presupuesto */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Líneas del presupuesto</h3>
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
          Guardar presupuesto
        </Button>
      </div>
    </form>
  );
}

export default BudgetForm;