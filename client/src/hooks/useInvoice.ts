import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { facturasService } from '../services/api';
import type { Factura } from '../types';

/**
 * Hook para obtener todas las facturas
 */
export function useFacturas() {
  return useQuery({
    queryKey: ['facturas'],
    queryFn: async () => {
      const response = await facturasService.getAll();
      return response.data;
    },
  });
}

/**
 * Hook para obtener una factura por ID
 */
export function useFactura(id: string) {
  return useQuery({
    queryKey: ['factura', id],
    queryFn: async () => {
      const response = await facturasService.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Hook para crear una nueva factura
 */
export function useCreateFactura() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<Factura, 'id' | 'numero' | 'createdAt'>) => {
      const response = await facturasService.create(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facturas'] });
    },
  });
}

/**
 * Hook para actualizar una factura existente
 */
export function useUpdateFactura() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Factura> }) => {
      const response = await facturasService.update(id, data);
      return response.data;
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['facturas'] });
      queryClient.setQueryData(['factura', updated.id], updated);
    },
  });
}

/**
 * Hook para eliminar una factura
 */
export function useDeleteFactura() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await facturasService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facturas'] });
    },
  });
}

/**
 * Hook para cambiar el estado de una factura
 */
export function useCambiarEstadoFactura() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, estado }: { id: string; estado: Factura['estado'] }) => {
      const response = await facturasService.cambiarEstado(id, estado);
      return response.data;
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['facturas'] });
      queryClient.setQueryData(['factura', updated.id], updated);
    },
  });
}