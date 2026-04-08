// ============================================================
// CONTROLADOR: Clientes
// Maneja las solicitudes HTTP para clientes
// ============================================================

import { Request, Response, NextFunction } from 'express';
import clienteService from '../services/cliente.service';

/**
 * Obtener todos los clientes
 */
export const getAllClientes = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const clientes = await clienteService.findAll();
    res.status(200).json({ success: true, data: clientes });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener un cliente por ID
 */
export const getClienteById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'ID de cliente inválido' });
      return;
    }

    const cliente = await clienteService.findById(id);

    if (!cliente) {
      res.status(404).json({ success: false, message: 'Cliente no encontrado' });
      return;
    }

    res.status(200).json({ success: true, data: cliente });
  } catch (error) {
    next(error);
  }
};

/**
 * Crear un nuevo cliente
 */
export const createCliente = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const cliente = await clienteService.create(req.body);
    res.status(201).json({ success: true, data: cliente });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
      return;
    }
    next(error);
  }
};

/**
 * Actualizar un cliente existente
 */
export const updateCliente = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'ID de cliente inválido' });
      return;
    }

    const cliente = await clienteService.update(id, req.body);

    if (!cliente) {
      res.status(404).json({ success: false, message: 'Cliente no encontrado' });
      return;
    }

    res.status(200).json({ success: true, data: cliente });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
      return;
    }
    next(error);
  }
};

/**
 * Eliminar un cliente (soft delete)
 */
export const deleteCliente = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'ID de cliente inválido' });
      return;
    }

    const deleted = await clienteService.delete(id);

    if (!deleted) {
      res.status(404).json({ success: false, message: 'Cliente no encontrado' });
      return;
    }

    res.status(200).json({ success: true, message: 'Cliente eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};
