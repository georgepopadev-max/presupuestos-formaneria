// ============================================================
// SERVICIO: Presupuestos
// Lógica de negocio para presupuestos
// ============================================================

import knex from 'knex';
import knexConfig from '../../knexfile';
import presupuestoRepository from '../repositories/presupuesto.repository';
import { generarNumeroPresupuesto } from '../utils/generator';
import { Presupuesto, PresupuestoLinea, Factura, FacturaLinea } from '../types';

const db = knex(knexConfig);

// Tasas de IVA por tipo
const TASAS_IVA: Record<string, number> = {
  general: 0.21,
  reducido: 0.10,
  superreducido: 0.04,
  exento: 0,
};

// Tipos de IVA válidos
const TASAS_IVA_VALIDAS = ['general', 'reducido', 'superreducido', 'exento'];

/**
 * Calcula los totales de un presupuesto a partir de sus líneas
 * Aplica el tipo de IVA correspondiente a cada línea
 */
const calcularTotales = (lineas: Partial<PresupuestoLinea>[]): { subtotal: number; iva: number; total: number } => {
  let subtotal = 0;
  let iva = 0;
  for (const linea of lineas) {
    const tipoIva = linea.tipoIva || 'general';
    if (!TASAS_IVA_VALIDAS.includes(tipoIva)) {
      throw new Error(`Tipo IVA inválido: ${tipoIva}. Valores válidos: ${TASAS_IVA_VALIDAS.join(', ')}`);
    }
    const tasa = TASAS_IVA[tipoIva];
    subtotal += linea.importe || 0;
    iva += (linea.importe || 0) * tasa;
  }
  // Redondear a 2 decimales
  subtotal = Math.round(subtotal * 100) / 100;
  iva = Math.round(iva * 100) / 100;
  return { subtotal, iva, total: Math.round((subtotal + iva) * 100) / 100 };
};

/**
 * Obtiene la siguiente secuencia para presupuestos con bloqueo de fila
 * Evita condiciones de carrera usando forUpdate en la transacción
 */
const obtenerSiguienteSecuencia = async (): Promise<number> => {
  const result = await db.transaction(async (trx) => {
    const seq = await trx('secuencias')
      .where({ clave: 'presupuesto' })
      .first()
      .forUpdate();

    if (!seq) {
      await trx('secuencias').insert({ clave: 'presupuesto', ultimo_numero: 1 });
      return 1;
    }

    const siguiente = seq.ultimo_numero + 1;
    await trx('secuencias')
      .where({ clave: 'presupuesto' })
      .update({ ultimo_numero: siguiente, updated_at: trx.fn.now() });

    return siguiente;
  });

  return result;
};

/**
 * Servicio para gestionar presupuestos
 */
export class PresupuestoService {
  /**
   * Obtener todos los presupuestos
   */
  async findAll(): Promise<Presupuesto[]> {
    return presupuestoRepository.findAll();
  }

  /**
   * Obtener un presupuesto por ID junto con sus líneas
   */
  async findById(id: number): Promise<{ presupuesto: Presupuesto; lineas: PresupuestoLinea[] } | null> {
    const presupuesto = await presupuestoRepository.findById(id);
    if (!presupuesto) return null;

    const lineas = await presupuestoRepository.findLineasByPresupuestoId(id);
    return { presupuesto, lineas };
  }

  /**
   * Crear un nuevo presupuesto
   * Genera número secuencial, calcula totales y crea con líneas
   */
  async create(data: Partial<Presupuesto>, lineas: Partial<PresupuestoLinea>[]): Promise<Presupuesto> {
    // 1. Generar siguiente secuencia con bloqueo
    const secuencia = await obtenerSiguienteSecuencia();

    // 2. Generar número de presupuesto
    const numero = generarNumeroPresupuesto(secuencia);

    // 3. Calcular subtotal, IVA y total con IVA por línea
    const { subtotal, iva, total } = calcularTotales(lineas);

    // 4. Crear presupuesto con líneas
    const presupuesto = await presupuestoRepository.create(
      { ...data, numero, subtotal, iva, total },
      lineas
    );

    return presupuesto;
  }

  /**
   * Actualizar un presupuesto existente
   * Recalcula totales si se cambian las líneas
   */
  async update(id: number, data: Partial<Presupuesto>, lineas?: Partial<PresupuestoLinea>[]): Promise<Presupuesto | null> {
    const existing = await presupuestoRepository.findById(id);
    if (!existing) return null;

    // Validar transición de estado si se está cambiando el estado
    if (data.estado && data.estado !== existing.estado) {
      const validTransitions: Record<string, string[]> = {
        borrador: ['enviado'],
        enviado: ['aceptado', 'rechazado', 'vencido'],
        aceptado: [], // Terminal para presupuesto, se factura
        rechazado: [], // Terminal
        vencido: [],    // Terminal
      };
      const allowed = validTransitions[existing.estado] || [];
      if (!allowed.includes(data.estado)) {
        throw new Error(`Transición de estado inválida: ${existing.estado} → ${data.estado}`);
      }
    }

    let updateData = { ...data };

    // Si se proporcionan nuevas líneas, recalcular totales
    if (lineas && lineas.length > 0) {
      const { subtotal, iva, total } = calcularTotales(lineas);
      updateData = { ...updateData, subtotal, iva, total };
    }

    const updated = await presupuestoRepository.update(id, updateData);

    // Si se actualizaron las líneas, eliminar las existentes e insertar las nuevas
    if (lineas && updated) {
      await db('presupuesto_lineas').where({ presupuesto_id: id }).del();

      if (lineas.length > 0) {
        const lineasConPresupuestoId = lineas.map((l) => ({
          ...l,
          presupuesto_id: id,
        }));
        await db('presupuesto_lineas').insert(lineasConPresupuestoId);
      }
    }

    return updated;
  }

  /**
   * Eliminar un presupuesto
   */
  async delete(id: number): Promise<boolean> {
    return presupuestoRepository.delete(id);
  }

  /**
   * Aceptar un presupuesto (cambia estado a 'aceptado')
   */
  async aceptar(id: number): Promise<Presupuesto | null> {
    return presupuestoRepository.update(id, { estado: 'aceptado' });
  }

  /**
   * Rechazar un presupuesto (cambia estado a 'rechazado')
   */
  async rechazar(id: number): Promise<Presupuesto | null> {
    return presupuestoRepository.update(id, { estado: 'rechazado' });
  }

  /**
   * Genera una factura a partir de un presupuesto aceptado
   * @param id - ID del presupuesto
   * @param datosAdicionales - Datos adicionales para la factura
   * @returns La factura creada
   */
  async generarFactura(id: number, datosAdicionales?: Partial<Factura>): Promise<Factura> {
    // Lazy import para evitar dependencia circular
    const { default: facturaService } = require('../services/factura.service');
    const { addDays } = require('../utils/dates');

    // 1. Obtener presupuesto con líneas
    const resultado = await this.findById(id);
    if (!resultado) throw new Error('Presupuesto no encontrado');

    const { presupuesto, lineas } = resultado;

    if (presupuesto.estado !== 'aceptado') {
      throw new Error('Solo se pueden facturar presupuestos aceptados');
    }

    // 2. Crear líneas de factura a partir de líneas de presupuesto
    const lineasFactura: Partial<FacturaLinea>[] = lineas.map(l => ({
      materialId: l.materialId,
      descripcion: l.descripcion,
      cantidad: l.cantidad,
      precioUnitario: l.precioUnitario,
      importe: l.importe,
      tipoIva: l.tipoIva || 'general',
    }));

    // 3. Crear la factura
    const facturaData: Partial<Factura> = {
      clienteId: presupuesto.clienteId,
      proyectoId: presupuesto.proyectoId,
      presupuestoId: presupuesto.id,
      fechaEmision: new Date(),
      fechaVencimiento: addDays(new Date(), 30), // 30 días para pagar
      estado: 'emitida',
      ...datosAdicionales,
    };

    const factura = await facturaService.create(facturaData, lineasFactura);

    // Marcar presupuesto como facturado
    await presupuestoRepository.update(presupuesto.id, { estado: 'facturado' });

    return factura;
  }
}

export default new PresupuestoService();
