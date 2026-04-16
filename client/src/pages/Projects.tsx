import { useState } from 'react';
import { ProjectList } from '../components/projects/ProjectList';
import { ProjectDetail } from '../components/projects/ProjectDetail';
import { Button } from '../components/common/Button';
import type { Proyecto } from '../types';

/**
 * Página de Proyectos
 * Gestión de proyectos de fontanería
 */
export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Proyecto | null>(null);
  
  // Datos de ejemplo
  const proyectos: Proyecto[] = [
    {
      id: 1,
      nombre: 'Reforma baño piso 3º',
      descripcion: 'Instalación completa de baño en piso de 90m²',
      clienteId: 'c1',
      cliente: { id: 1, nombre: 'María García', cif: '12345678A', direccion: 'Calle Mayor 5', telefono: '600123456', email: 'maria@email.es', createdAt: new Date() },
      presupuestoIds: ['p1'],
      facturaIds: [],
      estado: 'en_progreso',
      fechaInicio: new Date(Date.now() - 86400000 * 10),
      createdAt: new Date(Date.now() - 86400000 * 10),
    },
    {
      id: 2,
      nombre: 'Instalación comunidad',
      descripcion: 'Sustitución de tuberías generales de la comunidad',
      clienteId: 'c2',
      cliente: { id: 2, nombre: 'Comunidad Madrid 15', cif: 'H12345678', direccion: 'Avda Principal 15', telefono: '912345678', email: 'info@comunidad15.es', createdAt: new Date() },
      presupuestoIds: ['p2', 'p3'],
      facturaIds: ['f1'],
      estado: 'planificado',
      fechaInicio: new Date(Date.now() + 86400000 * 5),
      createdAt: new Date(),
    },
    {
      id: 3,
      nombre: 'Avería urgencia/local',
      descripcion: 'Reparación inmediata de fuga en local comercial',
      clienteId: 'c3',
      cliente: { id: 3, nombre: 'Bar El Cruce', cif: 'B87654321', direccion: 'Plaza España 3', telefono: '976123456', email: 'barcruce@mail.es', createdAt: new Date() },
      presupuestoIds: [],
      facturaIds: ['f2', 'f3'],
      estado: 'completado',
      fechaInicio: new Date(Date.now() - 86400000 * 30),
      fechaFin: new Date(Date.now() - 86400000 * 28),
      createdAt: new Date(Date.now() - 86400000 * 30),
    },
  ];

  const handleView = (project: Proyecto) => {
    setSelectedProject(project);
  };

  const handleBack = () => {
    setSelectedProject(null);
  };

  if (selectedProject) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <ProjectDetail 
          proyecto={selectedProject}
          onBack={handleBack}
          onEdit={() => console.log('Editar proyecto')}
          onDelete={() => console.log('Eliminar proyecto')}
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Proyectos</h1>
        <Button>+ Nuevo proyecto</Button>
      </div>
      
      <ProjectList
        proyectos={proyectos}
        onView={handleView}
      />
    </div>
  );
}