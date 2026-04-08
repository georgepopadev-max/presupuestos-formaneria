import type { Cliente, Proveedor, Presupuesto, Factura, Material } from '../types';

/**
 * Valida un email con expresión regular
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida un CIF/NIF español
 */
export const isValidCIF = (cif: string): boolean => {
  // Formato básico: 8 números + 1 letra o 1 letra + 7 números + 1 letra
  const cifRegex = /^[A-Z]{1}[0-9]{8}|[0-9]{8}[A-Z]{1}$/i;
  return cifRegex.test(cif) && cif.length === 9;
};

/**
 * Valida un número de teléfono español
 */
export const isValidPhone = (phone: string): boolean => {
  // Acepta formatos: +34XXXXXXXXX, 9XXXXXXXX, 6XXXXXXXX
  const phoneRegex = /^(\+34)?[6-9][0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Valida que un objeto Cliente tenga todos los campos requeridos
 */
export const validateCliente = (cliente: Partial<Cliente>): string[] => {
  const errors: string[] = [];
  
  if (!cliente.nombre?.trim()) {
    errors.push('El nombre es obligatorio');
  }
  if (!cliente.cif?.trim()) {
    errors.push('El CIF es obligatorio');
  } else if (!isValidCIF(cliente.cif)) {
    errors.push('El CIF no tiene un formato válido');
  }
  if (cliente.email && !isValidEmail(cliente.email)) {
    errors.push('El email no tiene un formato válido');
  }
  if (cliente.telefono && !isValidPhone(cliente.telefono)) {
    errors.push('El teléfono no tiene un formato válido');
  }
  
  return errors;
};

/**
 * Valida que un objeto Proveedor tenga todos los campos requeridos
 */
export const validateProveedor = (proveedor: Partial<Proveedor>): string[] => {
  const errors: string[] = [];
  
  if (!proveedor.nombre?.trim()) {
    errors.push('El nombre es obligatorio');
  }
  if (!proveedor.cif?.trim()) {
    errors.push('El CIF es obligatorio');
  } else if (!isValidCIF(proveedor.cif)) {
    errors.push('El CIF no tiene un formato válido');
  }
  if (proveedor.email && !isValidEmail(proveedor.email)) {
    errors.push('El email no tiene un formato válido');
  }
  
  return errors;
};

/**
 * Valida que un Material tenga precio y stock válidos
 */
export const validateMaterial = (material: Partial<Material>): string[] => {
  const errors: string[] = [];
  
  if (!material.nombre?.trim()) {
    errors.push('El nombre es obligatorio');
  }
  if (material.precioUnitario === undefined || material.precioUnitario < 0) {
    errors.push('El precio debe ser un valor positivo');
  }
  if (material.stock !== undefined && material.stock < 0) {
    errors.push('El stock no puede ser negativo');
  }
  
  return errors;
};

/**
 * Valida que un Presupuesto tenga al menos una línea
 */
export const validatePresupuesto = (presupuesto: Partial<Presupuesto>): string[] => {
  const errors: string[] = [];
  
  if (!presupuesto.clienteId) {
    errors.push('Debe seleccionar un cliente');
  }
  if (!presupuesto.lineas || presupuesto.lineas.length === 0) {
    errors.push('El presupuesto debe tener al menos una línea');
  }
  
  return errors;
};

/**
 * Valida que una Factura tenga al menos una línea
 */
export const validateFactura = (factura: Partial<Factura>): string[] => {
  const errors: string[] = [];
  
  if (!factura.clienteId) {
    errors.push('Debe seleccionar un cliente');
  }
  if (!factura.lineas || factura.lineas.length === 0) {
    errors.push('La factura debe tener al menos una línea');
  }
  
  return errors;
};

/**
 * Calcula el subtotal de un conjunto de líneas
 */
export const calculateSubtotal = (lineas: Array<{ cantidad: number; precioUnitario: number }>): number => {
  return lineas.reduce((sum, linea) => sum + (linea.cantidad * linea.precioUnitario), 0);
};

/**
 * Calcula el IVA (21% estándar en España)
 */
export const calculateIVA = (subtotal: number, tasa: number = 21): number => {
  return subtotal * (tasa / 100);
};

/**
 * Calcula el total (subtotal + IVA)
 */
export const calculateTotal = (subtotal: number, iva: number): number => {
  return subtotal + iva;
};