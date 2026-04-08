// ============================================================
// TIPOS Y INTERFACES PARA EL SISTEMA SII
// ============================================================
// Define las estructuras de datos utilizadas por el SII
// y la generación de XML Facturae
// ============================================================

import { Factura, Cliente, FacturaLinea } from './index';

/**
 * Estado del SII para la empresa
 */
export interface SIIService {
  /**
   * Verifica si un cliente requiere reporte al SII
   * @param clienteId ID del cliente
   * @returns true si requiere SII
   */
  requiereSII(clienteId: number): Promise<boolean>;

  /**
   * Genera el XML Facturae para una factura
   * @param facturaId ID de la factura
   * @returns String XML Facturae
   */
  generarFacturaeXML(facturaId: number): Promise<string>;

  /**
   * Obtiene el estado actual del SII
   * @returns Estado y métricas del SII
   */
  getSIIStatus(): Promise<{
    requiereSII: boolean;
    facturasAnuales: number;
    facturacionAnual: number;
    umbralFacturas: number;
    umbralFacturacion: number;
  }>;
}

/**
 * Datos de la empresa emitente (vendedor)
 */
export interface DatosEmisor {
  nombre: string;
  nif: string;
  direccion: string;
  codigoPostal?: string;
  ciudad?: string;
  provincia?: string;
  pais?: string; // Código ISO 3166-1 alpha-2, default 'ES'
}

/**
 * Datos del receptor (comprador/cliente)
 */
export interface DatosReceptor {
  nombre: string;
  nif?: string;
  cif?: string;
  direccion?: string;
  codigoPostal?: string;
  ciudad?: string;
  provincia?: string;
  pais?: string;
}

/**
 * Línea de factura para Facturae
 */
export interface LineaFacturae {
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  importe: number;
  tipoIVA: number; // Porcentaje: 21, 10, 4, 0
  baseImponible: number;
  cuotaIVA: number;
}

/**
 * Estructura de una factura para generar Facturae
 */
export interface FacturaeData {
  numeroFactura: string;
  serie: string;
  fechaEmision: string; // Formato: DD-MM-AAAA
  fechaVencimiento?: string;
  cliente: DatosReceptor;
  emisor: DatosEmisor;
  lineas: LineaFacturae[];
  subtotal: number;
  totalIVA: number;
  total: number;
  formaPago?: string;
  observaciones?: string;
}

/**
 * Respuesta del registro SII
 */
export interface SIIRegistroResponse {
  success: boolean;
  numeroRegistro?: string;
  codigoError?: string;
  descripcionError?: string;
  timestamp?: string;
}
