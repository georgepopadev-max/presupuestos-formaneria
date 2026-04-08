// ============================================================
// RUTAS: Definición de rutas Express para Facturas
// ============================================================

import { Router, Request, Response } from 'express';
import Joi from 'joi';
import { validate } from '../middleware/validation';
import {
  getAllFacturas,
  getFacturaById,
  createFactura,
  updateFactura,
  deleteFactura,
  marcarPagadaFactura,
  getFacturaPdf,
  cancelarFactura,
} from '../controllers/factura.controller';

const router = Router();

// Esquema de validación para crear/actualizar facturas
const facturaSchema = Joi.object({
  clienteId: Joi.number().integer().required(),
  proyectoId: Joi.number().integer(),
  fechaEmision: Joi.date().required(),
  fechaVencimiento: Joi.date(),
  estado: Joi.string().valid('borrador', 'emitida', 'pagada', 'vencida', 'cancelada'),
  metodoPago: Joi.string().valid('efectivo', 'transferencia', 'tarjeta', 'bizum'),
  notas: Joi.string().max(1000),
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

// GET /api/facturas - Listar todas las facturas
router.get('/', getAllFacturas);

// GET /api/facturas/:id - Obtener una factura por ID
router.get('/:id', getFacturaById);

// GET /api/facturas/:id/pdf - Generar y descargar PDF de una factura
router.get('/:id/pdf', getFacturaPdf);

// POST /api/facturas - Crear una nueva factura
router.post('/', validate(facturaSchema), createFactura);

// PUT /api/facturas/:id - Actualizar una factura
router.put('/:id', validate(facturaSchema), updateFactura);

// PATCH /api/facturas/:id/pagar - Marcar factura como pagada
router.patch('/:id/pagar', marcarPagadaFactura);

// PATCH /api/facturas/:id/cancelar - Cancelar una factura (soft delete)
router.patch('/:id/cancelar', cancelarFactura);

// DELETE /api/facturas/:id - Eliminar una factura
router.delete('/:id', deleteFactura);

export default router;
