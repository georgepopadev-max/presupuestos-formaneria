// ============================================================
// REPOSITORIO: Proveedores
// Acceso a datos para proveedores usando Knex
// ============================================================

import knex from 'knex';
import knexConfig from '../../knexfile';
import { Proveedor } from '../types';

const db = knex(knexConfig);

export class ProveedorRepository {
  async findAll(): Promise<Proveedor[]> {
    return db('proveedores').where({ activo: true }).orderBy('nombre', 'asc');
  }

  async findById(id: number): Promise<Proveedor | null> {
    const result = await db('proveedores').where({ id }).first();
    return result || null;
  }

  async findActivos(): Promise<Proveedor[]> {
    return db('proveedores').where({ activo: true }).orderBy('nombre', 'asc');
  }

  async create(data: Partial<Proveedor>): Promise<Proveedor> {
    const [proveedor] = await db('proveedores').insert(data).returning('*');
    return proveedor;
  }

  async update(id: number, data: Partial<Proveedor>): Promise<Proveedor | null> {
    const [updated] = await db('proveedores')
      .where({ id })
      .update({ ...data, updated_at: db.fn.now() })
      .returning('*');
    return updated || null;
  }

  async delete(id: number): Promise<boolean> {
    const updated = await db('proveedores')
      .where({ id })
      .update({ activo: false, updated_at: db.fn.now() });
    return updated > 0;
  }
}

export default new ProveedorRepository();
