import axios from 'axios';
import type { 
  Cliente, Proveedor, Material, Presupuesto, Factura, Proyecto, Usuario, LoginCredentials 
} from '../types';

// Cliente HTTP configurado para la API del backend
const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:4000') + '/api',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Desactivar soporte ETag/Conditional GET para evitar 304 con body vacío
api.interceptors.request.use((config) => {
  // Eliminar cabeceras que causarían respuestas 304 Not Modified
  delete config.headers['If-None-Match'];
  delete config.headers['If-Modified-Since'];
  delete config.headers['Cache-Control'];
  // Añadir token de autenticación
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar respuestas exitosas - verificar que no vengan vacías
api.interceptors.response.use(
  (response) => {
    console.log('🔵 Response:', response.config.url, response.status, typeof response.data);

    if (response.status === 200) {
      const isEmptyData = response.data === null || response.data === undefined || response.data === '';
      
      if (isEmptyData) {
        console.warn('Respuesta vacía para:', response.config.url, '- normalizando');
        const url = response.config.url;
        if (url?.includes('/presupuestos') || url?.includes('/clientes') ||
            url?.includes('/facturas') || url?.includes('/proveedores') ||
            url?.includes('/materiales') || url?.includes('/proyectos')) {
          response.data = [];
        } else {
          response.data = {};
        }
      }
      else if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        const wrapper = response.data as any;
        if (wrapper.data === null || wrapper.data === undefined) {
          console.warn('Wrapper.data es null/undefined para:', response.config.url, '- normalizando');
          const url = response.config.url;
          if (url?.includes('/presupuestos') || url?.includes('/clientes') ||
              url?.includes('/facturas') || url?.includes('/proveedores') ||
              url?.includes('/materiales') || url?.includes('/proyectos')) {
            response.data = [];
          } else {
            response.data = {};
          }
        } else if (Array.isArray(wrapper.data)) {
          console.log('Unwrapping response data from {success,data} format');
          response.data = wrapper.data;
        }
      }
    }
    return response;
  },
  (error) => {
    console.log('🔴 Error intercepted:', error.response?.status, error.config?.url, error.response?.data);
    
    // Manejar errores de autenticación
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Manejar 304 Not Modified - hacer un refetch automático
    if (error.response?.status === 304) {
      console.warn('304 Not Modified - forzando refetch');

      // Crear una nueva petición limpia sin las cabeceras condicionales
      const cleanConfig = { ...error.config };
      delete cleanConfig.headers['If-None-Match'];
      delete cleanConfig.headers['If-Modified-Since'];
      delete cleanConfig.headers['Cache-Control'];

      // Hacer la petición de nuevo y propagar el resultado
      return api(cleanConfig).then(
        (response) => {
          if (response.data === null || response.data === undefined || response.data === '') {
            console.warn('Retry returned empty data, rejecting');
            return Promise.reject(new Error('Respuesta vacía del servidor'));
          }
          return response;
        },
        (error) => Promise.reject(error)
      );
    }

    // Manejar errores 500 - loguear para debug
    if (error.response?.status === 500) {
      console.error('Error 500 del servidor:', error.response?.data?.message || 'Error interno', error.response?.data);
    }

    // Manejar errores 4xx de forma general
    if (error.response?.status >= 400 && error.response?.status < 500) {
      const message = error.response?.data?.message || `Error ${error.response?.status}`;
      console.warn(`API Error ${error.response?.status}:`, message);
    }

    return Promise.reject(error);
  }
);

// Servicios para cada entidad

// --- Autenticación ---
export const authService = {
  login: (credentials: LoginCredentials) => 
    api.post<{ token: string; usuario: Usuario }>('/auth/login', credentials),
  register: (data: { nombre: string; email: string; password: string }) =>
    api.post<{ success: boolean; message: string }>('/auth/register', data),
  logout: () => {
    localStorage.removeItem('token');
  },
};

// --- Clientes ---
export const clientesService = {
  getAll: () => api.get<Cliente[]>('/clientes'),
  getById: (id: string) => api.get<Cliente>(`/clientes/${id}`),
  create: (data: Omit<Cliente, 'id' | 'createdAt'>) => 
    api.post<Cliente>('/clientes', data),
  update: (id: string, data: Partial<Cliente>) => 
    api.put<Cliente>(`/clientes/${id}`, data),
  delete: (id: string) => api.delete(`/clientes/${id}`),
};

// --- Proveedores ---
export const proveedoresService = {
  getAll: () => api.get<Proveedor[]>('/proveedores'),
  getById: (id: string) => api.get<Proveedor>(`/proveedores/${id}`),
  create: (data: Omit<Proveedor, 'id' | 'createdAt'>) => 
    api.post<Proveedor>('/proveedores', data),
  update: (id: string, data: Partial<Proveedor>) => 
    api.put<Proveedor>(`/proveedores/${id}`, data),
  delete: (id: string) => api.delete(`/proveedores/${id}`),
};

// --- Materiales ---
export const materialesService = {
  getAll: () => api.get<Material[]>('/materiales'),
  getById: (id: string) => api.get<Material>(`/materiales/${id}`),
  create: (data: Omit<Material, 'id' | 'createdAt'>) => 
    api.post<Material>('/materiales', data),
  update: (id: string, data: Partial<Material>) => 
    api.put<Material>(`/materiales/${id}`, data),
  delete: (id: string) => api.delete(`/materiales/${id}`),
};

// --- Presupuestos ---
export const presupuestosService = {
  getAll: () => api.get<Presupuesto[]>('/presupuestos'),
  getById: (id: string) => api.get<Presupuesto>(`/presupuestos/${id}`),
  create: (data: { data: any; lineas: any[] }) =>
    api.post<Presupuesto>('/presupuestos', data),
  update: (id: string, data: { data: any; lineas?: any[] }) =>
    api.put<Presupuesto>(`/presupuestos/${id}`, data),
  delete: (id: string) => api.delete(`/presupuestos/${id}`),
  cambiarEstado: (id: string, estado: Presupuesto['estado']) =>
    api.patch<Presupuesto>(`/presupuestos/${id}/estado`, { estado }),
  generateInvoice: (id: string) =>
    api.post<any>(`/presupuestos/${id}/facturar`),
};

// --- Facturas ---
export const facturasService = {
  getAll: () => api.get<Factura[]>('/facturas'),
  getById: (id: string) => api.get<Factura>(`/facturas/${id}`),
  create: (data: Omit<Factura, 'id' | 'numero' | 'createdAt'>) => 
    api.post<Factura>('/facturas', data),
  update: (id: string, data: Partial<Factura>) => 
    api.put<Factura>(`/facturas/${id}`, data),
  delete: (id: string) => api.delete(`/facturas/${id}`),
  cambiarEstado: (id: string, estado: Factura['estado']) => 
    api.patch<Factura>(`/facturas/${id}/estado`, { estado }),
};

// --- Proyectos ---
export const proyectosService = {
  getAll: () => api.get<Proyecto[]>('/proyectos'),
  getById: (id: string) => api.get<Proyecto>(`/proyectos/${id}`),
  create: (data: Omit<Proyecto, 'id' | 'createdAt'>) => 
    api.post<Proyecto>('/proyectos', data),
  update: (id: string, data: Partial<Proyecto>) => 
    api.put<Proyecto>(`/proyectos/${id}`, data),
  delete: (id: string) => api.delete(`/proyectos/${id}`),
};

// --- Dashboard / KPIs ---
export const dashboardService = {
  getKPIs: () => api.get('/dashboard/kpis'),
  getMarketData: (year: number) => 
    api.get<Array<{ mes: string; presupuestos: number; aceptados: number; facturacion: number; margen: number }>>(
      `/dashboard/mercado?year=${year}`
    ),
};

export default api;