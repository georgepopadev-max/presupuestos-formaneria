// ============================================================
// RUTAS: Definición de rutas Express para Materiales
// ============================================================

import { Router } from 'express';
import Joi from 'joi';
import { validate } from '../middleware/validation';
import {
  getAllMateriales,
  getMaterialById,
  getMaterialesByCategoria,
  getMaterialesConStockBajo,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  actualizarStockMaterial,
} from '../controllers/material.controller';

const router = Router();

// Esquema de validación para crear/actualizar materiales
const materialSchema = Joi.object({
  nombre: Joi.string().max(255).required(),
  descripcion: Joi.string().max(1000),
  categoria: Joi.string().max(100),
  unidadMedida: Joi.string().max(20).required(),
  precioUnitario: Joi.number().min(0).required(),
  proveedorId: Joi.number().integer(),
  stock: Joi.number().integer().min(0),
  stockMinimo: Joi.number().integer().min(0),
});

// GET /api/materiales - Listar todos los materiales
router.get('/', getAllMateriales);

// GET /api/materiales/stock-bajo - Listar materiales con stock bajo
router.get('/stock-bajo', getMaterialesConStockBajo);

// GET /api/materiales/categoria/:categoria - Listar materiales por categoría
router.get('/categoria/:categoria', getMaterialesByCategoria);

// GET /api/materiales/:id - Obtener un material por ID
router.get('/:id', getMaterialById);

// POST /api/materiales - Crear un nuevo material
router.post('/', validate(materialSchema), createMaterial);

// PUT /api/materiales/:id - Actualizar un material
router.put('/:id', validate(materialSchema), updateMaterial);

// PATCH /api/materiales/:id/stock - Actualizar stock de un material
router.patch('/:id/stock', actualizarStockMaterial);

// DELETE /api/materiales/:id - Eliminar un material
router.delete('/:id', deleteMaterial);

export default router;
