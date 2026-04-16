
import type { Material } from '../../types';
import { Table } from '../common/Table';
import { formatCurrency } from '../../utils/formatters';

// Props para el componente MaterialList
interface MaterialListProps {
  materiales: Material[];
  onView: (material: Material) => void;
  onEdit?: (material: Material) => void;
  onDelete?: (material: Material) => void;
}

/**
 * Componente para listar materiales con tabla
 */
export function MaterialList({ materiales, onView, onEdit, onDelete }: MaterialListProps) {
  const columns = [
    {
      key: 'nombre',
      header: 'Nombre',
      render: (row: Material) => (
        <div>
          <p className="font-medium">{row.nombre}</p>
          <p className="text-sm text-gray-500 truncate max-w-xs">{row.descripcion}</p>
        </div>
      ),
    },
    {
      key: 'precioUnitario',
      header: 'Precio',
      render: (row: Material) => (
        <span className="font-medium">{formatCurrency(row.precioUnitario)}</span>
      ),
    },
    {
      key: 'unidadMedida',
      header: 'Ud.',
      render: (row: Material) => (
        <span className="text-gray-600">{row.unidadMedida}</span>
      ),
    },
    {
      key: 'stock',
      header: 'Stock',
      render: (row: Material) => (
        <span className={(row.stock ?? 0) < 10 ? 'text-red-600 font-medium' : ''}>
          {row.stock ?? 0}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (row: Material) => (
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
        data={materiales}
        emptyMessage="No hay materiales registrados"
      />
    </div>
  );
}

export default MaterialList;