// ============================================================
// CONTROLADOR: Precios de Mercado
// Maneja las solicitudes HTTP para precios de mercado
// ============================================================

import { Request, Response, NextFunction } from 'express';
import precioMercadoService from '../services/precioMercado.service';

/**
 * GET /api/precios-mercado
 * Obtiene todos los precios de mercado
 */
export const getAllPreciosMercado = async (
  _req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    const precios = await precioMercadoService.findAll();
    res.status(200).json({ success: true, data: precios });
  } catch (error) { next(error); }
};

/**
 * GET /api/precios-mercado/:id
 * Obtiene un precio de mercado por su ID
 */
export const getPrecioMercadoById = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'ID inválido' });
      return;
    }
    const precio = await precioMercadoService.findById(id);
    if (!precio) {
      res.status(404).json({ success: false, message: 'Precio de mercado no encontrado' });
      return;
    }
    res.status(200).json({ success: true, data: precio });
  } catch (error) { next(error); }
};

/**
 * POST /api/precios-mercado
 * Crea un nuevo precio de mercado
 */
export const createPrecioMercado = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    const precio = await precioMercadoService.create(req.body);
    res.status(201).json({ success: true, data: precio });
  } catch (error) { next(error); }
};

/**
 * PUT /api/precios-mercado/:id
 * Actualiza un precio de mercado existente
 */
export const updatePrecioMercado = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'ID inválido' });
      return;
    }
    const precio = await precioMercadoService.update(id, req.body);
    if (!precio) {
      res.status(404).json({ success: false, message: 'Precio de mercado no encontrado' });
      return;
    }
    res.status(200).json({ success: true, data: precio });
  } catch (error) { next(error); }
};

/**
 * DELETE /api/precios-mercado/:id
 * Elimina un precio de mercado
 */
export const deletePrecioMercado = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'ID inválido' });
      return;
    }
    const deleted = await precioMercadoService.delete(id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Precio de mercado no encontrado' });
      return;
    }
    res.status(200).json({ success: true, message: 'Precio de mercado eliminado correctamente' });
  } catch (error) { next(error); }
};

/**
 * GET /api/precios-mercado/material/:materialId/mejor-precio
 * Obtiene el mejor precio (más bajo) para un material específico
 */
export const getMejorPrecioPorMaterial = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    const materialId = parseInt(req.params.materialId, 10);
    if (isNaN(materialId)) {
      res.status(400).json({ success: false, message: 'ID de material inválido' });
      return;
    }
    const precio = await precioMercadoService.obtenerMejorPrecio(materialId);
    if (!precio) {
      res.status(404).json({ success: false, message: 'No se encontró precio para este material' });
      return;
    }
    res.status(200).json({ success: true, data: precio });
  } catch (error) { next(error); }
};
