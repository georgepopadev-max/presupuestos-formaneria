import { useState, useEffect } from 'react';
import { facturasService, clientesService } from '../services/api';
import { InvoiceList } from '../components/invoices/InvoiceList';
import { InvoiceDetail } from '../components/invoices/InvoiceDetail';
import { InvoiceForm } from '../components/invoices/InvoiceForm';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import type { Factura, Cliente, LineaFactura } from '../types';

/**
 * Página de Facturas
 * Lista y gestión de facturas de la empresa
 */
export default function Invoices() {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Factura | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state for create/edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFactura, setEditingFactura] = useState<Factura | null>(null);

  // Fetch facturas and clientes on mount
  useEffect(() => {
    Promise.all([
      facturasService.getAll(),
      clientesService.getAll(),
    ])
      .then(([facturasRes, clientesRes]) => {
        setFacturas(facturasRes.data);
        setClientes(clientesRes.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error cargando datos:', err);
        setError('Error al cargar las facturas. Inténtelo de nuevo.');
        setLoading(false);
      });
  }, []);

  // Refresh facturas list
  const refreshFacturas = () => {
    facturasService.getAll()
      .then((res) => setFacturas(res.data))
      .catch((err) => {
        console.error('Error refreshing facturas:', err);
      });
  };

  // Handler: view factura detail
  const handleView = (factura: Factura) => {
    setSelectedInvoice(factura);
  };

  // Handler: go back from detail view
  const handleBack = () => {
    setSelectedInvoice(null);
  };

  // Handler: open create modal
  const handleCreate = () => {
    setEditingFactura(null);
    setIsModalOpen(true);
  };

  // Handler: open edit modal
  const handleEdit = (factura: Factura) => {
    setEditingFactura(factura);
    setIsModalOpen(true);
  };

  // Handler: delete factura with confirmation
  const handleDelete = (factura: Factura) => {
    if (!factura.id) return;
    if (!window.confirm(`¿Está seguro de que desea eliminar la factura ${factura.numero}?`)) {
      return;
    }
    facturasService.delete(factura.id)
      .then(() => {
        refreshFacturas();
      })
      .catch((err) => {
        console.error('Error eliminando factura:', err);
        alert('Error al eliminar la factura. Inténtelo de nuevo.');
      });
  };

  // Handler: create or update factura
  const handleSubmitForm = (data: {
    clienteId: string;
    lineas: LineaFactura[];
    fechaVencimiento: string;
    presupuestoId?: string;
  }) => {
    // Calculate totals from lineas
    const subtotal = data.lineas.reduce((sum, l) => sum + (l.cantidad * l.precioUnitario), 0);
    const iva = subtotal * 0.21; // IVA rate 21%
    const total = subtotal + iva;

    if (editingFactura?.id) {
      // Update existing factura
      const updateData: Partial<Factura> = {
        clienteId: data.clienteId,
        lineas: data.lineas,
        fechaVencimiento: new Date(data.fechaVencimiento),
        subtotal,
        iva,
        total,
      };
      facturasService.update(editingFactura.id, updateData)
        .then(() => {
          setIsModalOpen(false);
          refreshFacturas();
          // If this was the selected invoice, refresh it
          if (selectedInvoice?.id === editingFactura.id) {
            facturasService.getById(editingFactura.id)
              .then((res) => setSelectedInvoice(res.data));
          }
        })
        .catch((err) => {
          console.error('Error actualizando factura:', err);
          alert('Error al actualizar la factura. Inténtelo de nuevo.');
        });
    } else {
      // Create new factura
      const createData = {
        clienteId: data.clienteId,
        lineas: data.lineas,
        fechaVencimiento: new Date(data.fechaVencimiento),
        presupuestoId: data.presupuestoId,
        subtotal,
        iva,
        total,
        estado: 'borrador' as const,
        fechaEmision: new Date(),
      };
      facturasService.create(createData)
        .then(() => {
          setIsModalOpen(false);
          refreshFacturas();
        })
        .catch((err) => {
          console.error('Error creando factura:', err);
          alert('Error al crear la factura. Inténtelo de nuevo.');
        });
    }
  };

  // Handler: download PDF
  const handleDownloadPDF = (factura: Factura) => {
    if (!factura.id) return;
    const apiUrl = (import.meta as unknown as { env: { VITE_API_URL?: string } }).env.VITE_API_URL || 'http://localhost:4000/api';
    window.open(`${apiUrl}/facturas/${factura.id}/pdf`, '_blank');
  };

  // Handler: mark factura as paid
  const handleMarkPaid = (factura: Factura) => {
    if (!factura.id) return;
    if (!window.confirm(`¿Marcar la factura ${factura.numero} como pagada?`)) {
      return;
    }
    facturasService.cambiarEstado(factura.id, 'pagada')
      .then((res) => {
        refreshFacturas();
        // Update selected invoice if viewing it
        if (selectedInvoice?.id === factura.id) {
          setSelectedInvoice(res.data);
        }
      })
      .catch((err) => {
        console.error('Error marcando factura como pagada:', err);
        alert('Error al marcar la factura como pagada. Inténtelo de nuevo.');
      });
  };

  // Prepare form initial data for edit mode
  const formInitialData = editingFactura ? {
    clienteId: editingFactura.clienteId,
    lineas: editingFactura.lineas,
    fechaVencimiento: editingFactura.fechaVencimiento instanceof Date
      ? editingFactura.fechaVencimiento.toISOString().split('T')[0]
      : new Date(editingFactura.fechaVencimiento).toISOString().split('T')[0],
  } : undefined;

  // Loading state
  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Cargando facturas...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
          <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  // Detail view
  if (selectedInvoice) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <InvoiceDetail
          factura={selectedInvoice}
          onBack={handleBack}
          onEdit={() => handleEdit(selectedInvoice)}
          onDownloadPDF={() => handleDownloadPDF(selectedInvoice)}
          onMarkPaid={() => handleMarkPaid(selectedInvoice)}
        />
      </div>
    );
  }

  // List view
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Facturas</h1>
        <Button onClick={handleCreate}>+ Nueva factura</Button>
      </div>

      <InvoiceList
        facturas={facturas}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingFactura ? 'Editar factura' : 'Nueva factura'}
        size="xl"
      >
        <InvoiceForm
          clientes={clientes}
          initialData={formInitialData}
          onSubmit={handleSubmitForm}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
