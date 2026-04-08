// ============================================================
// SERVICIO SII - SUMINISTRO INMEDIATO DE INFORMACION
// ============================================================
// Este servicio gestiona todo lo relacionado con el SII,
// el sistema de吐漏Immediate Information Supply" de la AEAT.
//
// El SII es obligatorio para:
// - Empresas con facturación anual > 6.000.000 €
// - Empresas con más de 3.000 facturas emitidas/recibidas al año
//
// Para una empresa pequeña de fontanería (2 empleados, negocio nuevo),
// el SII NO es necesario de momento, pero preparamos la infraestructura.
// ============================================================

import { SIIService } from '../types/sii.types';
import { generarFacturaeXML } from '../utils/facturaeGenerator';
import clienteRepository from '../repositories/cliente.repository';
import facturaRepository from '../repositories/factura.repository';
import { Factura } from '../types';

/**
 * Implementación del servicio SII
 * Maneja la lógica de negocio relacionada con el SII y Facturae
 */
class SIIServiceImpl implements SIIService {
  
  /**
   * Verifica si un cliente específico necesita reporte al SII
   * Por ahora, siempre retorna false hasta que se alcancen los umbrales
   * 
   * @param clienteId - ID del cliente a verificar
   * @returns true si el cliente requiere reporte SII
   */
  async requiereSII(clienteId: number): Promise<boolean> {
    // TODO: Implementar lógica real cuando se alcancen umbrales
    // Por ahora, empresa pequeña no requiere SII
    return false;
  }

  /**
   * Genera el XML Facturae para una factura específica
   * Este es el formato estándar requerido para facturas electrónicas
   * en España y para el SII
   * 
   * @param facturaId - ID de la factura a convertir
   * @returns String con el XML Facturae 3.2
   */
  async generarFacturaeXML(facturaId: number): Promise<string> {
    try {
      // Obtener datos de la factura desde el repositorio
      const factura = await facturaRepository.findById(facturaId);
      
      if (!factura) {
        throw new Error(`Factura con ID ${facturaId} no encontrada`);
      }

      // Obtener datos del cliente
      const cliente = await clienteRepository.findById(factura.clienteId);
      
      if (!cliente) {
        throw new Error(`Cliente con ID ${factura.clienteId} no encontrado`);
      }

      // Obtener líneas de la factura
      const lineas = await facturaRepository.findLineasByFacturaId(facturaId);

      // Datos de la empresa (emisor) - estos vendrían de configuración
      const empresaDatos = {
        nombre: process.env.EMPRESA_NOMBRE || 'Fontanería Ejemplo SL',
        nif: process.env.EMPRESA_NIF || 'B12345678',
        direccion: process.env.EMPRESA_DIRECCION || 'Calle Ejemplo, 123'
      };

      // Generar el XML Facturae
      return generarFacturaeXML(factura, cliente, lineas, empresaDatos);
      
    } catch (error) {
      console.error('Error generando XML Facturae:', error);
      throw error;
    }
  }

  /**
   * Obtiene el estado actual del SII para la empresa
   * Calcula los totales anuales de facturación y número de facturas
   * 
   * @returns Objeto con el estado del SII y umbrales actuales
   */
  async getSIIStatus(): Promise<{
    requiereSII: boolean;
    facturasAnuales: number;
    facturacionAnual: number;
    umbralFacturas: number;
    umbralFacturacion: number;
  }> {
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1); // 1 de enero
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59); // 31 de diciembre

    try {
      // Obtener facturas del año actual
      const facturas: Factura[] = await facturaRepository.findAll();
      
      // Filtrar por año y estado (solo emitidas o pagadas cuentan)
      const facturasAnuales = facturas.filter((f: Factura) => {
        const fechaEmision = new Date(f.fechaEmision);
        return fechaEmision >= startOfYear && 
               fechaEmision <= endOfYear &&
               ['emitida', 'pagada'].includes(f.estado);
      });

      // Calcular facturación anual
      const facturacionAnual = facturasAnuales.reduce(
        (sum: number, f: Factura) => sum + f.total, 
        0
      );

      // Verificar umbrales del SII
      const umbralFacturas = 3000;
      const umbralFacturacion = 6000000; // 6 millones de euros

      const requiereSII = (
        facturasAnuales.length > umbralFacturas || 
        facturacionAnual > umbralFacturacion
      );

      return {
        requiereSII,
        facturasAnuales: facturasAnuales.length,
        facturacionAnual,
        umbralFacturas,
        umbralFacturacion
      };

    } catch (error) {
      console.error('Error calculando estado SII:', error);
      // En caso de error, asumimos que no requiere SII
      return {
        requiereSII: false,
        facturasAnuales: 0,
        facturacionAnual: 0,
        umbralFacturas: 3000,
        umbralFacturacion: 6000000
      };
    }
  }

  /**
   * Registra una factura en el sistema SII (cuando sea obligatorio)
   * Por ahora es un stub - la implementación real requeriría:
   * - Firma digital del XML
   * - Conexión con los servicios web de la AEAT
   * - Manejo de respuestas y errores del sistema SII
   * 
   * @param facturaId - ID de la factura a registrar
   * @returns Resultado del registro
   */
  async registrarEnSII(facturaId: number): Promise<{
    success: boolean;
    numeroRegistro?: string;
    error?: string;
  }> {
    // TODO: Implementar conexión real con SII de la AEAT
    // Esto requerirá:
    // 1. Certificado digital de la empresa
    // 2. Cliente SOAP para los web services de la AEAT
    // 3. Firma digital del XML Facturae
    // 4. Manejo de estados y rectificaciones
    
    console.log(`[SII] Registro solicitado para factura ${facturaId}`);
    
    return {
      success: false,
      error: 'SII no implementado aún - la empresa no ha alcanzado los umbrales'
    };
  }
}

// Exportar instancia singleton del servicio
export default new SIIServiceImpl();
