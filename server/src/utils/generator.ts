// ============================================================
// GENERADOR DE NÚMEROS DE FACTURA Y PRESUPUESTO
// Genera números secuenciales con formato predefinido
// ============================================================

import { Secuencia } from '../types';

/**
 * Genera un número secuencial formateado
 * @param prefijo - Prefijo del número (ej: 'FAC-', 'PRE-')
 * @param numero - Número secuencial
 * @param digitos - Cantidad de dígitos mínimo (rellena con ceros)
 * @returns Número formateado (ej: 'FAC-2024-0001')
 */
export const generarNumeroSecuencial = (
  prefijo: string,
  numero: number,
  digitos: number = 4
): string => {
  const year = new Date().getFullYear();
  const numeroFormateado = numero.toString().padStart(digitos, '0');
  return `${prefijo}${year}-${numeroFormateado}`;
};

/**
 * Genera número de factura con formato FAC-{AÑO}-{SECUENCIA}
 * @param secuencia - Número secuencial actual
 * @returns Número de factura formateado
 */
export const generarNumeroFactura = (secuencia: number): string => {
  return generarNumeroSecuencial('FAC-', secuencia, 4);
};

/**
 * Genera número de presupuesto con formato PRE-{AÑO}-{SECUENCIA}
 * @param secuencia - Número secuencial actual
 * @returns Número de presupuesto formateado
 */
export const generarNumeroPresupuesto = (secuencia: number): string => {
  return generarNumeroSecuencial('PRE-', secuencia, 4);
};

/**
 * Genera número de proyecto con formato PROY-{AÑO}-{SECUENCIA}
 * @param secuencia - Número secuencial actual
 * @returns Número de proyecto formateado
 */
export const generarNumeroProyecto = (secuencia: number): string => {
  return generarNumeroSecuencial('PROY-', secuencia, 4);
};

/**
 * Tipos de secuencia disponibles en el sistema
 */
export const TIPOS_SECUENCIA = {
  FACTURA: 'factura',
  PRESUPUESTO: 'presupuesto',
  PROYECTO: 'proyecto',
} as const;

export type TipoSecuencia = typeof TIPOS_SECUENCIA[keyof typeof TIPOS_SECUENCIA];
