// ============================================================
// TIPOS Y INTERFACES DEL SISTEMA DE GESTIÓN DE FONTANERÍA
// ============================================================

/**
 * Representa un cliente del sistema
 */
export interface Cliente {
  id?: number;
  nombre: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  ciudad?: string;
  codigo_postal?: string;
  nif?: string; // Número de Identificación Fiscal español
  observaciones?: string;
  activo: boolean;
  created_at?: Date;
  updated_at?: Date;
}

/**
 * Representa un proveedor de materiales
 */
export interface Proveedor {
  id?: number;
  nombre: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  ciudad?: string;
  codigo_postal?: string;
  cif?: string; // CIF español
  persona_contacto?: string;
  observaciones?: string;
  activo: boolean;
  created_at?: Date;
  updated_at?: Date;
}

/**
 * Representa un material usado en presupuestos y proyectos
 */
export interface Material {
  id?: number;
  nombre: string;
  descripcion?: string;
  categoria?: string;
  unidad_medida: string;
  precio_unitario: number;
  proveedor_id?: number;
  stock?: number;
  stock_minimo?: number;
  activo: boolean;
  created_at?: Date;
  updated_at?: Date;
}

/**
 * Representa un proyecto de fontanería
 */
export interface Proyecto {
  id?: number;
  nombre: string;
  descripcion?: string;
  clienteId: number;
  direccion?: string;
  ciudad?: string;
  presupuestoId?: number; // Presupuesto asociado
  estado: 'pendiente' | 'en_progreso' | 'completado' | 'cancelado' | 'facturado';
  fechaInicio?: Date;
  fechaFin?: Date;
  observaciones?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Representa un presupuesto para un cliente
 */
export interface Presupuesto {
  id?: number;
  numero: string; // Número secuencial generado automáticamente
  clienteId: number;
  proyectoId?: number;
  titulo: string;
  descripcion?: string;
  estado: 'borrador' | 'enviado' | 'aceptado' | 'rechazado' | 'vencido' | 'facturado';
  subtotal: number;
  iva: number;
  total: number;
  fechaValidez?: Date; // Fecha hasta la que es válido el presupuesto
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
  notas?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Línea de un presupuesto (detalle de materiales/servicios)
 */
export interface PresupuestoLinea {
  id?: number;
  presupuestoId: number;
  materialId?: number;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  importe: number;
  tipoIva?: 'general' | 'reducido' | 'superreducido' | 'exento';
  orden?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Representa una factura
 */
export interface Factura {
  id?: number;
  numero: string; // Número secuencial generado automáticamente
  serie: string; // Serie de la factura (ej: FAC-2024-)
  presupuestoId?: number;
  clienteId: number;
  proyectoId?: number;
  fechaEmision: Date;
  fechaVencimiento?: Date;
  estado: 'borrador' | 'emitida' | 'pagada' | 'vencida' | 'cancelada';
  subtotal: number;
  iva: number;
  total: number;
  metodoPago?: 'efectivo' | 'transferencia' | 'tarjeta' | 'bizum';
  notas?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Línea de una factura
 */
export interface FacturaLinea {
  id?: number;
  facturaId: number;
  materialId?: number;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  importe: number;
  tipoIva?: 'general' | 'reducido' | 'superreducido' | 'exento';
  orden?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Representa los precios de mercado de materiales
 * Permite rastrear variaciones de precios de proveedores
 */
export interface PrecioMercado {
  id?: number;
  materialId: number;
  proveedorId: number;
  precio: number;
  fechaActualizacion: Date;
  fuente?: string; // URL o referencia de dónde se obtuvo el precio
  observaciones?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Secuencia para generación automática de números
 */
export interface Secuencia {
  id?: number;
  clave: string; // Ej: 'presupuesto', 'factura', 'proyecto'
  ultimoNumero: number;
  prefijo?: string;
  digitos?: number; // Cantidad de dígitos con los que formatear (ej: 4 -> 0001)
  updatedAt?: Date;
}

// Tipos para respuestas de la API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================================
// INTERFAZ DE USUARIO PARA AUTENTICACIÓN
// ============================================================

export interface Usuario {
  id?: number;
  email: string;
  password_hash?: string;
  nombre: string;
  activo: boolean;
  created_at?: Date;
  updated_at?: Date;
}

// Tipos para validación con Joi
export type ValidationSchema = Record<string, any>;
