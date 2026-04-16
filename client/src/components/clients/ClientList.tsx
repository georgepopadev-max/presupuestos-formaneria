
import type { Cliente } from '../../types';
import { Table } from '../common/Table';

// Props para el componente ClientList
interface ClientListProps {
  clientes: Cliente[];
  onView: (cliente: Cliente) => void;
  onEdit?: (cliente: Cliente) => void;
  onDelete?: (cliente: Cliente) => void;
}

/**
 * Componente para listar clientes con tabla
 */
export function ClientList({ clientes, onView, onEdit, onDelete }: ClientListProps) {
  const columns = [
    {
      key: 'nombre',
      header: 'Nombre',
      render: (row: Cliente) => (
        <div>
          <p className="font-medium">{row.nombre}</p>
          <p className="text-sm text-gray-500">{row.cif}</p>
        </div>
      ),
    },
    {
      key: 'telefono',
      header: 'Teléfono',
      render: (row: Cliente) => row.telefono || '-',
    },
    {
      key: 'email',
      header: 'Email',
      render: (row: Cliente) => row.email || '-',
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (row: Cliente) => (
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
        data={clientes}
        emptyMessage="No hay clientes registrados"
      />
    </div>
  );
}

export default ClientList;