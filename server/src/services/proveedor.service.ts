// ============================================================
// SERVICIO: Proveedores
// Lógica de negocio para proveedores
// ============================================================

import proveedorRepository from '../repositories/proveedor.repository';
import { Proveedor } from '../types';

/**
 * Servicio para gestionar proveedores
 */
export class ProveedorService {
  /**
   * Obtener todos los proveedores activos
   */
  async findAll(): Promise<Proveedor[]> {
    return proveedorRepository.findAll();
  }

  /**
   * Obtener un proveedor por ID
   */
  async findById(id: number): Promise<Proveedor | null> {
    return proveedorRepository.findById(id);
  }

  /**
   * Obtener solo proveedores activos
   */
  async findActivos(): Promise<Proveedor[]> {
    return proveedorRepository.findActivos();
  }

  /**
   * Crear un nuevo proveedor
   */
  async create(data: Partial<Proveedor>): Promise<Proveedor> {
    // Validaciones de negocio
    if (!data.nombre || data.nombre.trim() === '') {
      throw new Error('El nombre del proveedor es obligatorio');
    }

    // Asegurar que los campos requeridos tengan valores por defecto
    const proveedorData: Partial<Proveedor> = {
      ...data,
      activo: data.activo !== undefined ? data.activo : true,
    };

    return proveedorRepository.create(proveedorData);
  }

  /**
   * Actualizar un proveedor existente
   */
  async update(id: number, data: Partial<Proveedor>): Promise<Proveedor | null> {
    // Validar que el proveedor existe
    const existing = await proveedorRepository.findById(id);
    if (!existing) {
      return null;
    }

    // Validaciones de negocio
    if (data.nombre !== undefined && data.nombre.trim() === '') {
      throw new Error('El nombre del proveedor no puede estar vacío');
    }

    return proveedorRepository.update(id, data);
  }

  /**
   * Eliminar un proveedor (soft delete)
   */
  async delete(id: number): Promise<boolean> {
    // Validar que el proveedor existe
    const existing = await proveedorRepository.findById(id);
    if (!existing) {
      return false;
    }

    return proveedorRepository.delete(id);
  }
}

export default new ProveedorService();
