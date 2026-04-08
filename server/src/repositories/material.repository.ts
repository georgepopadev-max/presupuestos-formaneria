// ============================================================
// REPOSITORIO: Materiales
// Acceso a datos para materiales usando Knex
// ============================================================

import knex from 'knex';
import knexConfig from '../../knexfile';
import { Material } from '../types';

const db = knex(knexConfig);

export class MaterialRepository {
  async findAll(): Promise<Material[]> {
    return db('materiales').where({ activo: true }).orderBy('nombre', 'asc');
  }

  async findById(id: number): Promise<Material | null> {
    const result = await db('materiales').where({ id }).first();
    return result || null;
  }

  async findByCategoria(categoria: string): Promise<Material[]> {
    return db('materiales')
      .where({ categoria, activo: true })
      .orderBy('nombre', 'asc');
  }

  async findConStockBajo(): Promise<Material[]> {
    return db('materiales')
      .where('stock', '<=', db.raw('stock_minimo'))
      .where({ activo: true })
      .orderBy('nombre', 'asc');
  }

  async create(data: Partial<Material>): Promise<Material> {
    const [material] = await db('materiales').insert(data).returning('*');
    return material;
  }

  async update(id: number, data: Partial<Material>): Promise<Material | null> {
    const [updated] = await db('materiales')
      .where({ id })
      .update({ ...data, updated_at: db.fn.now() })
      .returning('*');
    return updated || null;
  }

  async delete(id: number): Promise<boolean> {
    const updated = await db('materiales')
      .where({ id })
      .update({ activo: false, updated_at: db.fn.now() });
    return updated > 0;
  }

  async actualizarStock(id: number, cantidad: number): Promise<Material | null> {
    const [updated] = await db('materiales')
      .where({ id })
      .update({
        stock: db.raw('stock + ?', [cantidad]),
        updated_at: db.fn.now(),
      })
      .returning('*');
    return updated || null;
  }
}

export default new MaterialRepository();
