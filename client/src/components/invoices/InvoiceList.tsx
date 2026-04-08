
import type { Factura } from '../../types';
import { Table } from '../common/Table';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { FACTURA_ESTADOS_LABELS, ESTADO_COLORS } from '../../utils/constants';

// Props para el componente InvoiceList
interface InvoiceListProps {
  facturas: Factura[];
  onView: (factura: Factura) => void;
  onEdit?: (factura: Factura) => void;
  onDelete?: (factura: Factura) => void;
}

/**
 * Componente para listar facturas con tabla
 */
export function InvoiceList({ facturas, onView, onEdit, onDelete }: InvoiceListProps) {
  const columns = [
    {
      key: 'numero',
      header: 'Número',
      render: (row: Factura) => (
        <span className="font-mono">{row.numero}</span>
      ),
    },
    {
      key: 'cliente',
      header: 'Cliente',
      render: (row: Factura) => row.cliente?.nombre || '-',
    },
    {
      key: 'fechaEmision',
      header: 'Emisión',
      render: (row: Factura) => formatDate(row.fechaEmision),
    },
    {
      key: 'fechaVencimiento',
      header: 'Vencimiento',
      render: (row: Factura) => formatDate(row.fechaVencimiento),
    },
    {
      key: 'total',
      header: 'Total',
      render: (row: Factura) => (
        <span className="font-semibold">{formatCurrency(row.total)}</span>
      ),
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (row: Factura) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${ESTADO_COLORS[row.estado]}`}>
          {FACTURA_ESTADOS_LABELS[row.estado]}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (row: Factura) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onView(row); }}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Ver
          </button>
          {onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(row); }}
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              Editar
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(row); }}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Eliminar
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <Table
        columns={columns}
        data={facturas}
        emptyMessage="No hay facturas registradas"
      />
    </div>
  );
}

export default InvoiceList;