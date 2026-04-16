// ============================================================
// RUTAS: Definición de rutas Express para la API de presupuestos
// ============================================================

import { Router, Request, Response } from 'express';
import { validate } from '../middleware/validation';
import Joi from 'joi';
import {
  getAllPresupuestos,
  getPresupuestoById,
  createPresupuesto,
  updatePresupuesto,
  deletePresupuesto,
  aceptarPresupuesto,
  rechazarPresupuesto,
  generarFacturaDesdePresupuesto,
  marcarVencidosPresupuestos,
} from '../controllers/presupuesto.controller';

const router = Router();

// Esquema de validación para crear presupuesto
const crearPresupuestoSchema = Joi.object({
  data: Joi.object({
    clienteId: Joi.number().integer().required(),
    proyectoId: Joi.number().integer(),
    titulo: Joi.string().max(255).required(),
    descripcion: Joi.string().max(1000),
    estado: Joi.string().valid('borrador', 'enviado', 'aceptado', 'rechazado', 'vencido'),
    fechaValidez: Joi.date(),
    notas: Joi.string().max(1000),
  }).required(),
  lineas: Joi.array().items(
    Joi.object({
      materialId: Joi.number().integer(),
      descripcion: Joi.string().max(500).required(),
      cantidad: Joi.number().positive().required(),
      precioUnitario: Joi.number().min(0).required(),
      importe: Joi.number().min(0).required(),
      tipoIva: Joi.string().valid('general', 'reducido', 'superreducido', 'exento').default('general'),
    })
  ).required(),
});

// Esquema de validación para actualizar presupuesto
const actualizarPresupuestoSchema = Joi.object({
  data: Joi.object({
    clienteId: Joi.number().integer(),
    proyectoId: Joi.number().integer(),
    titulo: Joi.string().max(255),
    descripcion: Joi.string().max(1000),
    estado: Joi.string().valid('borrador', 'enviado', 'aceptado', 'rechazado', 'vencido'),
    fechaValidez: Joi.date(),
    notas: Joi.string().max(1000),
  }).required(),
  lineas: Joi.array().items(
    Joi.object({
      materialId: Joi.number().integer(),
      descripcion: Joi.string().max(500).required(),
      cantidad: Joi.number().positive().required(),
      precioUnitario: Joi.number().min(0).required(),
      importe: Joi.number().min(0).required(),
      tipoIva: Joi.string().valid('general', 'reducido', 'superreducido', 'exento').default('general'),
    })
  ),
});

// GET /api/presupuestos - Listar todos los presupuestos
router.get('/', async (_req: Request, res: Response, next) => {
  try {
    await getAllPresupuestos(_req, res, next);
  } catch (error) {
    next(error);
  }
});

// GET /api/presupuestos/:id - Obtener un presupuesto por ID con sus líneas
router.get('/:id', async (req: Request, res: Response, next) => {
  try {
    await getPresupuestoById(req, res, next);
  } catch (error) {
    next(error);
  }
});

// POST /api/presupuestos - Crear un nuevo presupuesto
router.post('/', validate(crearPresupuestoSchema), async (req: Request, res: Response, next) => {
  try {
    await createPresupuesto(req, res, next);
  } catch (error) {
    next(error);
  }
});

// PUT /api/presupuestos/:id - Actualizar un presupuesto
router.put('/:id', validate(actualizarPresupuestoSchema), async (req: Request, res: Response, next) => {
  try {
    await updatePresupuesto(req, res, next);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/presupuestos/:id - Eliminar un presupuesto
router.delete('/:id', async (req: Request, res: Response, next) => {
  try {
    await deletePresupuesto(req, res, next);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/presupuestos/:id/aceptar - Aceptar un presupuesto
router.patch('/:id/aceptar', async (req: Request, res: Response, next) => {
  try {
    await aceptarPresupuesto(req, res, next);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/presupuestos/:id/rechazar - Rechazar un presupuesto
router.patch('/:id/rechazar', async (req: Request, res: Response, next) => {
  try {
    await rechazarPresupuesto(req, res, next);
  } catch (error) {
    next(error);
  }
});

// POST /api/presupuestos/:id/facturar - Generar factura desde presupuesto
router.post('/:id/facturar', async (req: Request, res: Response, next) => {
  try {
    await generarFacturaDesdePresupuesto(req, res, next);
  } catch (error) {
    next(error);
  }
});

// POST /api/presupuestos/vencidos - Marcar presupuestos vencidos
router.post('/vencidos', async (_req: Request, res: Response, next) => {
  try {
    await marcarVencidosPresupuestos(_req, res, next);
  } catch (error) {
    next(error);
  }
});

export default router;
