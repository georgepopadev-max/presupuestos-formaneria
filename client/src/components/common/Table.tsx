import { ReactNode } from 'react';

// Props para el componente Table
interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

/**
 * Componente Table genérico y reutilizable
 * @generic T - Tipo de datos de las filas
 */
export function Table<T extends { id?: string }>({
  columns,
  data,
  emptyMessage = 'No hay datos disponibles',
  onRowClick,
}: TableProps<T>) {
  const safeData = Array.isArray(data) ? data : [];
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        {/* Header */}
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.className || ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        
        {/* Body */}
        <tbody className="bg-white divide-y divide-gray-200">
          {safeData.length === 0 ? (
            <tr>
              <td 
                colSpan={columns.length} 
                className="px-4 py-8 text-center text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            safeData.map((row) => (
              <tr
                key={row.id || JSON.stringify(row)}
                className={onRowClick ? 'hover:bg-gray-50 cursor-pointer' : ''}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-4 py-3 text-sm text-gray-900"
                  >
                    {column.render 
                      ? column.render(row) 
                      : (row as Record<string, unknown>)[column.key] as ReactNode}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;