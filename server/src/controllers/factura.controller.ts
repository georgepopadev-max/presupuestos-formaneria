// ============================================================
// CONTROLADOR: Facturas
// Maneja las solicitudes HTTP para facturas
// ============================================================

import { Request, Response, NextFunction } from 'express';
import facturaService from '../services/factura.service';
import { Factura, FacturaLinea } from '../types';

/**
 * Obtener todas las facturas
 */
export const getAllFacturas = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const facturas = await facturaService.findAll();
    res.status(200).json({ success: true, data: facturas });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener una factura por ID
 */
export const getFacturaById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'ID inválido' });
      return;
    }

    const factura = await facturaService.findById(id);
    if (!factura) {
      res.status(404).json({ success: false, message: 'Factura no encontrada' });
      return;
    }

    res.status(200).json({ success: true, data: factura });
  } catch (error) {
    next(error);
  }
};

/**
 * Crear una nueva factura
 */
export const createFactura = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { data, lineas } = req.body as { data: Partial<Factura>; lineas: Partial<FacturaLinea>[] };

    if (!data || !data.clienteId) {
      res.status(400).json({ success: false, message: 'Faltan datos requeridos: clienteId' });
      return;
    }

    const factura = await facturaService.create(data, lineas || []);
    res.status(201).json({ success: true, data: factura });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar una factura
 */
export const updateFactura = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'ID inválido' });
      return;
    }

    const { data, lineas } = req.body as { data: Partial<Factura>; lineas?: Partial<FacturaLinea>[] };

    const factura = await facturaService.update(id, data, lineas);
    if (!factura) {
      res.status(404).json({ success: false, message: 'Factura no encontrada' });
      return;
    }

    res.status(200).json({ success: true, data: factura });
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar una factura
 */
export const deleteFactura = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'ID inválido' });
      return;
    }

    const deleted = await facturaService.delete(id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Factura no encontrada' });
      return;
    }

    res.status(200).json({ success: true, message: 'Factura eliminada correctamente' });
  } catch (error) {
    next(error);
  }
};

/**
 * Cancelar una factura (soft delete)
 */
export const cancelarFactura = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'ID inválido' });
      return;
    }

    const factura = await facturaService.cancelar(id);
    if (!factura) {
      res.status(404).json({ success: false, message: 'Factura no encontrada' });
      return;
    }

    res.status(200).json({ success: true, data: factura, message: 'Factura cancelada correctamente' });
  } catch (error) {
    next(error);
  }
};

/**
 * Marcar una factura como pagada
 */
export const marcarPagadaFactura = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'ID inválido' });
      return;
    }

    const factura = await facturaService.marcarPagada(id);
    if (!factura) {
      res.status(404).json({ success: false, message: 'Factura no encontrada' });
      return;
    }

    res.status(200).json({ success: true, data: factura, message: 'Factura marcada como pagada' });
  } catch (error) {
    next(error);
  }
};

/**
 * Generar y descargar PDF de una factura
 */
export const getFacturaPdf = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'ID inválido' });
      return;
    }

    const pdfBuffer = await facturaService.generarPdf(id);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="factura-${id}.pdf"`);
    res.status(200).send(pdfBuffer);
  } catch (error) {
    if ((error as Error).message.includes('no encontrada')) {
      res.status(404).json({ success: false, message: (error as Error).message });
    } else {
      next(error);
    }
  }
};
