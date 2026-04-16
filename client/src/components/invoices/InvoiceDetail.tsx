
import type { Factura, LineaFactura } from '../../types';
import { Button } from '../common/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { FACTURA_ESTADOS_LABELS, ESTADO_COLORS, IVA_TASAS } from '../../utils/constants';

// Mapping de tipoIva a tasa numérica
const TIPO_IVA_MAP: Record<string, number> = {
  general: IVA_TASAS.GENERAL,
  reducido: IVA_TASAS.REDUCIDO,
  super_reducido: IVA_TASAS.SUPER_REDUCIDO,
};

const getIvaLabel = (tipoIva: string): string => {
  const rate = TIPO_IVA_MAP[tipoIva] ?? IVA_TASAS.GENERAL;
  return `${rate}%`;
};

const getIvaRate = (tipoIva: string): number => {
  return TIPO_IVA_MAP[tipoIva] ?? IVA_TASAS.GENERAL;
};

// Props para el componente InvoiceDetail
interface InvoiceDetailProps {
  factura: Factura;
  onBack?: () => void;
  onEdit?: () => void;
  onDownloadPDF?: () => void;
  onMarkPaid?: () => void;
}

/**
 * Componente para mostrar el detalle de una factura
 */
export function InvoiceDetail({
  factura,
  onBack,
  onEdit,
  onDownloadPDF,
  onMarkPaid,
}: InvoiceDetailProps) {
  // Calcular breakdown de IVA por tipo
  const ivaBreakdown = (factura.lineas ?? []).reduce<Record<string, number>>((acc, linea) => {
    const rate = getIvaRate(linea.tipoIva);
    const tipoKey = `${rate}%`;
    const lineaIva = linea.importe * (rate / 100);
    acc[tipoKey] = (acc[tipoKey] ?? 0) + lineaIva;
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{factura.numero}</h2>
          <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-medium ${ESTADO_COLORS[factura.estado]}`}>
            {FACTURA_ESTADOS_LABELS[factura.estado]}
          </span>
        </div>
        <div className="flex gap-2">
          {onBack && <Button variant="outline" onClick={onBack}>Volver</Button>}
          {onEdit && <Button variant="secondary" onClick={onEdit}>Editar</Button>}
          {onDownloadPDF && <Button variant="outline" onClick={onDownloadPDF}>Descargar PDF</Button>}
          {onMarkPaid && factura.estado !== 'pagada' && (
            <Button onClick={onMarkPaid}>Marcar como pagada</Button>
          )}
        </div>
      </div>

      {/* Información general */}
      <div className="px-6 py-4 grid grid-cols-2 gap-4 border-b">
        <div>
          <p className="text-sm text-gray-500">Cliente</p>
          <p className="font-medium">{factura.cliente?.nombre}</p>
          <p className="text-sm text-gray-600">{factura.cliente?.cif}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Fecha de emisión</p>
          <p className="font-medium">{formatDate(factura.fechaEmision)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Fecha de vencimiento</p>
          <p className="font-medium">{formatDate(factura.fechaVencimiento)}</p>
        </div>
        {factura.presupuestoId && (
          <div>
            <p className="text-sm text-gray-500">Presupuesto origen</p>
            <p className="font-medium">{factura.presupuestoId}</p>
          </div>
        )}
      </div>

      {/* Líneas de la factura */}
      <div className="px-6 py-4">
        <h3 className="text-lg font-medium mb-4">Líneas de la factura</h3>
        <table className="w-full">
          <thead>
            <tr className="text-left border-b">
              <th className="pb-2">Descripción</th>
              <th className="pb-2 text-right">Cantidad</th>
              <th className="pb-2 text-right">Precio ud.</th>
              <th className="pb-2 text-right">IVA</th>
              <th className="pb-2 text-right">Importe</th>
            </tr>
          </thead>
          <tbody>
            {(Array.isArray(factura.lineas) ? factura.lineas : []).map((linea) => (
              <tr key={linea.id} className="border-b last:border-b-0">
                <td className="py-3">{linea.descripcion}</td>
                <td className="py-3 text-right">{linea.cantidad}</td>
                <td className="py-3 text-right">{formatCurrency(linea.precioUnitario)}</td>
                <td className="py-3 text-right">{getIvaLabel(linea.tipoIva)}</td>
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
              <span>{formatCurrency(factura.subtotal)}</span>
            </div>
            {Object.entries(ivaBreakdown).map(([rate, ivaAmount]) => (
              <div key={rate} className="flex justify-between">
                <span className="text-gray-600">IVA ({rate}):</span>
                <span>{formatCurrency(ivaAmount)}</span>
              </div>
            ))}
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span>{formatCurrency(factura.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoiceDetail;