import { format, parseISO, isValid } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Formatea un número como moneda española (EUR)
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};

/**
 * Formatea una fecha para display (formato español)
 */
export const formatDate = (date: string | Date): string => {
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(parsed)) return 'Fecha inválida';
  return format(parsed, 'dd/MM/yyyy', { locale: es });
};

/**
 * Formatea una fecha con hora (para facturas y documentos)
 */
export const formatDateTime = (date: string | Date): string => {
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(parsed)) return 'Fecha inválida';
  return format(parsed, "dd/MM/yyyy 'a las' HH:mm", { locale: es });
};

/**
 * Formatea un número de factura con ceros a la izquierda
 */
export const formatInvoiceNumber = (numero: number): string => {
  return `F-${numero.toString().padStart(6, '0')}`;
};

/**
 * Formatea un número de presupuesto con ceros a la izquierda
 */
export const formatBudgetNumber = (numero: number): string => {
  return `P-${numero.toString().padStart(6, '0')}`;
};

/**
 * Formatea un porcentaje
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Formatea un número con separadores de miles
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('es-ES').format(num);
}