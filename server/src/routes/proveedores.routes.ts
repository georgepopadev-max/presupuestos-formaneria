// ============================================================
// RUTAS: Definición de rutas Express para Proveedores
// ============================================================

import { Router } from 'express';
import {
  getAllProveedores,
  getProveedorById,
  createProveedor,
  updateProveedor,
  deleteProveedor,
} from '../controllers/proveedor.controller';

const router = Router();

// GET /api/proveedores - Listar todos los proveedores
router.get('/', getAllProveedores);

// GET /api/proveedores/:id - Obtener un proveedor por ID
router.get('/:id', getProveedorById);

// POST /api/proveedores - Crear un nuevo proveedor
router.post('/', createProveedor);

// PUT /api/proveedores/:id - Actualizar un proveedor
router.put('/:id', updateProveedor);

// DELETE /api/proveedores/:id - Eliminar un proveedor
router.delete('/:id', deleteProveedor);

export default router;
