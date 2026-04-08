// ============================================================
// UTILIDADES: Fechas
// Funciones auxiliares para manejo de fechas
// ============================================================

/**
 * Suma días a una fecha
 * @param date - Fecha base
 * @param days - Cantidad de días a sumar
 * @returns Nueva fecha con los días sumados
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};
