// ============================================================
// CONTROLADOR SII - SUMINISTRO INMEDIATO DE INFORMACION
// ============================================================
// Maneja las peticiones HTTP relacionadas con el SII
// y la generación de facturas electrónicas Facturae
// ============================================================

import { Request, Response, NextFunction } from 'express';
import siiService from '../services/sii.service';

/**
 * Obtiene el estado actual del SII para la empresa
 * Returns: информацию о порогах SII y текущем уровне facturación
 */
export const getSIIStatus = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const status = await siiService.getSIIStatus();
    
    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Genera y devuelve el XML Facturae para una factura específica
 * @param req.params.id ID de la factura
 * @returns XML Facturae con Content-Type application/xml
 */
export const getFacturaeXML = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const facturaId = Number(req.params.id);
    
    if (isNaN(facturaId)) {
      res.status(400).json({
        success: false,
        message: 'ID de factura inválido'
      });
      return;
    }

    const xml = await siiService.generarFacturaeXML(facturaId);
    
    // Establecer headers para descarga de XML
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=factura-${facturaId}.xml`);
    res.send(xml);
    
  } catch (error) {
    next(error);
  }
};

/**
 * Verifica si una factura requiere reporte al SII
 * @param req.params.id ID de la factura
 */
export const checkFacturaSII = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const clienteId = Number(req.params.clienteId);
    
    if (isNaN(clienteId)) {
      res.status(400).json({
        success: false,
        message: 'ID de cliente inválido'
      });
      return;
    }

    const requiereSII = await siiService.requiereSII(clienteId);
    
    res.json({
      success: true,
      data: {
        clienteId,
        requiereSII
      }
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getSIIStatus,
  getFacturaeXML,
  checkFacturaSII
};
