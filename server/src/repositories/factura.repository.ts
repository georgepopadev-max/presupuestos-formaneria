// ============================================================
// REPOSITORIO: Facturas
// Acceso a datos para facturas usando Knex
// ============================================================

import knex from 'knex';
import knexConfig from '../../knexfile';
import { Factura, FacturaLinea } from '../types';

const db = knex(knexConfig);

export class FacturaRepository {
  async findAll(): Promise<Factura[]> {
    return db('facturas').orderBy('fecha_emision', 'desc');
  }

  async findByYearAndStatus(year: number, states: string[]): Promise<Factura[]> {
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31, 23, 59, 59);
    return db('facturas')
      .where('fecha_emision', '>=', startOfYear)
      .where('fecha_emision', '<=', endOfYear)
      .whereIn('estado', states)
      .orderBy('fecha_emision', 'desc');
  }

  async findById(id: number): Promise<Factura | null> {
    const result = await db('facturas').where({ id }).first();
    return result || null;
  }

  async findLineasByFacturaId(facturaId: number): Promise<FacturaLinea[]> {
    return db('factura_lineas').where({ factura_id: facturaId }).orderBy('orden', 'asc');
  }

  async deleteLineas(facturaId: number): Promise<void> {
    await db('factura_lineas').where({ factura_id: facturaId }).del();
  }

  async insertLineas(facturaId: number, lineas: Partial<FacturaLinea>[]): Promise<void> {
    const lineasConId = lineas.map(l => ({ ...l, factura_id: facturaId }));
    await db('factura_lineas').insert(lineasConId);
  }

  async create(data: Partial<Factura>, lineas: Partial<FacturaLinea>[]): Promise<Factura> {
    const [factura] = await db('facturas').insert(data).returning('*');
    if (lineas.length > 0) {
      const lineasConFacturaId = lineas.map((l) => ({ ...l, factura_id: factura.id }));
      await db('factura_lineas').insert(lineasConFacturaId);
    }
    return factura;
  }

  async update(id: number, data: Partial<Factura>): Promise<Factura | null> {
    const [updated] = await db('facturas')
      .where({ id })
      .update({ ...data, updated_at: db.fn.now() })
      .returning('*');
    return updated || null;
  }

  async delete(id: number): Promise<boolean> {
    // Soft delete: cambia estado a 'cancelada' en lugar de eliminar el registro
    const updated = await db('facturas')
      .where({ id })
      .update({ estado: 'cancelada', updated_at: db.fn.now() });
    return updated > 0;
  }
}

export default new FacturaRepository();
