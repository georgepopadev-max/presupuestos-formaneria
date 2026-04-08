// ============================================================
// SERVICIO: Materiales
// Lógica de negocio para materiales
// ============================================================

import materialRepository from '../repositories/material.repository';
import { Material } from '../types';

export class MaterialService {
  /**
   * Obtiene todos los materiales activos ordenados por nombre
   */
  async findAll(): Promise<Material[]> {
    return materialRepository.findAll();
  }

  /**
   * Obtiene un material por su ID
   * @param id - ID del material
   */
  async findById(id: number): Promise<Material | null> {
    return materialRepository.findById(id);
  }

  /**
   * Obtiene materiales filtrados por categoría
   * @param categoria - Categoría a filtrar
   */
  async findByCategoria(categoria: string): Promise<Material[]> {
    return materialRepository.findByCategoria(categoria);
  }

  /**
   * Obtiene materiales con stock bajo o igual al mínimo
   */
  async findConStockBajo(): Promise<Material[]> {
    return materialRepository.findConStockBajo();
  }

  /**
   * Crea un nuevo material
   * @param data - Datos del material a crear
   */
  async create(data: Partial<Material>): Promise<Material> {
    // Valores por defecto para campos requeridos
    const materialData = {
      ...data,
      activo: data.activo ?? true,
      stock: data.stock ?? 0,
      stockMinimo: data.stockMinimo ?? 0,
    };
    return materialRepository.create(materialData);
  }

  /**
   * Actualiza un material existente
   * @param id - ID del material a actualizar
   * @param data - Datos a actualizar
   */
  async update(id: number, data: Partial<Material>): Promise<Material | null> {
    return materialRepository.update(id, data);
  }

  /**
   * Elimina un material (soft delete - marca como inactivo)
   * @param id - ID del material a eliminar
   */
  async delete(id: number): Promise<boolean> {
    return materialRepository.delete(id);
  }

  /**
   * Actualiza el stock de un material sumando la cantidad indicada
   * @param id - ID del material
   * @param cantidad - Cantidad a añadir (puede ser negativa para restar)
   */
  async actualizarStock(id: number, cantidad: number): Promise<Material | null> {
    return materialRepository.actualizarStock(id, cantidad);
  }
}

export default new MaterialService();
