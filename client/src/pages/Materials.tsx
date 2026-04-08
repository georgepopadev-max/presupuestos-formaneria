import { useState, useEffect } from 'react';
import { MaterialList } from '../components/materials/MaterialList';
import { MaterialCard } from '../components/materials/MaterialCard';
import { MaterialForm } from '../components/materials/MaterialForm';
import { Button } from '../components/common/Button';
import type { Material } from '../types';
import { materialesService } from '../services/api';

/**
 * Página de Materiales
 * Catálogo y gestión de materiales de fontanería
 */
export default function Materials() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

  // Cargar materiales al montar el componente
  useEffect(() => {
    loadMateriales();
  }, []);

  const loadMateriales = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await materialesService.getAll();
      setMateriales(response.data);
    } catch (err: any) {
      console.error('Error cargando materiales:', err);
      setError(err.response?.data?.message || 'Error al cargar los materiales');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: Omit<Material, 'id' | 'createdAt'>) => {
    try {
      setError(null);
      await materialesService.create(data);
      setModalOpen(false);
      setSelectedMaterial(null);
      await loadMateriales();
    } catch (err: any) {
      console.error('Error creando material:', err);
      setError(err.response?.data?.message || 'Error al crear el material');
      throw err;
    }
  };

  const handleEdit = (material: Material) => {
    setSelectedMaterial(material);
    setModalOpen(true);
  };

  const handleUpdate = async (id: string, data: Omit<Material, 'id' | 'createdAt'>) => {
    try {
      setError(null);
      await materialesService.update(id, data);
      setModalOpen(false);
      setSelectedMaterial(null);
      await loadMateriales();
    } catch (err: any) {
      console.error('Error actualizando material:', err);
      setError(err.response?.data?.message || 'Error al actualizar el material');
      throw err;
    }
  };

  const handleDelete = async (material: Material) => {
    if (!material.id) return;
    
    if (window.confirm(`¿Está seguro de que desea eliminar el material "${material.nombre}"?`)) {
      try {
        setError(null);
        await materialesService.delete(material.id);
        await loadMateriales();
      } catch (err: any) {
        console.error('Error eliminando material:', err);
        setError(err.response?.data?.message || 'Error al eliminar el material');
      }
    }
  };

  const handleFormSubmit = async (data: Omit<Material, 'id' | 'createdAt'>) => {
    if (selectedMaterial?.id) {
      await handleUpdate(selectedMaterial.id, data);
    } else {
      await handleCreate(data);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedMaterial(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Materiales</h1>
        <div className="flex gap-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
            >
              📋
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
            >
              ▦
            </button>
          </div>
          <Button onClick={() => setModalOpen(true)}>+ Nuevo material</Button>
        </div>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Estado de carga */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-500">Cargando materiales...</div>
        </div>
      ) : materiales.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No hay materiales registrados. Haga clic en "+ Nuevo material" para comenzar.
        </div>
      ) : viewMode === 'list' ? (
        <MaterialList
          materiales={materiales}
          onView={(m) => console.log('Ver material', m.nombre)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materiales.map((material) => (
            <MaterialCard
              key={material.id}
              material={material}
              onEdit={() => handleEdit(material)}
              onDelete={() => handleDelete(material)}
              onClick={() => console.log('Ver material', material.nombre)}
            />
          ))}
        </div>
      )}

      {/* Modal de crear/editar */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {selectedMaterial ? 'Editar material' : 'Nuevo material'}
            </h2>
            <MaterialForm
              initialData={selectedMaterial || undefined}
              onSubmit={handleFormSubmit}
              onCancel={closeModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}
