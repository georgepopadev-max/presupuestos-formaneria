
import type { Proveedor } from '../../types';
import { Table } from '../common/Table';

// Props para el componente SupplierList
interface SupplierListProps {
  proveedores: Proveedor[];
  onView: (proveedor: Proveedor) => void;
  onEdit?: (proveedor: Proveedor) => void;
  onDelete?: (proveedor: Proveedor) => void;
}

/**
 * Componente para listar proveedores con tabla
 */
export function SupplierList({ proveedores, onView, onEdit, onDelete }: SupplierListProps) {
  const columns = [
    {
      key: 'nombre',
      header: 'Nombre',
      render: (row: Proveedor) => (
        <div>
          <p className="font-medium">{row.nombre}</p>
          <p className="text-sm text-gray-500">{row.cif}</p>
        </div>
      ),
    },
    {
      key: 'telefono',
      header: 'Teléfono',
      render: (row: Proveedor) => row.telefono || '-',
    },
    {
      key: 'email',
      header: 'Email',
      render: (row: Proveedor) => row.email || '-',
    },
    {
      key: 'materiales',
      header: 'Materiales',
      render: (row: Proveedor) => (
        <span className="text-gray-600">
          {row.materiales?.length || 0} tipos
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (row: Proveedor) => (
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
        data={proveedores}
        emptyMessage="No hay proveedores registrados"
      />
    </div>
  );
}

export default SupplierList;