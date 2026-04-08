// ============================================================
// SERVICIO: Materiales Pendientes
// Lógica de negocio para gestionar materiales pendientes de compra
// ============================================================

import knex from 'knex';
import knexConfig from '../../knexfile';
import materialPendienteRepository from '../repositories/materialPendiente.repository';
import presupuestoRepository from '../repositories/presupuesto.repository';
import materialRepository from '../repositories/material.repository';

const db = knex(knexConfig);

export class MaterialPendienteService {
  /**
   * Crea entradas de materiales pendientes desde las líneas de un presupuesto
   */
  async crearDesdePresupuesto(presupuestoId: number): Promise<any[]> {
    const presupuesto = await presupuestoRepository.findById(presupuestoId);
    if (!presupuesto) throw new Error('Presupuesto no encontrado');

    const lineas = await presupuestoRepository.findLineasByPresupuestoId(presupuestoId);

    const pendientes = await Promise.all(lineas.map(async (linea: any) => {
      let proveedorId: number | null = null;
      let precioEstimado = linea.precioUnitario;

      if (linea.materialId) {
        const material = await materialRepository.findById(linea.materialId);
        if (material) {
          proveedorId = (material as any).proveedorId || null;
          precioEstimado = (material as any).precioUnitario;
        }
      }

      return materialPendienteRepository.create({
        presupuesto_id: presupuestoId,
        material_id: linea.materialId || null,
        descripcion: linea.descripcion,
        cantidad_pendiente: linea.cantidad,
        precio_estimado: precioEstimado,
        proveedor_id: proveedorId,
        estado: 'pendiente',
      });
    }));

    return pendientes;
  }

  /**
   * Obtener materiales pendientes de un presupuesto
   */
  async findByPresupuestoId(presupuestoId: number) {
    return materialPendienteRepository.findByPresupuestoId(presupuestoId);
  }

  /**
   * Marcar un material como comprado completamente
   */
  async marcarComprado(id: number, precioCompra: number) {
    return materialPendienteRepository.marcarComprado(id, precioCompra);
  }

  /**
   * Actualizar la cantidad comprada de un material pendiente
   */
  async updateCantidad(id: number, cantidadComprada: number) {
    const item = await materialPendienteRepository.findById(id);
    if (!item) throw new Error('Material pendiente no encontrado');

    const pendiente = Number(item.cantidad_pendiente);
    const comprada = Number(item.cantidad_comprada) + cantidadComprada;

    const estado = comprada >= pendiente ? 'comprado' :
                   comprada > 0 ? 'parcial' : 'pendiente';

    return materialPendienteRepository.update(id, {
      cantidad_comprada: comprada,
      estado,
    });
  }

  /**
   * Eliminar un material pendiente
   */
  async delete(id: number) {
    return materialPendienteRepository.delete(id);
  }

  /**
   * Obtiene resumen de materiales pendientes agrupados por proveedor
   */
  async getResumenPorProveedor(presupuestoId?: number) {
    let query = db('materiales_pendientes')
      .join('proveedores', 'proveedores.id', 'materiales_pendientes.proveedor_id')
      .where('materiales_pendientes.estado', '!=', 'comprado')
      .select(
        'proveedores.id as proveedorId',
        'proveedores.nombre as proveedorNombre',
        db.raw('SUM(cantidad_pendiente - cantidad_comprada) as totalPendiente'),
        db.raw('COUNT(*) as numMateriales')
      )
      .groupBy('proveedores.id', 'proveedores.nombre');

    if (presupuestoId) {
      query = query.where('materiales_pendientes.presupuesto_id', presupuestoId);
    }

    return query;
  }
}

export default new MaterialPendienteService();
