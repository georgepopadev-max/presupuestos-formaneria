
import type { Proyecto } from '../../types';
import { Button } from '../common/Button';
import { formatDate } from '../../utils/formatters';
import { PROYECTO_ESTADOS_LABELS, ESTADO_COLORS } from '../../utils/constants';

// Props para el componente ProjectDetail
interface ProjectDetailProps {
  proyecto: Proyecto;
  onBack?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

/**
 * Componente para mostrar el detalle de un proyecto
 */
export function ProjectDetail({
  proyecto,
  onBack,
  onEdit,
  onDelete,
}: ProjectDetailProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{proyecto.nombre}</h2>
          <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-medium ${ESTADO_COLORS[proyecto.estado]}`}>
            {PROYECTO_ESTADOS_LABELS[proyecto.estado]}
          </span>
        </div>
        <div className="flex gap-2">
          {onBack && <Button variant="outline" onClick={onBack}>Volver</Button>}
          {onEdit && <Button variant="secondary" onClick={onEdit}>Editar</Button>}
          {onDelete && <Button variant="danger" onClick={onDelete}>Eliminar</Button>}
        </div>
      </div>

      {/* Descripción */}
      <div className="px-6 py-4 border-b">
        <p className="text-sm text-gray-500 mb-1">Descripción</p>
        <p className="text-gray-900">{proyecto.descripcion || 'Sin descripción'}</p>
      </div>

      {/* Información general */}
      <div className="px-6 py-4 grid grid-cols-2 gap-4 border-b">
        <div>
          <p className="text-sm text-gray-500">Cliente</p>
          <p className="font-medium">{proyecto.cliente?.nombre || '-'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Fecha de inicio</p>
          <p className="font-medium">{formatDate(proyecto.fechaInicio)}</p>
        </div>
        {proyecto.fechaFin && (
          <div>
            <p className="text-sm text-gray-500">Fecha de fin</p>
            <p className="font-medium">{formatDate(proyecto.fechaFin)}</p>
          </div>
        )}
      </div>

      {/* Resumen de documentos */}
      <div className="px-6 py-4">
        <h3 className="text-lg font-medium mb-4">Documentos asociados</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded p-4">
            <p className="text-sm text-gray-500">Presupuestos</p>
            <p className="text-2xl font-bold">{proyecto.presupuestoIds?.length || 0}</p>
          </div>
          <div className="bg-gray-50 rounded p-4">
            <p className="text-sm text-gray-500">Facturas</p>
            <p className="text-2xl font-bold">{proyecto.facturaIds?.length || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetail;