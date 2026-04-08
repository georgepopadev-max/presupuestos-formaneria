// ============================================================
// CONTROLADOR: Proyectos
// Maneja las solicitudes HTTP para proyectos
// ============================================================

import { Request, Response, NextFunction } from 'express';

export const getAllProyectos = async (
  _req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    res.status(200).json({ success: true, data: [], message: 'Por implementar' });
  } catch (error) { next(error); }
};

export const getProyectoById = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    res.status(200).json({ success: true, data: { id: req.params.id }, message: 'Por implementar' });
  } catch (error) { next(error); }
};

export const createProyecto = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    res.status(201).json({ success: true, data: req.body, message: 'Por implementar' });
  } catch (error) { next(error); }
};

export const updateProyecto = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    res.status(200).json({ success: true, data: { id: req.params.id, ...req.body }, message: 'Por implementar' });
  } catch (error) { next(error); }
};

export const deleteProyecto = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    res.status(200).json({ success: true, message: `Proyecto ${req.params.id} eliminado` });
  } catch (error) { next(error); }
};
