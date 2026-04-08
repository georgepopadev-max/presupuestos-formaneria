
import { Card } from '../common/Card';
import { formatCurrency, formatDate } from '../../utils/formatters';

// Tipo para actividades recientes
interface Activity {
  id: string;
  tipo: 'presupuesto' | 'factura' | 'cliente' | 'material';
  descripcion: string;
  monto?: number;
  fecha: Date | string;
}

// Props para el componente RecentActivity
interface RecentActivityProps {
  activities: Activity[];
  maxItems?: number;
}

/**
 * Componente para mostrar actividad reciente
 * Lista de últimas acciones en el sistema
 */
export function RecentActivity({ activities, maxItems = 5 }: RecentActivityProps) {
  // Iconos por tipo de actividad
  const typeIcons = {
    presupuesto: '📋',
    factura: '🧾',
    cliente: '👤',
    material: '📦',
  };

  const typeLabels = {
    presupuesto: 'Presupuesto',
    factura: 'Factura',
    cliente: 'Cliente',
    material: 'Material',
  };

  const displayedActivities = activities.slice(0, maxItems);

  return (
    <Card title="Actividad reciente" subtitle="Últimas acciones en el sistema">
      <div className="divide-y divide-gray-100">
        {displayedActivities.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No hay actividad reciente</p>
        ) : (
          displayedActivities.map((activity) => (
            <div key={activity.id} className="py-3 flex items-start gap-3">
              <span className="text-xl">{typeIcons[activity.tipo]}</span>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs text-gray-500 uppercase">
                      {typeLabels[activity.tipo]}
                    </span>
                    <p className="text-sm text-gray-900 mt-0.5">
                      {activity.descripcion}
                    </p>
                  </div>
                  {activity.monto && (
                    <span className="font-medium text-sm">
                      {formatCurrency(activity.monto)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {formatDate(activity.fecha)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

export default RecentActivity;