// ============================================================
// REPOSITORIO: Clientes
// Acceso a datos para clientes usando Knex
// ============================================================

import knex from 'knex';
import knexConfig from '../../knexfile';
import { Cliente } from '../types';

const db = knex(knexConfig);

export class ClienteRepository {
  async findAll(): Promise<Cliente[]> {
    return db('clientes').where({ activo: true }).orderBy('nombre', 'asc');
  }

  async findById(id: number): Promise<Cliente | null> {
    const result = await db('clientes').where({ id }).first();
    return result || null;
  }

  async findActivos(): Promise<Cliente[]> {
    return db('clientes').where({ activo: true }).orderBy('nombre', 'asc');
  }

  async create(data: Partial<Cliente>): Promise<Cliente> {
    const [cliente] = await db('clientes').insert(data).returning('*');
    return cliente;
  }

  async update(id: number, data: Partial<Cliente>): Promise<Cliente | null> {
    const [updated] = await db('clientes')
      .where({ id })
      .update({ ...data, updated_at: db.fn.now() })
      .returning('*');
    return updated || null;
  }

  async delete(id: number): Promise<boolean> {
    // Soft delete
    const updated = await db('clientes')
      .where({ id })
      .update({ activo: false, updated_at: db.fn.now() });
    return updated > 0;
  }
}

export default new ClienteRepository();
