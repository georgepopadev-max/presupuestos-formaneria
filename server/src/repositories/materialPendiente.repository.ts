// ============================================================
// REPOSITORIO: Materiales Pendientes
// Acceso a datos para materiales pendientes de compra
// ============================================================

import knex from 'knex';
import knexConfig from '../../knexfile';

const db = knex(knexConfig);

export class MaterialPendienteRepository {
  /**
   * Obtener todos los materiales pendientes de un presupuesto
   */
  async findByPresupuestoId(presupuestoId: number) {
    return db('materiales_pendientes')
      .where({ presupuesto_id: presupuestoId })
      .orderBy('created_at', 'asc');
  }

  /**
   * Obtener un material pendiente por ID
   */
  async findById(id: number) {
    const result = await db('materiales_pendientes').where({ id }).first();
    return result || null;
  }

  /**
   * Crear un material pendiente
   */
  async create(data: any) {
    const [row] = await db('materiales_pendientes').insert(data).returning('*');
    return row;
  }

  /**
   * Actualizar un material pendiente
   */
  async update(id: number, data: any) {
    const [updated] = await db('materiales_pendientes')
      .where({ id })
      .update({ ...data, updated_at: db.fn.now() })
      .returning('*');
    return updated || null;
  }

  /**
   * Marcar un material como comprado completamente
   */
  async marcarComprado(id: number, precioCompra: number) {
    return this.update(id, {
      estado: 'comprado',
      cantidad_comprada: db.raw('cantidad_pendiente'),
      precio_compra: precioCompra,
      fecha_compra: new Date(),
    });
  }

  /**
   * Eliminar un material pendiente
   */
  async delete(id: number) {
    await db('materiales_pendientes').where({ id }).del();
  }
}

export default new MaterialPendienteRepository();
