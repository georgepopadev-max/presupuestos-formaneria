// ============================================================
// MIDDLEWARE DE MANEJO DE ERRORES
// ============================================================

import { Request, Response, NextFunction } from 'express';

/**
 * Interfaz para errores personalizados de la aplicación
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Middleware para manejar errores globalmente
 */
export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Por defecto, asumir error 500 (error interno)
  let statusCode = 500;
  let message = 'Error interno del servidor';

  // Si es un error conocido de la aplicación, usar su código y mensaje
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // En desarrollo, incluir el stack trace
  const response: any = {
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};
