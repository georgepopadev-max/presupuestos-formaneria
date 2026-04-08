
import type { Proyecto } from '../../types';
import { Card } from '../common/Card';
import { formatDate } from '../../utils/formatters';
import { PROYECTO_ESTADOS_LABELS, ESTADO_COLORS } from '../../utils/constants';

// Props para el componente ProjectCard
interface ProjectCardProps {
  proyecto: Proyecto;
  onClick?: () => void;
  presupuestoCount?: number;
  facturaCount?: number;
}

/**
 * Componente de tarjeta para mostrar un proyecto
 */
export function ProjectCard({ 
  proyecto, 
  onClick, 
  presupuestoCount = 0, 
  facturaCount = 0 
}: ProjectCardProps) {
  return (
    <Card
      onClick={onClick}
      className="hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-lg text-gray-900">{proyecto.nombre}</h3>
        <span className={`px-2 py-1 rounded text-xs font-medium ${ESTADO_COLORS[proyecto.estado]}`}>
          {PROYECTO_ESTADOS_LABELS[proyecto.estado]}
        </span>
      </div>
      
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{proyecto.descripcion}</p>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Cliente</p>
          <p className="font-medium">{proyecto.cliente?.nombre || '-'}</p>
        </div>
        <div>
          <p className="text-gray-500">Inicio</p>
          <p className="font-medium">{formatDate(proyecto.fechaInicio)}</p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
        <span className="text-sm text-gray-500">
          {presupuestoCount} presupuesto{presupuestoCount !== 1 ? 's' : ''}
        </span>
        <span className="text-sm text-gray-500">
          {facturaCount} factura{facturaCount !== 1 ? 's' : ''}
        </span>
      </div>
    </Card>
  );
}

export default ProjectCard;