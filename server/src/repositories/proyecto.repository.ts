// ============================================================
// REPOSITORIO: Proyectos
// Acceso a datos para proyectos usando Knex
// ============================================================

import knex from 'knex';
import knexConfig from '../../knexfile';
import { Proyecto } from '../types';

const db = knex(knexConfig);

export class ProyectoRepository {
  async findAll(): Promise<Proyecto[]> {
    return db('proyectos').orderBy('created_at', 'desc');
  }

  async findById(id: number): Promise<Proyecto | null> {
    const result = await db('proyectos').where({ id }).first();
    return result || null;
  }

  async findByCliente(clienteId: number): Promise<Proyecto[]> {
    return db('proyectos').where({ cliente_id: clienteId }).orderBy('created_at', 'desc');
  }

  async create(data: Partial<Proyecto>): Promise<Proyecto> {
    const [proyecto] = await db('proyectos').insert(data).returning('*');
    return proyecto;
  }

  async update(id: number, data: Partial<Proyecto>): Promise<Proyecto | null> {
    const [updated] = await db('proyectos')
      .where({ id })
      .update({ ...data, updated_at: db.fn.now() })
      .returning('*');
    return updated || null;
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await db('proyectos').where({ id }).del();
    return deleted > 0;
  }
}

export default new ProyectoRepository();
