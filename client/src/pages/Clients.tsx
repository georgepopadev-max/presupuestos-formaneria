import { useState, useEffect } from 'react';
import { ClientList } from '../components/clients/ClientList';
import { ClientForm } from '../components/clients/ClientForm';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { clientesService } from '../services/api';
import type { Cliente } from '../types';

/**
 * Página de Clientes
 * Gestión de clientes de la empresa
 */
export default function Clients() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Partial<Cliente> | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Cliente | null>(null);

  // Cargar clientes al montar el componente
  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await clientesService.getAll();
      setClientes(response.data);
    } catch (err) {
      console.error('Error al cargar clientes:', err);
      setError('Error al cargar la lista de clientes');
    } finally {
      setLoading(false);
    }
  };

  // Abrir modal para crear nuevo cliente
  const handleNew = () => {
    setEditingCliente({});
    setModalOpen(true);
  };

  // Abrir modal para editar cliente
  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setModalOpen(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingCliente(null);
  };

  // Crear o actualizar cliente
  const handleSubmit = async (data: Omit<Cliente, 'id' | 'createdAt'>) => {
    try {
      if (editingCliente?.id) {
        // Actualizar cliente existente
        await clientesService.update(editingCliente.id, data);
      } else {
        // Crear nuevo cliente
        await clientesService.create(data);
      }
      handleCloseModal();
      fetchClientes();
    } catch (err) {
      console.error('Error al guardar cliente:', err);
      setError('Error al guardar el cliente');
    }
  };

  // Confirmar eliminación
  const handleDelete = async () => {
    if (!deleteConfirm?.id) return;
    
    try {
      await clientesService.delete(deleteConfirm.id);
      setDeleteConfirm(null);
      fetchClientes();
    } catch (err) {
      console.error('Error al eliminar cliente:', err);
      setError('Error al eliminar el cliente');
    }
  };

  // Ver detalles del cliente
  const handleView = (cliente: Cliente) => {
    // Por ahora solo mostrar en consola, podría abrir un modal de detalles
    console.log('Ver cliente:', cliente);
    alert(`Cliente: ${cliente.nombre}\nCIF: ${cliente.cif}\nDirección: ${cliente.direccion}\nTeléfono: ${cliente.telefono}\nEmail: ${cliente.email}`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
        <Button onClick={handleNew}>+ Nuevo cliente</Button>
      </div>
      
      {loading && (
        <div className="text-center py-8 text-gray-500">Cargando clientes...</div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {!loading && !error && (
        <ClientList
          clientes={clientes}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={(c) => setDeleteConfirm(c)}
        />
      )}
      
      {/* Modal para crear/editar cliente */}
      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={editingCliente?.id ? 'Editar cliente' : 'Nuevo cliente'}
        size="lg"
      >
        <ClientForm
          initialData={editingCliente || undefined}
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
          ¿Está seguro de que desea eliminar al cliente <strong>{deleteConfirm?.nombre}</strong>? Esta acción no se puede deshacer.
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
