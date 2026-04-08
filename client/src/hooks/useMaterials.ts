import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { materialesService } from '../services/api';
import type { Material } from '../types';

/**
 * Hook para obtener todos los materiales
 */
export function useMateriales() {
  return useQuery({
    queryKey: ['materiales'],
    queryFn: async () => {
      const response = await materialesService.getAll();
      return response.data;
    },
  });
}

/**
 * Hook para obtener un material por ID
 */
export function useMaterial(id: string) {
  return useQuery({
    queryKey: ['material', id],
    queryFn: async () => {
      const response = await materialesService.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Hook para crear un nuevo material
 */
export function useCreateMaterial() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<Material, 'id' | 'createdAt'>) => {
      const response = await materialesService.create(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materiales'] });
    },
  });
}

/**
 * Hook para actualizar un material existente
 */
export function useUpdateMaterial() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Material> }) => {
      const response = await materialesService.update(id, data);
      return response.data;
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['materiales'] });
      queryClient.setQueryData(['material', updated.id], updated);
    },
  });
}

/**
 * Hook para eliminar un material
 */
export function useDeleteMaterial() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await materialesService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materiales'] });
    },
  });
}