// ============================================================
// MIDDLEWARE PARA RUTAS NO ENCONTRADAS (404)
// ============================================================

import { Request, Response } from 'express';

/**
 * Middleware que intercepta solicitudes a rutas inexistentes
 * y devuelve una respuesta 404 estándar
 */
export const notFoundHandler = (
  _req: Request,
  res: Response
): void => {
  res.status(404).json({
    success: false,
    message: 'Recurso no encontrado - La ruta especificada no existe',
  });
};
