// ============================================================
// SERVICIO: Precios de Mercado
// Lógica de negocio para precios de mercado
// ============================================================

import precioMercadoRepository from '../repositories/precioMercado.repository';
import { PrecioMercado } from '../types';

export class PrecioMercadoService {
  /**
   * Obtiene todos los precios de mercado
   */
  async findAll(): Promise<PrecioMercado[]> {
    return precioMercadoRepository.findAll();
  }

  /**
   * Obtiene un precio de mercado por su ID
   */
  async findById(id: number): Promise<PrecioMercado | null> {
    return precioMercadoRepository.findById(id);
  }

  /**
   * Obtiene los precios de mercado para un material específico
   */
  async findByMaterial(materialId: number): Promise<PrecioMercado[]> {
    return precioMercadoRepository.findByMaterial(materialId);
  }

  /**
   * Obtiene los precios de mercado para un proveedor específico
   */
  async findByProveedor(proveedorId: number): Promise<PrecioMercado[]> {
    return precioMercadoRepository.findByProveedor(proveedorId);
  }

  /**
   * Crea un nuevo precio de mercado
   */
  async create(data: Partial<PrecioMercado>): Promise<PrecioMercado> {
    return precioMercadoRepository.create(data);
  }

  /**
   * Actualiza un precio de mercado existente
   */
  async update(id: number, data: Partial<PrecioMercado>): Promise<PrecioMercado | null> {
    return precioMercadoRepository.update(id, data);
  }

  /**
   * Elimina un precio de mercado
   */
  async delete(id: number): Promise<boolean> {
    return precioMercadoRepository.delete(id);
  }

  /**
   * Obtiene el mejor precio (más bajo) para un material específico
   */
  async obtenerMejorPrecio(materialId: number): Promise<PrecioMercado | null> {
    return precioMercadoRepository.obtenerMejorPrecio(materialId);
  }
}

export default new PrecioMercadoService();
