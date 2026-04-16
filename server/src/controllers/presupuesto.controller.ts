// ============================================================
// CONTROLADOR: Presupuestos
// Maneja las solicitudes HTTP para presupuestos
// ============================================================

import { Request, Response, NextFunction } from 'express';
import presupuestoService from '../services/presupuesto.service';

/**
 * Obtener todos los presupuestos
 * GET /api/presupuestos
 */
export const getAllPresupuestos = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const presupuestos = await presupuestoService.findAll();
    res.status(200).json({
      success: true,
      data: presupuestos,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener un presupuesto por ID con sus líneas
 * GET /api/presupuestos/:id
 */
export const getPresupuestoById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: 'ID de presupuesto inválido',
      });
      return;
    }

    const result = await presupuestoService.findById(id);

    if (!result) {
      res.status(404).json({
        success: false,
        message: 'Presupuesto no encontrado',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Crear un nuevo presupuesto
 * POST /api/presupuestos
 */
export const createPresupuesto = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { data, lineas } = req.body;

    if (!data || !data.clienteId || !data.titulo) {
      res.status(400).json({
        success: false,
        message: 'Datos de presupuesto inválidos. Se requiere: clienteId, titulo',
      });
      return;
    }

    if (!lineas || !Array.isArray(lineas)) {
      res.status(400).json({
        success: false,
        message: 'Se requiere un array de líneas para el presupuesto',
      });
      return;
    }

    const presupuesto = await presupuestoService.create(data, lineas);

    res.status(201).json({
      success: true,
      data: presupuesto,
      message: 'Presupuesto creado correctamente',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar un presupuesto existente
 * PUT /api/presupuestos/:id
 */
export const updatePresupuesto = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: 'ID de presupuesto inválido',
      });
      return;
    }

    const { data, lineas } = req.body;

    const presupuesto = await presupuestoService.update(id, data, lineas);

    if (!presupuesto) {
      res.status(404).json({
        success: false,
        message: 'Presupuesto no encontrado',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: presupuesto,
      message: 'Presupuesto actualizado correctamente',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar un presupuesto
 * DELETE /api/presupuestos/:id
 */
export const deletePresupuesto = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: 'ID de presupuesto inválido',
      });
      return;
    }

    const deleted = await presupuestoService.delete(id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: 'Presupuesto no encontrado',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Presupuesto ${id} eliminado correctamente`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Aceptar un presupuesto (cambia estado a 'aceptado')
 * PATCH /api/presupuestos/:id/aceptar
 */
export const aceptarPresupuesto = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: 'ID de presupuesto inválido',
      });
      return;
    }

    const presupuesto = await presupuestoService.aceptar(id);

    if (!presupuesto) {
      res.status(404).json({
        success: false,
        message: 'Presupuesto no encontrado',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: presupuesto,
      message: 'Presupuesto aceptado correctamente',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Rechazar un presupuesto (cambia estado a 'rechazado')
 * PATCH /api/presupuestos/:id/rechazar
 */
export const rechazarPresupuesto = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: 'ID de presupuesto inválido',
      });
      return;
    }

    const presupuesto = await presupuestoService.rechazar(id);

    if (!presupuesto) {
      res.status(404).json({
        success: false,
        message: 'Presupuesto no encontrado',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: presupuesto,
      message: 'Presupuesto rechazado correctamente',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Genera una factura a partir de un presupuesto aceptado
 * POST /api/presupuestos/:id/facturar
 */
export const generarFacturaDesdePresupuesto = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const factura = await presupuestoService.generarFactura(Number(id), req.body);
    res.status(201).json({ success: true, data: factura, message: 'Factura generada correctamente' });
  } catch (error: any) {
    if (error.message.includes('solo se pueden facturar')) {
      res.status(400).json({ success: false, message: error.message });
      return;
    }
    next(error);
  }
};

/**
 * Marca los presupuestos vencidos automáticamente
 * POST /api/presupuestos/vencidos
 */
export const marcarVencidosPresupuestos = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const count = await presupuestoService.marcarVencidos();
    res.status(200).json({
      success: true,
      message: `Se marcaron ${count} presupuestos como vencidos`,
      data: { count },
    });
  } catch (error) {
    next(error);
  }
};
