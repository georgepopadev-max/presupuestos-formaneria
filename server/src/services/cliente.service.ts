// ============================================================
// SERVICIO: Clientes
// Lógica de negocio para clientes
// ============================================================

import clienteRepository from '../repositories/cliente.repository';
import { Cliente } from '../types';

/**
 * Servicio para gestionar clientes
 */
export class ClienteService {
  /**
   * Obtener todos los clientes activos
   */
  async findAll(): Promise<Cliente[]> {
    return clienteRepository.findAll();
  }

  /**
   * Obtener un cliente por ID
   */
  async findById(id: number): Promise<Cliente | null> {
    return clienteRepository.findById(id);
  }

  /**
   * Obtener solo clientes activos
   */
  async findActivos(): Promise<Cliente[]> {
    return clienteRepository.findActivos();
  }

  /**
   * Crear un nuevo cliente
   */
  async create(data: Partial<Cliente>): Promise<Cliente> {
    // Validaciones de negocio
    if (!data.nombre || data.nombre.trim() === '') {
      throw new Error('El nombre del cliente es obligatorio');
    }

    // Asegurar que los campos requeridos tengan valores por defecto
    const clienteData: Partial<Cliente> = {
      ...data,
      activo: data.activo !== undefined ? data.activo : true,
    };

    return clienteRepository.create(clienteData);
  }

  /**
   * Actualizar un cliente existente
   */
  async update(id: number, data: Partial<Cliente>): Promise<Cliente | null> {
    // Validar que el cliente existe
    const existing = await clienteRepository.findById(id);
    if (!existing) {
      return null;
    }

    // Validaciones de negocio
    if (data.nombre !== undefined && data.nombre.trim() === '') {
      throw new Error('El nombre del cliente no puede estar vacío');
    }

    return clienteRepository.update(id, data);
  }

  /**
   * Eliminar un cliente (soft delete)
   */
  async delete(id: number): Promise<boolean> {
    // Validar que el cliente existe
    const existing = await clienteRepository.findById(id);
    if (!existing) {
      return false;
    }

    return clienteRepository.delete(id);
  }
}

export default new ClienteService();
