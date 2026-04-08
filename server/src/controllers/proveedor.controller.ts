// ============================================================
// CONTROLADOR: Proveedores
// Maneja las solicitudes HTTP para proveedores
// ============================================================

import { Request, Response, NextFunction } from 'express';
import proveedorService from '../services/proveedor.service';

/**
 * Obtener todos los proveedores
 */
export const getAllProveedores = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const proveedores = await proveedorService.findAll();
    res.status(200).json({ success: true, data: proveedores });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener un proveedor por ID
 */
export const getProveedorById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'ID de proveedor inválido' });
      return;
    }

    const proveedor = await proveedorService.findById(id);

    if (!proveedor) {
      res.status(404).json({ success: false, message: 'Proveedor no encontrado' });
      return;
    }

    res.status(200).json({ success: true, data: proveedor });
  } catch (error) {
    next(error);
  }
};

/**
 * Crear un nuevo proveedor
 */
export const createProveedor = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const proveedor = await proveedorService.create(req.body);
    res.status(201).json({ success: true, data: proveedor });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
      return;
    }
    next(error);
  }
};

/**
 * Actualizar un proveedor existente
 */
export const updateProveedor = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'ID de proveedor inválido' });
      return;
    }

    const proveedor = await proveedorService.update(id, req.body);

    if (!proveedor) {
      res.status(404).json({ success: false, message: 'Proveedor no encontrado' });
      return;
    }

    res.status(200).json({ success: true, data: proveedor });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
      return;
    }
    next(error);
  }
};

/**
 * Eliminar un proveedor (soft delete)
 */
export const deleteProveedor = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'ID de proveedor inválido' });
      return;
    }

    const deleted = await proveedorService.delete(id);

    if (!deleted) {
      res.status(404).json({ success: false, message: 'Proveedor no encontrado' });
      return;
    }

    res.status(200).json({ success: true, message: 'Proveedor eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};
