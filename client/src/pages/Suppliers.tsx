import { useState, useEffect } from 'react';
import { SupplierList } from '../components/suppliers/SupplierList';
import { SupplierForm } from '../components/suppliers/SupplierForm';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { proveedoresService } from '../services/api';
import type { Proveedor } from '../types';

/**
 * Página de Proveedores
 * Gestión de proveedores de materiales
 */
export default function Suppliers() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProveedor, setEditingProveedor] = useState<Partial<Proveedor> | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Proveedor | null>(null);

  // Cargar proveedores al montar el componente
  useEffect(() => {
    fetchProveedores();
  }, []);

  const fetchProveedores = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await proveedoresService.getAll();
      setProveedores(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error al cargar proveedores:', err);
      setError('Error al cargar la lista de proveedores');
    } finally {
      setLoading(false);
    }
  };

  // Abrir modal para crear nuevo proveedor
  const handleNew = () => {
    setEditingProveedor({});
    setModalOpen(true);
  };

  // Abrir modal para editar proveedor
  const handleEdit = (proveedor: Proveedor) => {
    setEditingProveedor(proveedor);
    setModalOpen(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingProveedor(null);
  };

  // Crear o actualizar proveedor
  const handleSubmit = async (data: Omit<Proveedor, 'id' | 'createdAt'>) => {
    try {
      if (editingProveedor?.id) {
        // Actualizar proveedor existente
        await proveedoresService.update(editingProveedor.id, data);
      } else {
        // Crear nuevo proveedor
        await proveedoresService.create(data);
      }
      handleCloseModal();
      fetchProveedores();
    } catch (err) {
      console.error('Error al guardar proveedor:', err);
      setError('Error al guardar el proveedor');
    }
  };

  // Confirmar eliminación
  const handleDelete = async () => {
    if (!deleteConfirm?.id) return;
    
    try {
      await proveedoresService.delete(deleteConfirm.id);
      setDeleteConfirm(null);
      fetchProveedores();
    } catch (err) {
      console.error('Error al eliminar proveedor:', err);
      setError('Error al eliminar el proveedor');
    }
  };

  // Ver detalles del proveedor
  const handleView = (proveedor: Proveedor) => {
    // Por ahora solo mostrar en consola, podría abrir un modal de detalles
    console.log('Ver proveedor:', proveedor);
    const materiales = proveedor.materiales?.join(', ') || 'Sin materiales';
    alert(`Proveedor: ${proveedor.nombre}\nCIF: ${proveedor.cif}\nDirección: ${proveedor.direccion}\nTeléfono: ${proveedor.telefono}\nEmail: ${proveedor.email}\nMateriales: ${materiales}`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Proveedores</h1>
        <Button onClick={handleNew}>+ Nuevo proveedor</Button>
      </div>
      
      {loading && (
        <div className="text-center py-8 text-gray-500">Cargando proveedores...</div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {!loading && !error && (
        <SupplierList
          proveedores={proveedores}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={(p) => setDeleteConfirm(p)}
        />
      )}
      
      {/* Modal para crear/editar proveedor */}
      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={editingProveedor?.id ? 'Editar proveedor' : 'Nuevo proveedor'}
        size="lg"
      >
        <SupplierForm
          initialData={editingProveedor || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>
      
      {/* Confirmación de eliminación */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Confirmar eliminación"
        size="sm"
      >
        <p className="text-gray-700 mb-6">
          ¿Está seguro de que desea eliminar al proveedor <strong>{deleteConfirm?.nombre}</strong>? Esta acción no se puede deshacer.
        </p>
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Eliminar
          </Button>
        </div>
      </Modal>
    </div>
  );
}
