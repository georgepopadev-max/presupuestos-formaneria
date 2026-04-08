// ============================================================
// MIDDLEWARE DE VALIDACIÓN CON JOI
// ============================================================

import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

/**
 * Función de orden superior que crea un middleware de validación
 * @param schema - Esquema Joi para validar el body de la solicitud
 * @returns Middleware de validación
 */
export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, {
      abortEarly: false, // Recopilar todos los errores
      stripUnknown: true, // Eliminar campos no definidos en el esquema
    });

    if (error) {
      const errores = error.details.map((detail) => detail.message);
      res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: errores,
      });
      return;
    }

    next();
  };
};

/**
 * Middleware para validar parámetros de consulta (query params)
 * @param schema - Esquema Joi para validar query params
 */
export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errores = error.details.map((detail) => detail.message);
      res.status(400).json({
        success: false,
        message: 'Error de validación en parámetros',
        errors: errores,
      });
      return;
    }

    next();
  };
};
