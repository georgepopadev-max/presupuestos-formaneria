// ============================================================
// CONTROLADOR DE CONFIGURACIÓN
// Endpoints para gestionar la configuración de la empresa
// ============================================================

import { Request, Response, NextFunction } from 'express';
import configService from '../services/config.service';

/**
 * Obtiene una clave específica o todas las configuraciones
 * GET /api/config
 * GET /api/config/:clave
 */
export const getConfig = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { clave } = req.params;
    if (clave) {
      const valor = await configService.get(clave);
      return res.json({ success: true, data: valor });
    }
    const all = await configService.getAll();
    res.json({ success: true, data: all });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualiza una clave de configuración
 * POST /api/config
 */
export const updateConfig = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { clave, valor } = req.body;
    if (!clave || valor === undefined) {
      return res.status(400).json({ success: false, message: 'Se requiere clave y valor' });
    }
    await configService.set(clave, valor);
    res.json({ success: true, message: 'Configuración actualizada' });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene los datos de la empresa de forma estructurada
 * GET /api/config/empresa
 */
export const getEmpresaData = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await configService.getEmpresaConfig();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
