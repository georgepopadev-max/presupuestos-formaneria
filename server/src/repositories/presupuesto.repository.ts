// ============================================================
// REPOSITORIO: Presupuestos
// Acceso a datos para presupuestos usando Knex
// ============================================================

import knex from 'knex';
import knexConfig from '../../knexfile';
import { Presupuesto, PresupuestoLinea } from '../types';

const db = knex(knexConfig);

export class PresupuestoRepository {
  /**
   * Obtener todos los presupuestos
   */
  async findAll(): Promise<Presupuesto[]> {
    return db('presupuestos').where('activo', true).orderBy('created_at', 'desc');
  }

  /**
   * Obtener un presupuesto por ID
   */
  async findById(id: number): Promise<Presupuesto | null> {
    const result = await db('presupuestos').where({ id }).first();
    return result || null;
  }

  /**
   * Obtener líneas de un presupuesto
   */
  async findLineasByPresupuestoId(presupuestoId: number): Promise<PresupuestoLinea[]> {
    return db('presupuesto_lineas')
      .where({ presupuesto_id: presupuestoId })
      .orderBy('orden', 'asc');
  }

  /**
   * Crear un presupuesto con sus líneas
   */
  async create(data: Partial<Presupuesto>, lineas: Partial<PresupuestoLinea>[]): Promise<Presupuesto> {
    const [presupuesto] = await db('presupuestos').insert(data).returning('*');
    
    if (lineas.length > 0) {
      const lineasConPresupuestoId = lineas.map((l) => ({
        ...l,
        presupuesto_id: presupuesto.id,
      }));
      await db('presupuesto_lineas').insert(lineasConPresupuestoId);
    }
    
    return presupuesto;
  }

  /**
   * Actualizar un presupuesto
   */
  async update(id: number, data: Partial<Presupuesto>): Promise<Presupuesto | null> {
    const [updated] = await db('presupuestos')
      .where({ id })
      .update({ ...data, updated_at: db.fn.now() })
      .returning('*');
    return updated || null;
  }

  /**
   * Eliminar un presupuesto
   */
  async delete(id: number): Promise<boolean> {
    const deleted = await db('presupuestos').where({ id }).del();
    return deleted > 0;
  }
}

export default new PresupuestoRepository();
