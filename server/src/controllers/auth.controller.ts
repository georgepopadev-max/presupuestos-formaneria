// ============================================================
// CONTROLADOR DE AUTENTICACIÓN
// Sistema de gestión de presupuestos y facturas para fontanería
// ============================================================

import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, nombre } = req.body;

    if (!email || !password || !nombre) {
      return res.status(400).json({ success: false, message: 'Email, password y nombre son obligatorios' });
    }

    const result = await authService.register(email, password, nombre);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    if (error.message.includes('ya está registrado')) {
      return res.status(409).json({ success: false, message: error.message });
    }
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email y password son obligatorios' });
    }

    const result = await authService.login(email, password);
    res.json({ success: true, data: result });
  } catch (error: any) {
    if (error.message.includes('Credenciales') || error.message.includes('desactivado')) {
      return res.status(401).json({ success: false, message: error.message });
    }
    next(error);
  }
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // req.user is set by auth middleware
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'No autenticado' });
    }

    const usuario = await authService.getById(userId);
    if (!usuario) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    res.json({ success: true, data: usuario });
  } catch (error) {
    next(error);
  }
};
