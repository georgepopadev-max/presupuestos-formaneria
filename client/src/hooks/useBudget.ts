import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { presupuestosService } from '../services/api';
import type { Presupuesto } from '../types';

/**
 * Hook para obtener todos los presupuestos
 */
export function usePresupuestos() {
  return useQuery({
    queryKey: ['presupuestos'],
    queryFn: async () => {
      const response = await presupuestosService.getAll();
      return response.data;
    },
  });
}

/**
 * Hook para obtener un presupuesto por ID
 */
export function usePresupuesto(id: number) {
  return useQuery({
    queryKey: ['presupuesto', id],
    queryFn: async () => {
      const response = await presupuestosService.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Hook para crear un nuevo presupuesto
 */
export function useCreatePresupuesto() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await presupuestosService.create(data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidar caché de presupuestos
      queryClient.invalidateQueries({ queryKey: ['presupuestos'] });
    },
  });
}

/**
 * Hook para actualizar un presupuesto existente
 */
export function useUpdatePresupuesto() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await presupuestosService.update(id, data);
      return response.data;
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['presupuestos'] });
      queryClient.setQueryData(['presupuesto', updated.id], updated);
    },
  });
}

/**
 * Hook para eliminar un presupuesto
 */
export function useDeletePresupuesto() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await presupuestosService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['presupuestos'] });
    },
  });
}

/**
 * Hook para cambiar el estado de un presupuesto
 */
export function useCambiarEstadoPresupuesto() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, estado }: { id: number; estado: Presupuesto['estado'] }) => {
      const response = await presupuestosService.cambiarEstado(id, estado);
      return response.data;
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['presupuestos'] });
      queryClient.setQueryData(['presupuesto', updated.id], updated);
    },
  });
}