// ============================================================
// REPOSITORIO: Precios de Mercado
// Acceso a datos para precios de mercado usando Knex
// ============================================================

import knex from 'knex';
import knexConfig from '../../knexfile';
import { PrecioMercado } from '../types';

const db = knex(knexConfig);

export class PrecioMercadoRepository {
  async findAll(): Promise<PrecioMercado[]> {
    return db('precios_mercado').orderBy('fecha_actualizacion', 'desc');
  }

  async findById(id: number): Promise<PrecioMercado | null> {
    const result = await db('precios_mercado').where({ id }).first();
    return result || null;
  }

  async findByMaterial(materialId: number): Promise<PrecioMercado[]> {
    return db('precios_mercado')
      .where({ material_id: materialId })
      .orderBy('fecha_actualizacion', 'desc');
  }

  async findByProveedor(proveedorId: number): Promise<PrecioMercado[]> {
    return db('precios_mercado')
      .where({ proveedor_id: proveedorId })
      .orderBy('fecha_actualizacion', 'desc');
  }

  async create(data: Partial<PrecioMercado>): Promise<PrecioMercado> {
    const [precio] = await db('precios_mercado').insert(data).returning('*');
    return precio;
  }

  async update(id: number, data: Partial<PrecioMercado>): Promise<PrecioMercado | null> {
    const [updated] = await db('precios_mercado')
      .where({ id })
      .update({ ...data, updated_at: db.fn.now() })
      .returning('*');
    return updated || null;
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await db('precios_mercado').where({ id }).del();
    return deleted > 0;
  }

  async obtenerMejorPrecio(materialId: number): Promise<PrecioMercado | null> {
    const result = await db('precios_mercado')
      .where({ material_id: materialId })
      .orderBy('precio', 'asc')
      .first();
    return result || null;
  }
}

export default new PrecioMercadoRepository();
