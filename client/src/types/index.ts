// Tipos para el sistema de gestión de presupuestos y facturas
// Empresa de fontanería en España

export interface Cliente {
  id: string;
  nombre: string;
  nif?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  ciudad?: string;
  codigoPostal?: string;
  observaciones?: string;
  activo?: boolean;
  createdAt: Date;
}

export interface Proveedor {
  id: string;
  nombre: string;
  cif: string;
  direccion: string;
  telefono: string;
  email: string;
  materiales: string[];
  createdAt: Date;
}

export interface Material {
  id: string;
  nombre: string;
  descripcion?: string;
  categoria?: string;
  unidadMedida: string;
  precioUnitario: number;
  proveedorId?: string;
  stock?: number;
  stockMinimo?: number;
  activo?: boolean;
  createdAt: Date;
}

export interface LineaPresupuesto {
  id: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  importe: number;
  materialId?: string;
  tipoIva?: string;
}

export interface Presupuesto {
  id: string;
  numero: string;
  clienteId: string;
  cliente?: Cliente;
  titulo?: string;
  lineas: LineaPresupuesto[];
  subtotal: number;
  iva: number;
  total: number;
  estado: 'borrador' | 'enviado' | 'aceptado' | 'rechazado';
  fechaCreacion: Date;
  fechaValidez: Date;
  proyectoId?: string;
  createdAt: Date;
}

export interface LineaFactura {
  id: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  importe: number;
  presupuestoLineaId?: string;
}

export interface Factura {
  id: string;
  numero: string;
  presupuestoId?: string;
  clienteId: string;
  cliente?: Cliente;
  lineas: LineaFactura[];
  subtotal: number;
  iva: number;
  total: number;
  estado: 'borrador' | 'emitida' | 'pagada' | 'vencida';
  fechaEmision: Date;
  fechaVencimiento: Date;
  createdAt: Date;
}

export interface Proyecto {
  id: string;
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
  id: string;
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