// ============================================================
// SERVICIO: Facturas
// Lógica de negocio para facturas
// ============================================================

import knex from 'knex';
import knexConfig from '../../knexfile';
import facturaRepository from '../repositories/factura.repository';
import clienteRepository from '../repositories/cliente.repository';
import { generarNumeroFactura } from '../utils/generator';
import { generarPdfFactura, PdfOptions } from '../utils/pdfGenerator';
import { Factura, FacturaLinea } from '../types';

const db = knex(knexConfig);

// Tasas de IVA por tipo
const TASAS_IVA: Record<string, number> = {
  general: 0.21,
  reducido: 0.10,
  superreducido: 0.04,
  exento: 0,
};

/**
 * Calcula los totales de una factura a partir de sus líneas
 * Aplica el tipo de IVA correspondiente a cada línea
 */
const calcularTotales = (lineas: Partial<FacturaLinea>[]): { subtotal: number; iva: number; total: number } => {
  let subtotal = 0;
  let iva = 0;
  for (const linea of lineas) {
    const tasa = TASAS_IVA[linea.tipoIva || 'general'];
    subtotal += linea.importe || 0;
    iva += (linea.importe || 0) * tasa;
  }
  // Redondear a 2 decimales
  subtotal = Math.round(subtotal * 100) / 100;
  iva = Math.round(iva * 100) / 100;
  return { subtotal, iva, total: Math.round((subtotal + iva) * 100) / 100 };
};

/**
 * Obtiene la siguiente secuencia para facturas con bloqueo de fila
 * Evita condiciones de carrera usando forUpdate en la transacción
 */
const obtenerSiguienteSecuencia = async (): Promise<number> => {
  const result = await db.transaction(async (trx) => {
    const seq = await trx('secuencias')
      .where({ clave: 'factura' })
      .first()
      .forUpdate();

    if (!seq) {
      await trx('secuencias').insert({ clave: 'factura', ultimo_numero: 1 });
      return 1;
    }

    const siguiente = seq.ultimo_numero + 1;
    await trx('secuencias')
      .where({ clave: 'factura' })
      .update({ ultimo_numero: siguiente, updated_at: trx.fn.now() });

    return siguiente;
  });

  return result;
};

export class FacturaService {
  /**
   * Obtiene todas las facturas
   */
  async findAll(): Promise<Factura[]> {
    return facturaRepository.findAll();
  }

  /**
   * Obtiene una factura por ID con sus líneas y datos del cliente
   */
  async findById(id: number): Promise<(Factura & { cliente?: any; lineas?: FacturaLinea[] }) | null> {
    const factura = await facturaRepository.findById(id);
    if (!factura) return null;

    const lineas = await facturaRepository.findLineasByFacturaId(id);
    const cliente = await clienteRepository.findById(factura.clienteId);

    return { ...factura, cliente, lineas };
  }

  /**
   * Crea una nueva factura con sus líneas
   * Calcula totales con IVA por línea
   */
  async create(data: Partial<Factura>, lineas: Partial<FacturaLinea>[]): Promise<Factura> {
    // Generar número secuencial con bloqueo
    const secuencia = await obtenerSiguienteSecuencia();
    const numero = generarNumeroFactura(secuencia);

    // Calcular totales con IVA por línea
    const { subtotal, iva, total } = calcularTotales(lineas);

    const facturaData: Partial<Factura> = {
      ...data,
      numero,
      subtotal,
      iva,
      total,
      estado: data.estado || 'borrador',
    };

    return facturaRepository.create(facturaData, lineas);
  }

  /**
   * Actualiza una factura existente
   */
  async update(id: number, data: Partial<Factura>, lineas?: Partial<FacturaLinea>[]): Promise<Factura | null> {
    const existing = await facturaRepository.findById(id);
    if (!existing) return null;

    let updateData = { ...data };

    if (lineas) {
      // Eliminar líneas existentes e insertar las nuevas
      await facturaRepository.deleteLineas(id);
      await facturaRepository.insertLineas(id, lineas);

      // Recalcular totales con tipos de IVA específicos
      const { subtotal, iva, total } = calcularTotales(lineas);
      updateData = { ...updateData, subtotal, iva, total };
    }

    const updated = await facturaRepository.update(id, updateData);
    return updated;
  }

  /**
   * Elimina una factura (soft delete: cambia estado a cancelada)
   */
  async delete(id: number): Promise<boolean> {
    return facturaRepository.delete(id);
  }

  /**
   * Cancela una factura (soft delete)
   */
  async cancelar(id: number): Promise<Factura | null> {
    return facturaRepository.update(id, { estado: 'cancelada' });
  }

  /**
   * Marca una factura como pagada
   */
  async marcarPagada(id: number): Promise<Factura | null> {
    return facturaRepository.update(id, { estado: 'pagada' });
  }

  /**
   * Genera el PDF de una factura
   */
  async generarPdf(id: number, options: PdfOptions = {}): Promise<Buffer> {
    const facturaConRelaciones = await this.findById(id);
    if (!facturaConRelaciones) {
      throw new Error(`Factura ${id} no encontrada`);
    }

    const { cliente, lineas = [], ...factura } = facturaConRelaciones;

    if (!cliente) {
      throw new Error(`Cliente de la factura ${id} no encontrado`);
    }

    return generarPdfFactura(factura as Factura, cliente, lineas, options);
  }
}

export default new FacturaService();
