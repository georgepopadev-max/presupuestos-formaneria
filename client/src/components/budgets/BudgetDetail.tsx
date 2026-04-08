
import type { Presupuesto } from '../../types';
import { Button } from '../common/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { PRESUPUESTO_ESTADOS_LABELS, ESTADO_COLORS, IVA_TASAS } from '../../utils/constants';

// Props para el componente BudgetDetail
interface BudgetDetailProps {
  presupuesto: Presupuesto;
  onBack?: () => void;
  onEdit?: () => void;
  onClone?: () => void;
  onGenerateInvoice?: () => void;
}

/**
 * Componente para mostrar el detalle de un presupuesto
 */
export function BudgetDetail({
  presupuesto,
  onBack,
  onEdit,
  onClone,
  onGenerateInvoice,
}: BudgetDetailProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{presupuesto.numero}</h2>
          <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-medium ${ESTADO_COLORS[presupuesto.estado]}`}>
            {PRESUPUESTO_ESTADOS_LABELS[presupuesto.estado]}
          </span>
        </div>
        <div className="flex gap-2">
          {onBack && <Button variant="outline" onClick={onBack}>Volver</Button>}
          {onEdit && <Button variant="secondary" onClick={onEdit}>Editar</Button>}
          {onClone && <Button variant="outline" onClick={onClone}>Duplicar</Button>}
          {onGenerateInvoice && presupuesto.estado === 'aceptado' && (
            <Button onClick={onGenerateInvoice}>Generar factura</Button>
          )}
        </div>
      </div>

      {/* Información general */}
      <div className="px-6 py-4 grid grid-cols-2 gap-4 border-b">
        <div>
          <p className="text-sm text-gray-500">Cliente</p>
          <p className="font-medium">{presupuesto.cliente?.nombre}</p>
          <p className="text-sm text-gray-600">{presupuesto.cliente?.cif}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Fecha de creación</p>
          <p className="font-medium">{formatDate(presupuesto.fechaCreacion)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Fecha de validez</p>
          <p className="font-medium">{formatDate(presupuesto.fechaValidez)}</p>
        </div>
      </div>

      {/* Líneas del presupuesto */}
      <div className="px-6 py-4">
        <h3 className="text-lg font-medium mb-4">Líneas del presupuesto</h3>
        <table className="w-full">
          <thead>
            <tr className="text-left border-b">
              <th className="pb-2">Descripción</th>
              <th className="pb-2 text-right">Cantidad</th>
              <th className="pb-2 text-right">Precio ud.</th>
              <th className="pb-2 text-right">Importe</th>
            </tr>
          </thead>
          <tbody>
            {presupuesto.lineas.map((linea) => (
              <tr key={linea.id} className="border-b last:border-b-0">
                <td className="py-3">{linea.descripcion}</td>
                <td className="py-3 text-right">{linea.cantidad}</td>
                <td className="py-3 text-right">{formatCurrency(linea.precioUnitario)}</td>
                <td className="py-3 text-right font-medium">{formatCurrency(linea.importe)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totales */}
      <div className="px-6 py-4 bg-gray-50 border-t">
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span>{formatCurrency(presupuesto.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">IVA ({IVA_TASAS.GENERAL}%):</span>
              <span>{formatCurrency(presupuesto.iva)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span>{formatCurrency(presupuesto.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BudgetDetail;