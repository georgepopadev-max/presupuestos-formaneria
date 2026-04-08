// ============================================================
// CONTROLADOR: Materiales Pendientes
// Endpoints API para gestionar materiales pendientes de compra
// ============================================================

import { Request, Response, NextFunction } from 'express';
import materialPendienteService from '../services/materialPendiente.service';

/**
 * Obtener materiales pendientes de un presupuesto
 */
export const getByPresupuesto = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { presupuestoId } = req.params;
    const pendientes = await materialPendienteService.findByPresupuestoId(Number(presupuestoId));
    res.json({ success: true, data: pendientes });
  } catch (error) {
    next(error);
  }
};

/**
 * Crear materiales pendientes desde las líneas de un presupuesto
 */
export const createFromPresupuesto = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { presupuestoId } = req.params;
    const pendientes = await materialPendienteService.crearDesdePresupuesto(Number(presupuestoId));
    res.status(201).json({ success: true, data: pendientes });
  } catch (error: any) {
    next(error);
  }
};

/**
 * Marcar un material pendiente como comprado
 */
export const marcarComprado = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { precioCompra } = req.body;
    const item = await materialPendienteService.marcarComprado(Number(id), precioCompra);
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar la cantidad comprada de un material pendiente
 */
export const updateCantidad = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { cantidadComprada } = req.body;
    const item = await materialPendienteService.updateCantidad(Number(id), cantidadComprada);
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar un material pendiente
 */
export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await materialPendienteService.delete(Number(id));
    res.json({ success: true, message: 'Material pendiente eliminado' });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener resumen de materiales pendientes por proveedor
 */
export const getResumenProveedor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { presupuestoId } = req.query;
    const resumen = await materialPendienteService.getResumenPorProveedor(
      presupuestoId ? Number(presupuestoId) : undefined
    );
    res.json({ success: true, data: resumen });
  } catch (error) {
    next(error);
  }
};
