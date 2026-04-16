
import type { Material } from '../../types';
import { Card } from '../common/Card';
import { formatCurrency } from '../../utils/formatters';

// Props para el componente MaterialCard
interface MaterialCardProps {
  material: Material;
  onClick?: () => void;
  onEdit?: (material: Material) => void;
  onDelete?: (material: Material) => void;
  showStock?: boolean;
}

/**
 * Componente de tarjeta para mostrar un material
 * Útil para catálogos o selección de materiales
 */
export function MaterialCard({ material, onClick, onEdit, onDelete, showStock = true }: MaterialCardProps) {
  const isLowStock = (material.stock ?? 0) < 10;

  return (
    <Card
      onClick={onClick}
      className="hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg text-gray-900">{material.nombre}</h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{material.descripcion}</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-blue-600">
            {formatCurrency(material.precio_unitario)}
          </p>
          <p className="text-sm text-gray-500">por {material.unidad_medida}</p>
        </div>
      </div>

      {showStock && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Stock disponible:</span>
            <span className={`font-medium ${isLowStock ? 'text-red-600' : 'text-gray-900'}`}>
              {material.stock ?? 0} {material.unidad_medida}
            </span>
          </div>
          {isLowStock && (
            <p className="text-xs text-red-600 mt-1">⚠️ Stock bajo</p>
          )}
        </div>
      )}

      {/* Acciones */}
      {(onEdit || onDelete) && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
          {onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(material); }}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Editar
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(material); }}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Eliminar
            </button>
          )}
        </div>
      )}
    </Card>
  );
}

export default MaterialCard;