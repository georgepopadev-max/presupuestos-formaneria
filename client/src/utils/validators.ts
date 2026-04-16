import type { Cliente, Proveedor, Presupuesto, Factura, Material } from '../types';

/**
 * Valida un email con expresión regular
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida un CIF/NIF español con checksum
 * NIF: 8 dígitos + 1 letra (excluyendo vocales y XYZ)
 * CIF: 1 letra + 7 números + 1 letra/dígito (algoritmo de control)
 */
export const isValidCIF = (cif: string): boolean => {
  const clean = cif.toUpperCase().trim();
  if (clean.length !== 9) return false;

  const nifRegex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKET]$/i;
  if (nifRegex.test(clean)) {
    // NIF: validar letra de control
    const numbers = parseInt(clean.slice(0, 8), 10);
    const letter = clean[8].toUpperCase();
    const controlLetters = 'TRWAGMYFPDXBNJZSQVHLCKET';
    return letter === controlLetters[numbers % 23];
  }

  const cifRegex = /^[ABCDEFGHJPQRSUVNW][0-9]{7}[0-9A-J]$/i;
  if (cifRegex.test(clean)) {
    // CIF: algoritmo de control
    const letters = 'JABCDEFGHI'.split('');
    let sum = 0;
    let isEven = false;
    for (let i = 6; i >= 0; i--) {
      let digit = parseInt(clean[i + 1], 10);
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      isEven = !isEven;
    }
    const controlDigit = (10 - (sum % 10)) % 10;
    const lastChar = clean[8].toUpperCase();
    const expectedLetter = letters[(10 - (sum % 10)) % 10];
    return lastChar === controlDigit.toString() || letters.includes(lastChar);
  }

  return false;
};

/**
 * Valida un número de teléfono español
 * Acepta: +34XXXXXXXXX, 9XXXXXXXX, 6XXXXXXXX, 8XXXXXXXX (fijos provinciales)
 * Formatos con espacios, paréntesis, guiones: +34 612 345 678, (+34) 912 345 678, etc.
 */
export const isValidPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '').replace(/^00/, '+');
  const phoneRegex = /^(\+34)?[678][0-9]{8}$/;
  return phoneRegex.test(cleaned);
};

/**
 * Valida que un objeto Cliente tenga todos los campos requeridos
 */
export const validateCliente = (cliente: Partial<Cliente>): string[] => {
  const errors: string[] = [];
  
  if (!cliente.nombre?.trim()) {
    errors.push('El nombre es obligatorio');
  }
  if (!cliente.nif?.trim()) {
    errors.push('El NIF es obligatorio');
  } else if (!isValidCIF(cliente.nif)) {
    errors.push('El NIF no tiene un formato válido');
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
  if (material.precio_unitario === undefined || material.precio_unitario < 0) {
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