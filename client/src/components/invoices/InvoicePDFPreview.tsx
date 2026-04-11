
import type { Factura } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { IVA_TASAS } from '../../utils/constants';

// Props para el componente InvoicePDFPreview
interface InvoicePDFPreviewProps {
  factura: Factura;
}

/**
 * Componente de vista previa para PDF de factura
 * Muestra una representación visual de cómo quedaría el PDF
 */
export function InvoicePDFPreview({ factura }: InvoicePDFPreviewProps) {
  return (
    <div className="bg-white p-8 max-w-2xl mx-auto shadow-lg border">
      {/* Header de la factura */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FACTURA</h1>
          <p className="text-lg font-mono text-gray-700">{factura.numero}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Fecha emisión</p>
          <p className="font-medium">{formatDate(factura.fechaEmision)}</p>
        </div>
      </div>

      {/* Datos del cliente */}
      <div className="mb-8 p-4 bg-gray-50 rounded">
        <p className="text-sm text-gray-500 mb-1">Cliente:</p>
        <p className="font-medium text-lg">{factura.cliente?.nombre}</p>
        <p className="text-gray-600">CIF: {factura.cliente?.nif}</p>
        <p className="text-gray-600">{factura.cliente?.direccion}</p>
      </div>

      {/* Tabla de líneas */}
      <table className="w-full mb-8">
        <thead>
          <tr className="border-b-2 border-gray-300">
            <th className="text-left py-2">Descripción</th>
            <th className="text-right py-2">Cantidad</th>
            <th className="text-right py-2">Precio</th>
            <th className="text-right py-2">Importe</th>
          </tr>
        </thead>
        <tbody>
          {(Array.isArray(factura.lineas) ? factura.lineas : []).map((linea) => (
            <tr key={linea.id} className="border-b border-gray-200">
              <td className="py-2">{linea.descripcion}</td>
              <td className="py-2 text-right">{linea.cantidad}</td>
              <td className="py-2 text-right">{formatCurrency(linea.precioUnitario)}</td>
              <td className="py-2 text-right font-medium">{formatCurrency(linea.importe)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totales */}
      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="flex justify-between py-1">
            <span className="text-gray-600">Subtotal</span>
            <span>{formatCurrency(factura.subtotal)}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-600">IVA ({IVA_TASAS.GENERAL}%)</span>
            <span>{formatCurrency(factura.iva)}</span>
          </div>
          <div className="flex justify-between py-2 border-t-2 border-gray-800 font-bold text-lg">
            <span>TOTAL</span>
            <span>{formatCurrency(factura.total)}</span>
          </div>
        </div>
      </div>

      {/* Pie de página */}
      <div className="text-center text-sm text-gray-500 border-t pt-4">
        <p>Fontanería - Gestión de presupuestos y facturas</p>
        <p>Fecha vencimiento: {formatDate(factura.fechaVencimiento)}</p>
      </div>
    </div>
  );
}

export default InvoicePDFPreview;