// ============================================================
// RUTAS DE CONFIGURACIÓN
// Endpoints para acceder y modificar la configuración
// ============================================================

import { Router } from 'express';
import { getConfig, updateConfig, getEmpresaData } from '../controllers/config.controller';

const router = Router();

// GET /api/config - Obtener todas las configuraciones
router.get('/', getConfig);

// GET /api/config/empresa - Obtener datos de la empresa estructurados
router.get('/empresa', getEmpresaData);

// GET /api/config/:clave - Obtener una clave específica
router.get('/:clave', getConfig);

// POST /api/config - Actualizar una configuración
router.post('/', updateConfig);

export default router;
