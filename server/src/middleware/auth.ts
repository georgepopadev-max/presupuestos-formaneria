// ============================================================
// MIDDLEWARE DE AUTENTICACIÓN JWT
// Sistema de gestión de presupuestos y facturas para fontanería
// ============================================================

import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'Token no proporcionado' });
      return;
    }

    const token = authHeader.substring(7);
    const decoded = await authService.verifyToken(token);

    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token inválido o expirado' });
  }
};
