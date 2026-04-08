// ============================================================
// RUTAS: Materiales Pendientes
// Rutas API para gestionar materiales pendientes de compra
// ============================================================

import { Router } from 'express';
import {
  getByPresupuesto,
  createFromPresupuesto,
  marcarComprado,
  updateCantidad,
  remove,
  getResumenProveedor,
} from '../controllers/materialPendiente.controller';

const router = Router();

// Obtener materiales pendientes de un presupuesto
router.get('/presupuesto/:presupuestoId', getByPresupuesto);

// Crear materiales pendientes desde las líneas de un presupuesto
router.post('/presupuesto/:presupuestoId/crear', createFromPresupuesto);

// Marcar un material pendiente como comprado
router.patch('/:id/comprar', marcarComprado);

// Actualizar cantidad comprada de un material pendiente
router.patch('/:id/cantidad', updateCantidad);

// Eliminar un material pendiente
router.delete('/:id', remove);

// Obtener resumen de materiales pendientes por proveedor
router.get('/resumen/proveedor', getResumenProveedor);

export default router;
