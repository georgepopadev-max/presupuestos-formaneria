// ============================================================
// RUTAS: Definición de rutas Express para Precios de Mercado
// ============================================================

import { Router } from 'express';
import {
  getAllPreciosMercado,
  getPrecioMercadoById,
  createPrecioMercado,
  updatePrecioMercado,
  deletePrecioMercado,
  getMejorPrecioPorMaterial
} from '../controllers/precioMercado.controller';

const router = Router();

// GET /api/precios-mercado - Listar todos los precios de mercado
router.get('/', getAllPreciosMercado);

// GET /api/precios-mercado/material/:materialId/mejor-precio - Obtener el mejor precio para un material
router.get('/material/:materialId/mejor-precio', getMejorPrecioPorMaterial);

// GET /api/precios-mercado/:id - Obtener un precio de mercado por ID
router.get('/:id', getPrecioMercadoById);

// POST /api/precios-mercado - Crear un nuevo precio de mercado
router.post('/', createPrecioMercado);

// PUT /api/precios-mercado/:id - Actualizar un precio de mercado
router.put('/:id', updatePrecioMercado);

// DELETE /api/precios-mercado/:id - Eliminar un precio de mercado
router.delete('/:id', deletePrecioMercado);

export default router;
