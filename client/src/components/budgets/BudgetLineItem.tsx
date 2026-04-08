
import type { LineaPresupuesto } from '../../types';
import { Input } from '../common/Input';
import { formatCurrency } from '../../utils/formatters';

// Props para el componente BudgetLineItem
interface BudgetLineItemProps {
  linea: LineaPresupuesto;
  onUpdate: (updates: Partial<LineaPresupuesto>) => void;
  onRemove: () => void;
  readOnly?: boolean;
}

/**
 * Componente para mostrar/editar una línea individual de presupuesto
 */
export function BudgetLineItem({
  linea,
  onUpdate,
  onRemove,
  readOnly = false,
}: BudgetLineItemProps) {
  const handleCantidadChange = (value: number) => {
    onUpdate({ cantidad: value });
  };

  const handlePrecioChange = (value: number) => {
    onUpdate({ precioUnitario: value });
  };

  return (
    <div className="flex gap-4 items-start bg-white border rounded-lg p-4">
      {/* Descripción */}
      <div className="flex-1">
        {readOnly ? (
          <p className="font-medium text-gray-900">{linea.descripcion}</p>
        ) : (
          <Input
            label="Descripción"
            value={linea.descripcion}
            onChange={(e) => onUpdate({ descripcion: e.target.value })}
            placeholder="Descripción del trabajo o material"
          />
        )}
      </div>

      {/* Cantidad */}
      <div className="w-24">
        {readOnly ? (
          <div>
            <p className="text-xs text-gray-500">Cantidad</p>
            <p className="font-medium">{linea.cantidad}</p>
          </div>
        ) : (
          <Input
            label="Cantidad"
            type="number"
            min={1}
            value={linea.cantidad}
            onChange={(e) => handleCantidadChange(Number(e.target.value))}
          />
        )}
      </div>

      {/* Precio unitario */}
      <div className="w-32">
        {readOnly ? (
          <div>
            <p className="text-xs text-gray-500">Precio ud.</p>
            <p className="font-medium">{formatCurrency(linea.precioUnitario)}</p>
          </div>
        ) : (
          <Input
            label="Precio ud."
            type="number"
            step="0.01"
            value={linea.precioUnitario}
            onChange={(e) => handlePrecioChange(Number(e.target.value))}
          />
        )}
      </div>

      {/* Importe (solo lectura) */}
      <div className="w-32 text-right">
        <p className="text-xs text-gray-500 mb-1">Importe</p>
        <p className="font-semibold text-lg">{formatCurrency(linea.importe)}</p>
      </div>

      {/* Botón eliminar */}
      {!readOnly && (
        <button
          type="button"
          onClick={onRemove}
          className="mt-6 text-red-500 hover:text-red-700 p-2"
          aria-label="Eliminar línea"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default BudgetLineItem;