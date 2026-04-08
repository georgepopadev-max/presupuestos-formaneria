import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

/**
 * Hook genérico para obtener datos con React Query
 * @param key - Clave de caché para la query
 * @param fetcher - Función que realiza la petición
 * @param enabled - Condición para habilitar la query
 */
export function useApiData<T>(
  key: string[],
  fetcher: () => Promise<{ data: T }>,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const response = await fetcher();
      return response.data;
    },
    enabled,
  });
}

/**
 * Hook genérico para mutaciones (create, update, delete)
 * @param key - Clave de caché a invalidar tras la mutación
 * @param mutationFn - Función que realiza la mutación
 */
export function useApiMutation<TData, TVariables>(
  key: string[],
  mutationFn: (variables: TVariables) => Promise<{ data: TData }>
) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn,
    onSuccess: () => {
      key.forEach((k) => {
        queryClient.invalidateQueries({ queryKey: [k] });
      });
    },
  });
}

/**
 * Hook para clientes (genérico)
 */
export function useClientes() {
  return useApiData(['clientes'], () => 
    import('../services/api').then(m => m.clientesService.getAll())
  );
}

/**
 * Hook para proveedores (genérico)
 */
export function useProveedores() {
  return useApiData(['proveedores'], () => 
    import('../services/api').then(m => m.proveedoresService.getAll())
  );
}

/**
 * Hook para proyectos (genérico)
 */
export function useProyectos() {
  return useApiData(['proyectos'], () => 
    import('../services/api').then(m => m.proyectosService.getAll())
  );
}

/**
 * Hook para KPIs del dashboard
 */
export function useKPIs() {
  return useQuery({
    queryKey: ['dashboard', 'kpis'],
    queryFn: async () => {
      const response = await api.get('/dashboard/kpis');
      return response.data;
    },
  });
}

/**
 * Hook para datos de análisis de mercado
 */
export function useMarketData(year: number = new Date().getFullYear()) {
  return useQuery({
    queryKey: ['dashboard', 'market', year],
    queryFn: async () => {
      const response = await api.get(`/dashboard/mercado?year=${year}`);
      return response.data;
    },
  });
}