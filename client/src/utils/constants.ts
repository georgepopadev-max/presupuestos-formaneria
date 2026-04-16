// Constantes de la aplicación
// Empresa de fontanería - Gestión de presupuestos y facturas

// Estados de presupuesto
export const PRESUPUESTO_ESTADOS = {
  BORRADOR: 'borrador',
  ENVIADO: 'enviado',
  ACEPTADO: 'aceptado',
  RECHAZADO: 'rechazado',
  FACTURADO: 'facturado',
} as const;

export const PRESUPUESTO_ESTADOS_LABELS: Record<string, string> = {
  [PRESUPUESTO_ESTADOS.BORRADOR]: 'Borrador',
  [PRESUPUESTO_ESTADOS.ENVIADO]: 'Enviado',
  [PRESUPUESTO_ESTADOS.ACEPTADO]: 'Aceptado',
  [PRESUPUESTO_ESTADOS.RECHAZADO]: 'Rechazado',
  [PRESUPUESTO_ESTADOS.FACTURADO]: 'Facturado',
};

// Estados de factura
export const FACTURA_ESTADOS = {
  BORRADOR: 'borrador',
  EMITIDA: 'emitida',
  PAGADA: 'pagada',
  VENCIDA: 'vencida',
  CANCELADA: 'cancelada',
} as const;

export const FACTURA_ESTADOS_LABELS: Record<string, string> = {
  [FACTURA_ESTADOS.BORRADOR]: 'Borrador',
  [FACTURA_ESTADOS.EMITIDA]: 'Emitida',
  [FACTURA_ESTADOS.PAGADA]: 'Pagada',
  [FACTURA_ESTADOS.VENCIDA]: 'Vencida',
  [FACTURA_ESTADOS.CANCELADA]: 'Cancelada',
};

// Estados de proyecto
export const PROYECTO_ESTADOS = {
  PLANIFICADO: 'planificado',
  EN_PROGRESO: 'en_progreso',
  COMPLETADO: 'completado',
  CANCELADO: 'cancelado',
} as const;

export const PROYECTO_ESTADOS_LABELS: Record<string, string> = {
  [PROYECTO_ESTADOS.PLANIFICADO]: 'Planificado',
  [PROYECTO_ESTADOS.EN_PROGRESO]: 'En progreso',
  [PROYECTO_ESTADOS.COMPLETADO]: 'Completado',
  [PROYECTO_ESTADOS.CANCELADO]: 'Cancelado',
};

// Tasas de IVA
export const IVA_TASAS = {
  GENERAL: 21,
  REDUCIDO: 10,
  SUPER_REDUCIDO: 4,
} as const;

export const IVA_LABELS: Record<number, string> = {
  [IVA_TASAS.GENERAL]: '21% General',
  [IVA_TASAS.REDUCIDO]: '10% Reducido',
  [IVA_TASAS.SUPER_REDUCIDO]: '4% Superreducido',
};

// Colores de estado para badges
export const ESTADO_COLORS: Record<string, string> = {
  borrador: 'bg-gray-100 text-gray-800',
  enviado: 'bg-blue-100 text-blue-800',
  aceptado: 'bg-green-100 text-green-800',
  rechazado: 'bg-red-100 text-red-800',
  facturado: 'bg-purple-100 text-purple-800',
  emitida: 'bg-blue-100 text-blue-800',
  pagada: 'bg-green-100 text-green-800',
  vencida: 'bg-red-100 text-red-800',
  cancelada: 'bg-red-100 text-red-800',
  planificado: 'bg-gray-100 text-gray-800',
  en_progreso: 'bg-yellow-100 text-yellow-800',
  completado: 'bg-green-100 text-green-800',
  cancelado: 'bg-red-100 text-red-800',
};

// Rutas de la aplicación
export const ROUTES = {
  DASHBOARD: '/dashboard',
  PRESUPUESTOS: '/presupuestos',
  FACTURAS: '/facturas',
  MATERIALES: '/materiales',
  PROYECTOS: '/proyectos',
  CLIENTES: '/clientes',
  PROVEEDORES: '/proveedores',
  ANALISIS: '/analisis',
} as const;

// Configuración de paginación
export const PAGE_SIZES = [10, 25, 50, 100];

// Duración de validez de presupuestos (días)
export const PRESUPUESTO_VALIDEZ_DEFAULT = 30;

// Moneda
export const CURRENCY_SYMBOL = '€';
export const CURRENCY_CODE = 'EUR';
export const CURRENCY_LOCALE = 'es-ES';