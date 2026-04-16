
import type { Proyecto } from '../../types';
import { ProjectCard } from './ProjectCard';

// Props para el componente ProjectList
interface ProjectListProps {
  proyectos: Proyecto[];
  onView: (proyecto: Proyecto) => void;
  onEdit?: (proyecto: Proyecto) => void;
  onDelete?: (proyecto: Proyecto) => void;
}

/**
 * Componente para listar proyectos en formato de tarjetas
 */
export function ProjectList({ proyectos, onView }: ProjectListProps) {
  const safeProyectos = Array.isArray(proyectos) ? proyectos : [];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {safeProyectos.map((proyecto) => (
        <ProjectCard
          key={proyecto.id}
          proyecto={proyecto}
          onClick={() => onView(proyecto)}
        />
      ))}
      {safeProyectos.length === 0 && (
        <p className="col-span-full text-center text-gray-500 py-8">
          No hay proyectos registrados
        </p>
      )}
    </div>
  );
}

export default ProjectList;