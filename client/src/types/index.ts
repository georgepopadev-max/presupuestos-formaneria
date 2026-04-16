// Tipos para el sistema de gestión de presupuestos y facturas
// Empresa de fontanería en España

export interface Cliente {
  id: number;
  nombre: string;
  cif: string;
  direccion: string;
  telefono: string;
  email: string;
  createdAt: Date;
}

export interface Proveedor {
  id: number;
  nombre: string;
  cif: string;
  direccion: string;
  telefono: string;
  email: string;
  materiales: string[];
  createdAt: Date;
}

export interface Material {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  unidadMedida: string;
  precioUnitario: number;
  proveedorId?: number;
  stock?: number;
  stockMinimo?: number;
  activo: boolean;
  createdAt: Date;
}

export interface LineaPresupuesto {
  id: number;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  importe: number;
  materialId?: string;
  tipoIva: string;
}

export interface Presupuesto {
  id: number;
  numero: string;
  clienteId: number;
  cliente?: Cliente;
  titulo?: string;
  lineas: LineaPresupuesto[];
  subtotal: number;
  iva: number;
  total: number;
  estado: 'borrador' | 'enviado' | 'aceptado' | 'rechazado' | 'facturado';
  fechaCreacion: Date;
  fechaValidez: Date;
  proyectoId?: string;
  createdAt: Date;
}

export interface LineaFactura {
  id: number;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  importe: number;
  tipoIva: string;
  presupuestoLineaId?: string;
}

export interface Factura {
  id: number;
  numero: string;
  presupuestoId?: string;
  clienteId: number;
  cliente?: Cliente;
  lineas: LineaFactura[];
  subtotal: number;
  iva: number;
  total: number;
  estado: 'borrador' | 'emitida' | 'pagada' | 'vencida' | 'cancelada';
  fechaEmision: Date;
  fechaVencimiento: Date;
  createdAt: Date;
}

export interface Proyecto {
  id: number;
  nombre: string;
  descripcion: string;
  clienteId: string;
  cliente?: Cliente;
  presupuestoIds: string[];
  facturaIds: string[];
  estado: 'planificado' | 'en_progreso' | 'completado' | 'cancelado';
  fechaInicio: Date;
  fechaFin?: Date;
  createdAt: Date;
}

export interface Usuario {
  id: number;
  email: string;
  nombre: string;
  role: 'admin' | 'usuario';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  usuario: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
}

// KPI del dashboard
export interface KPIData {
  presupuestosPendientes: number;
  facturasPendientes: number;
  facturasCobradas: number;
  margenMedio: number;
  proyectosActivos: number;
}

// Datos para análisis de mercado
export interface MarketData {
  mes: string;
  presupuestosCreados: number;
  presupuestosAceptados: number;
  facturacionTotal: number;
  margenPromedio: number;
}

// Tipos de entrada para crear/actualizar presupuestos
export interface LineaPresupuestoInput {
  materialId?: number;
  descripcion: string;
  cantidad: number;
  precioUnidad: number;
  tipoIva: 'general' | 'reducido' | 'superreducido' | 'exento';
  margen: number;
  orden: number;
}

export interface PresupuestoInput {
  clienteId: number;
  estado: 'borrador' | 'enviado' | 'aceptado' | 'rechazado' | 'facturado';
  fechaValidez: string;
  notas?: string;
  descuento?: number;
  lineas: LineaPresupuestoInput[];
}

// Tipos de entrada para crear/actualizar facturas
export interface LineaFacturaInput {
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  presupuestoLineaId?: string;
}

export interface FacturaInput {
  clienteId: number;
  estado: 'borrador' | 'emitida' | 'pagada' | 'vencida' | 'cancelada';
  fechaEmision: string;
  fechaVencimiento: string;
  lineas: LineaFacturaInput[];
}