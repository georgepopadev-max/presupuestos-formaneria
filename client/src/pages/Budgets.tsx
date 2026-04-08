import { useState, useEffect, useCallback } from 'react';
import { BudgetList } from '../components/budgets/BudgetList';
import { BudgetDetail } from '../components/budgets/BudgetDetail';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { presupuestosService, clientesService } from '../services/api';
import type { Presupuesto, Cliente, LineaPresupuesto } from '../types';
import { PRESUPUESTO_ESTADOS_LABELS, IVA_TASAS } from '../utils/constants';

/**
 * Página de Presupuestos - Lista y gestión de presupuestos de la empresa
 */
export default function Budgets() {
  // Estado principal de presupuestos
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<Presupuesto | null>(null);
  
  // Estados de UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Presupuesto | null>(null);
  
  // Form state for create/edit
  const [formData, setFormData] = useState({
    clienteId: '',
    estado: 'borrador' as Presupuesto['estado'],
    fechaValidez: '',
  });
  const [formLineas, setFormLineas] = useState<LineaPresupuesto[]>([]);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Fetch presupuestos and clientes on mount
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [presupuestosRes, clientesRes] = await Promise.all([
        presupuestosService.getAll(),
        clientesService.getAll(),
      ]);
      
      // Service returns AxiosResponse<Presupuesto[]>, so .data is the array
      const presupuestosData: Presupuesto[] = presupuestosRes.data;
      const clientesData: Cliente[] = clientesRes.data;
      
      setPresupuestos(presupuestosData || []);
      setClientes(clientesData || []);
      
      // If we have a selectedBudget, refresh its data
      if (selectedBudget) {
        const updated = presupuestosData?.find((p: Presupuesto) => p.id === selectedBudget.id);
        if (updated) {
          // Enrich with client data if not included
          if (!updated.cliente && updated.clienteId) {
            updated.cliente = clientesData?.find((c: Cliente) => c.id === updated.clienteId);
          }
          setSelectedBudget(updated);
        }
      }
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.message || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  }, [selectedBudget?.id]);

  useEffect(() => {
    fetchData();
  }, []);

  // Enrich presupuesto with cliente data
  const enrichPresupuesto = useCallback((p: Presupuesto): Presupuesto => {
    if (p.cliente) return p;
    const cliente = clientes.find(c => c.id === p.clienteId);
    return cliente ? { ...p, cliente } : p;
  }, [clientes]);

  // Handlers
  const handleView = (budget: Presupuesto) => {
    const enriched = enrichPresupuesto(budget);
    setSelectedBudget(enriched);
  };

  const handleBack = () => {
    setSelectedBudget(null);
  };

  const handleEdit = (budget: Presupuesto) => {
    const enriched = enrichPresupuesto(budget);
    setEditingBudget(enriched);
    setFormData({
      clienteId: enriched.clienteId || '',
      estado: enriched.estado || 'borrador',
      fechaValidez: enriched.fechaValidez 
        ? new Date(enriched.fechaValidez).toISOString().split('T')[0]
        : '',
    });
    setFormLineas(enriched.lineas || []);
    setIsModalOpen(true);
  };

  const handleDelete = async (budget: Presupuesto) => {
    if (!budget.id) return;
    
    const confirmDelete = window.confirm(
      `¿Está seguro de eliminar el presupuesto ${budget.numero}?\n\nEsta acción no se puede deshacer.`
    );
    
    if (!confirmDelete) return;

    try {
      await presupuestosService.delete(budget.id);
      await fetchData();
    } catch (err: any) {
      console.error('Error deleting:', err);
      alert(err.response?.data?.message || 'Error al eliminar el presupuesto');
    }
  };

  const handleClone = async (budget: Presupuesto) => {
    const confirmClone = window.confirm(
      `¿Duplicar el presupuesto ${budget.numero}?\n\nSe creará un nuevo presupuesto con el mismo contenido.`
    );
    
    if (!confirmClone) return;

    try {
      // Create a clone with new data (no id, no numero - backend generates)
      const cloneData = {
        clienteId: budget.clienteId,
        lineas: budget.lineas.map(l => ({
          descripcion: l.descripcion,
          cantidad: l.cantidad,
          precioUnitario: l.precioUnitario,
          importe: l.importe,
        })),
        fechaValidez: budget.fechaValidez,
      };
      
      await presupuestosService.create(cloneData as any);
      await fetchData();
    } catch (err: any) {
      console.error('Error cloning:', err);
      alert(err.response?.data?.message || 'Error al duplicar el presupuesto');
    }
  };

  const handleGenerateInvoice = (budget: Presupuesto) => {
    // TODO: Open invoice creation pre-filled with budget data
    console.log('Generar factura para presupuesto:', budget.numero);
    alert('Función de generar factura pendiente de implementar.\nPresupuesto: ' + budget.numero);
  };

  // Form handlers
  const handleOpenCreate = () => {
    setEditingBudget(null);
    // Default validity: 30 days from now
    const defaultValidez = new Date();
    defaultValidez.setDate(defaultValidez.getDate() + 30);
    setFormData({
      clienteId: '',
      estado: 'borrador',
      fechaValidez: defaultValidez.toISOString().split('T')[0],
    });
    setFormLineas([{
      id: crypto.randomUUID(),
      descripcion: '',
      cantidad: 1,
      precioUnitario: 0,
      importe: 0,
    }]);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBudget(null);
    setFormData({ clienteId: '', estado: 'borrador', fechaValidez: '' });
    setFormLineas([]);
  };

  const handleAddLinea = () => {
    setFormLineas(prev => [...prev, {
      id: crypto.randomUUID(),
      descripcion: '',
      cantidad: 1,
      precioUnitario: 0,
      importe: 0,
    }]);
  };

  const handleUpdateLinea = (index: number, updates: Partial<LineaPresupuesto>) => {
    setFormLineas(prev => prev.map((linea, i) => {
      if (i !== index) return linea;
      const updated = { ...linea, ...updates };
      updated.importe = (updated.cantidad || 0) * (updated.precioUnitario || 0);
      return updated;
    }));
  };

  const handleRemoveLinea = (index: number) => {
    setFormLineas(prev => prev.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    const subtotal = formLineas.reduce((sum, l) => sum + (l.importe || 0), 0);
    const iva = subtotal * (IVA_TASAS.GENERAL / 100);
    const total = subtotal + iva;
    return { subtotal, iva, total };
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clienteId) {
      alert('Por favor, seleccione un cliente');
      return;
    }
    
    if (formLineas.length === 0 || !formLineas[0].descripcion) {
      alert('Por favor, añada al menos una línea al presupuesto');
      return;
    }

    setFormSubmitting(true);
    
    try {
      const { subtotal, iva, total } = calculateTotals();
      
      const data = {
        clienteId: formData.clienteId,
        estado: formData.estado,
        lineas: formLineas.map(l => ({
          descripcion: l.descripcion,
          cantidad: l.cantidad,
          precioUnitario: l.precioUnitario,
          importe: l.importe,
        })),
        subtotal,
        iva,
        total,
        fechaValidez: formData.fechaValidez ? new Date(formData.fechaValidez) : undefined,
      } as any;

      if (editingBudget?.id) {
        await presupuestosService.update(editingBudget.id, data);
      } else {
        await presupuestosService.create(data);
      }

      handleCloseModal();
      await fetchData();
    } catch (err: any) {
      console.error('Error saving:', err);
      alert(err.response?.data?.message || 'Error al guardar el presupuesto');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Detail view
  if (selectedBudget) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <BudgetDetail 
          presupuesto={selectedBudget}
          onBack={handleBack}
          onEdit={() => handleEdit(selectedBudget)}
          onClone={() => handleClone(selectedBudget)}
          onGenerateInvoice={() => handleGenerateInvoice(selectedBudget)}
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Presupuestos</h1>
        <Button onClick={handleOpenCreate}>+ Nuevo presupuesto</Button>
      </div>
      
      {/* Loading/Error states */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">Cargando presupuestos...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-medium">Error</p>
          <p>{error}</p>
          <button 
            onClick={fetchData}
            className="text-sm underline mt-2"
          >
            Reintentar
          </button>
        </div>
      )}
      
      {!loading && !error && (
        <BudgetList
          presupuestos={presupuestos.map(enrichPresupuesto)}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingBudget ? 'Editar presupuesto' : 'Nuevo presupuesto'}
        size="xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Cliente y Estado */}
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Cliente"
              options={clientes.map(c => ({ value: c.id, label: c.nombre }))}
              value={formData.clienteId}
              onChange={(e) => setFormData(prev => ({ ...prev, clienteId: e.target.value }))}
              placeholder="Seleccione un cliente"
              required
            />
            <Select
              label="Estado"
              options={Object.entries(PRESUPUESTO_ESTADOS_LABELS).map(([value, label]) => ({ 
                value, 
                label 
              }))}
              value={formData.estado}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                estado: e.target.value as Presupuesto['estado']
              }))}
            />
          </div>

          {/* Fecha de validez */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Fecha de validez"
              type="date"
              value={formData.fechaValidez}
              onChange={(e) => setFormData(prev => ({ ...prev, fechaValidez: e.target.value }))}
            />
          </div>

          {/* Líneas del presupuesto */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Líneas del presupuesto</h3>
              <Button type="button" variant="outline" size="sm" onClick={handleAddLinea}>
                + Añadir línea
              </Button>
            </div>
            
            {formLineas.length === 0 && (
              <p className="text-gray-500 text-sm py-4">
                No hay líneas. Haga clic en "Añadir línea" para comenzar.
              </p>
            )}
            
            {formLineas.map((linea, index) => (
              <div key={linea.id} className="flex gap-4 items-start bg-gray-50 p-4 rounded-lg">
                <div className="flex-1">
                  <Input
                    label="Descripción"
                    value={linea.descripcion}
                    onChange={(e) => handleUpdateLinea(index, { descripcion: e.target.value })}
                    placeholder="Descripción del trabajo o material"
                  />
                </div>
                <div className="w-24">
                  <Input
                    label="Cantidad"
                    type="number"
                    min={1}
                    value={linea.cantidad}
                    onChange={(e) => handleUpdateLinea(index, { cantidad: Number(e.target.value) })}
                  />
                </div>
                <div className="w-32">
                  <Input
                    label="Precio ud. (€)"
                    type="number"
                    step="0.01"
                    min={0}
                    value={linea.precioUnitario}
                    onChange={(e) => handleUpdateLinea(index, { precioUnitario: Number(e.target.value) })}
                  />
                </div>
                <div className="w-32 pt-6 text-right font-medium">
                  {(linea.cantidad * linea.precioUnitario).toFixed(2)} €
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveLinea(index)}
                  className="mt-6 text-red-500 hover:text-red-700"
                  title="Eliminar línea"
                >
                  ✕
                </button>
              </div>
            ))}

            {/* Totales */}
            {formLineas.length > 0 && (
              <div className="flex justify-end">
                <div className="w-64 space-y-2 bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>{calculateTotals().subtotal.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">IVA ({IVA_TASAS.GENERAL}%):</span>
                    <span>{calculateTotals().iva.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between font-bold border-t pt-2">
                    <span>Total:</span>
                    <span>{calculateTotals().total.toFixed(2)} €</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button type="submit" disabled={formSubmitting}>
              {formSubmitting ? 'Guardando...' : (editingBudget ? 'Guardar cambios' : 'Crear presupuesto')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
