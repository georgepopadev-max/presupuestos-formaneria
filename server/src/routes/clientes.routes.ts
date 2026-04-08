// ============================================================
// RUTAS: Definición de rutas Express para Clientes
// ============================================================

import { Router } from 'express';
import Joi from 'joi';
import { validate } from '../middleware/validation';
import {
  getAllClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente,
} from '../controllers/cliente.controller';

const router = Router();

// Esquema de validación para crear/actualizar clientes
const clienteSchema = Joi.object({
  nombre: Joi.string().max(255).required(),
  telefono: Joi.string().max(20),
  email: Joi.string().email().max(255),
  direccion: Joi.string().max(500),
  ciudad: Joi.string().max(100),
  codigoPostal: Joi.string().max(10),
  nif: Joi.string().max(20),
  observaciones: Joi.string().max(1000),
  activo: Joi.boolean(),
});

// GET /api/clientes - Listar todos los clientes
router.get('/', getAllClientes);

// GET /api/clientes/:id - Obtener un cliente por ID
router.get('/:id', getClienteById);

// POST /api/clientes - Crear un nuevo cliente
router.post('/', validate(clienteSchema), createCliente);

// PUT /api/clientes/:id - Actualizar un cliente
router.put('/:id', validate(clienteSchema), updateCliente);

// DELETE /api/clientes/:id - Eliminar un cliente (soft delete)
router.delete('/:id', deleteCliente);

export default router;
