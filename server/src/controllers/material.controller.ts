// ============================================================
// CONTROLADOR: Materiales
// Maneja las solicitudes HTTP para materiales
// ============================================================

import { Request, Response, NextFunction } from 'express';
import materialService from '../services/material.service';

/**
 * Obtiene todos los materiales
 * GET /api/materiales
 */
export const getAllMateriales = async (
  _req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    const materiales = await materialService.findAll();
    res.status(200).json({ success: true, data: materiales });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene un material por ID
 * GET /api/materiales/:id
 */
export const getMaterialById = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'ID inválido' });
      return;
    }

    const material = await materialService.findById(id);
    if (!material) {
      res.status(404).json({ success: false, message: 'Material no encontrado' });
      return;
    }

    res.status(200).json({ success: true, data: material });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene materiales por categoría
 * GET /api/materiales/categoria/:categoria
 */
export const getMaterialesByCategoria = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    const { categoria } = req.params;
    const materiales = await materialService.findByCategoria(categoria);
    res.status(200).json({ success: true, data: materiales });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene materiales con stock bajo
 * GET /api/materiales/stock-bajo
 */
export const getMaterialesConStockBajo = async (
  _req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    const materiales = await materialService.findConStockBajo();
    res.status(200).json({ success: true, data: materiales });
  } catch (error) {
    next(error);
  }
};

/**
 * Crea un nuevo material
 * POST /api/materiales
 */
export const createMaterial = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    const material = await materialService.create(req.body);
    res.status(201).json({ success: true, data: material });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualiza un material existente
 * PUT /api/materiales/:id
 */
export const updateMaterial = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'ID inválido' });
      return;
    }

    const material = await materialService.update(id, req.body);
    if (!material) {
      res.status(404).json({ success: false, message: 'Material no encontrado' });
      return;
    }

    res.status(200).json({ success: true, data: material });
  } catch (error) {
    next(error);
  }
};

/**
 * Elimina un material (soft delete)
 * DELETE /api/materiales/:id
 */
export const deleteMaterial = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'ID inválido' });
      return;
    }

    const eliminado = await materialService.delete(id);
    if (!eliminado) {
      res.status(404).json({ success: false, message: 'Material no encontrado' });
      return;
    }

    res.status(200).json({ success: true, message: 'Material eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualiza el stock de un material
 * PATCH /api/materiales/:id/stock
 */
export const actualizarStockMaterial = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'ID inválido' });
      return;
    }

    const { cantidad } = req.body;
    if (typeof cantidad !== 'number') {
      res.status(400).json({ success: false, message: 'La cantidad debe ser un número' });
      return;
    }

    const material = await materialService.actualizarStock(id, cantidad);
    if (!material) {
      res.status(404).json({ success: false, message: 'Material no encontrado' });
      return;
    }

    res.status(200).json({ success: true, data: material });
  } catch (error) {
    next(error);
  }
};
