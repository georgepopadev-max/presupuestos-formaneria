
import type { Presupuesto } from '../../types';
import { Table } from '../common/Table';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { PRESUPUESTO_ESTADOS_LABELS, ESTADO_COLORS } from '../../utils/constants';

// Props para el componente BudgetList
interface BudgetListProps {
  presupuestos: Presupuesto[];
  onView: (presupuesto: Presupuesto) => void;
  onEdit?: (presupuesto: Presupuesto) => void;
  onDelete?: (presupuesto: Presupuesto) => void;
}

/**
 * Componente para listar presupuestos con tabla
 */
export function BudgetList({ presupuestos, onView, onEdit, onDelete }: BudgetListProps) {
  const columns = [
    {
      key: 'numero',
      header: 'Número',
      render: (row: Presupuesto) => (
        <span className="font-mono">{row.numero}</span>
      ),
    },
    {
      key: 'cliente',
      header: 'Cliente',
      render: (row: Presupuesto) => row.cliente?.nombre || '-',
    },
    {
      key: 'fechaCreacion',
      header: 'Fecha',
      render: (row: Presupuesto) => formatDate(row.fechaCreacion),
    },
    {
      key: 'total',
      header: 'Total',
      render: (row: Presupuesto) => (
        <span className="font-semibold">{formatCurrency(row.total)}</span>
      ),
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (row: Presupuesto) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${ESTADO_COLORS[row.estado]}`}>
          {PRESUPUESTO_ESTADOS_LABELS[row.estado]}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (row: Presupuesto) => (
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
        data={presupuestos}
        emptyMessage="No hay presupuestos registrados"
      />
    </div>
  );
}

export default BudgetList;