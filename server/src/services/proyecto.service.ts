// ============================================================
// SERVICIO: Proyectos
// Lógica de negocio para proyectos
// ============================================================

import { Proyecto } from '../types';

export class ProyectoService {
  async findAll(): Promise<Proyecto[]> { return []; }
  async findById(id: number): Promise<Proyecto | null> { return null; }
  async findByCliente(clienteId: number): Promise<Proyecto[]> { return []; }
  async create(data: Partial<Proyecto>): Promise<Proyecto> { return {} as Proyecto; }
  async update(id: number, data: Partial<Proyecto>): Promise<Proyecto | null> { return null; }
  async delete(id: number): Promise<boolean> { return false; }
  async cambiarEstado(id: number, estado: string): Promise<Proyecto | null> { return null; }
}

export default new ProyectoService();
