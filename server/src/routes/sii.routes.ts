// ============================================================
// RUTAS SII - SUMINISTRO INMEDIATO DE INFORMACION
// ============================================================
// Rutas API para el sistema SII y facturación electrónica
//
// GET  /api/sii/status           - Estado actual del SII
// GET  /api/sii/factura/:id/xml  - Genera XML Facturae de una factura
// GET  /api/sii/cliente/:id     - Verifica si un cliente requiere SII
// ============================================================

import { Router } from 'express';
import { getSIIStatus, getFacturaeXML, checkFacturaSII } from '../controllers/sii.controller';

const router: Router = Router();

/**
 * GET /api/sii/status
 * Obtiene el estado actual del SII para la empresa
 */
router.get('/status', getSIIStatus);

/**
 * GET /api/sii/factura/:id/xml
 * Genera y descarga el XML Facturae para una factura específica
 */
router.get('/factura/:id/xml', getFacturaeXML);

/**
 * GET /api/sii/cliente/:clienteId
 * Verifica si un cliente específico requiere reporte al SII
 */
router.get('/cliente/:clienteId', checkFacturaSII);

export default router;
