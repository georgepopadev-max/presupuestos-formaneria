import { useState, useEffect } from 'react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import api from '../services/api';

export default function PendingMaterials() {
  const [presupuestos, setPresupuestos] = useState<any[]>([]);
  const [selectedPresupuesto, setSelectedPresupuesto] = useState<number | null>(null);
  const [pendientes, setPendientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [resumen, setResumen] = useState<any[]>([]);

  useEffect(() => {
    fetchPresupuestosAceptados();
    fetchResumen();
  }, []);

  useEffect(() => {
    if (selectedPresupuesto) {
      fetchPendientes(selectedPresupuesto);
    } else {
      setPendientes([]);
    }
  }, [selectedPresupuesto]);

  const fetchPresupuestosAceptados = async () => {
    try {
      const res = await api.get('/presupuestos');
      const data = res.data;
      const presupuestosArray = data?.success ? data.data : data;
      if (Array.isArray(presupuestosArray)) {
        const aceptados = presupuestosArray.filter((p: any) => p.estado === 'aceptado');
        setPresupuestos(aceptados);
      }
    } catch (err) {
      console.error('Error fetching presupuestos', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendientes = async (presupuestoId: number) => {
    try {
      const res = await api.get(`/materiales-pendientes/presupuesto/${presupuestoId}`);
      const data = res.data;
      const pendientesArray = data?.success ? data.data : data;
      setPendientes(Array.isArray(pendientesArray) ? pendientesArray : []);
    } catch (err) {
      console.error('Error fetching pendientes', err);
    }
  };

  const fetchResumen = async () => {
    try {
      const res = await api.get('/materiales-pendientes/resumen/proveedor');
      const data = res.data;
      const resumenArray = data?.success ? data.data : data;
      setResumen(Array.isArray(resumenArray) ? resumenArray : []);
    } catch (err) {
      console.error('Error fetching resumen', err);
    }
  };

  const crearPendientes = async (presupuestoId: number) => {
    try {
      await api.post(`/materiales-pendientes/presupuesto/${presupuestoId}/crear`);
      fetchPendientes(presupuestoId);
      fetchResumen();
    } catch (err) {
      console.error('Error creating pendientes', err);
    }
  };

  const marcarComprado = async (id: number, precio: number) => {
    try {
      await api.patch(`/materiales-pendientes/${id}/comprar`, { precioCompra: precio });
      if (selectedPresupuesto) fetchPendientes(selectedPresupuesto);
      fetchResumen();
    } catch (err) {
      console.error('Error marking as bought', err);
    }
  };

  const eliminarPendiente = async (id: number) => {
    if (!confirm('¿Eliminar este material pendiente?')) return;
    try {
      await api.delete(`/materiales-pendientes/${id}`);
      if (selectedPresupuesto) fetchPendientes(selectedPresupuesto);
      fetchResumen();
    } catch (err) {
      console.error('Error deleting', err);
    }
  };

  const getEstadoBadge = (estado: string) => {
    const badges: Record<string, string> = {
      pendiente: 'bg-yellow-100 text-yellow-800',
      parcial: 'bg-blue-100 text-blue-800',
      comprado: 'bg-green-100 text-green-800',
    };
    return `px-2 py-1 rounded text-xs ${badges[estado] || ''}`;
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Materiales Pendientes de Compra</h1>

      {/* Resumen por proveedor */}
      {resumen.length > 0 && (
        <Card className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Resumen por Proveedor</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {resumen.map((r: any) => (
              <div key={r.proveedorId} className="bg-gray-50 rounded p-3">
                <p className="font-medium">{r.proveedorNombre}</p>
                <p className="text-sm text-gray-600">{r.numMateriales} materiales</p>
                <p className="text-sm text-gray-600">Total pendiente: {r.totalPendiente}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Selector de presupuesto */}
      <Card className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Seleccionar Presupuesto</h2>
        <div className="flex gap-4 items-end">
          <select
            className="border rounded px-3 py-2 flex-1"
            value={selectedPresupuesto || ''}
            onChange={(e) => setSelectedPresupuesto(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">-- Seleccionar presupuesto --</option>
            {presupuestos.map((p: any) => (
              <option key={p.id} value={p.id}>
                {p.numero} - {p.titulo}
              </option>
            ))}
          </select>
          {selectedPresupuesto && (
            <Button onClick={() => crearPendientes(selectedPresupuesto)}>
              Crear pendientes desde presupuesto
            </Button>
          )}
        </div>
      </Card>

      {/* Lista de materiales pendientes */}
      {pendientes.length > 0 && (
        <Card>
          <h2 className="text-lg font-semibold mb-3">Materiales Pendientes</h2>
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="pb-2">Descripción</th>
                <th className="pb-2">Cantidad</th>
                <th className="pb-2">Precio Est.</th>
                <th className="pb-2">Estado</th>
                <th className="pb-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pendientes.map((p: any) => (
                <tr key={p.id} className="border-b last:border-b-0">
                  <td className="py-3">{p.descripcion}</td>
                  <td className="py-3">{p.cantidad_pendiente}</td>
                  <td className="py-3">€{p.precio_estimado}</td>
                  <td className="py-3">
                    <span className={getEstadoBadge(p.estado)}>{p.estado}</span>
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      {p.estado !== 'comprado' && (
                        <button
                          onClick={() => {
                            const precio = prompt('Precio de compra:', String(p.precio_estimado));
                            if (precio) marcarComprado(p.id, Number(precio));
                          }}
                          className="text-green-600 hover:text-green-800 text-sm"
                        >
                          ✓ Comprado
                        </button>
                      )}
                      <button
                        onClick={() => eliminarPendiente(p.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        ✗ Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {selectedPresupuesto && pendientes.length === 0 && (
        <p className="text-gray-500 text-center py-8">
          No hay materiales pendientes para este presupuesto
        </p>
      )}

      {!selectedPresupuesto && (
        <p className="text-gray-500 text-center py-8">
          Seleccione un presupuesto para ver sus materiales pendientes
        </p>
      )}
    </div>
  );
}