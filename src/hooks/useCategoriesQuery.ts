import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../services/api';
import { Category } from '../types';

export function useCategoriesQuery(activeWorkspaceId: string) {
    const queryClient = useQueryClient();
    const queryKey = ['categories', activeWorkspaceId];

    const { data: categories = [], isLoading, error } = useQuery({
        queryKey,
        queryFn: () => fetchCategories(activeWorkspaceId),
        enabled: !!activeWorkspaceId,
        staleTime: 1000 * 60 * 60, // 1 hour (structure changes rarely)
    });

    const addMutation = useMutation({
        mutationFn: createCategory,
        onSuccess: () => queryClient.invalidateQueries({ queryKey })
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) => updateCategory(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey })
    });

    const deleteMutation = useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => queryClient.invalidateQueries({ queryKey })
    });

    return {
        categories,
        isLoading,
        error,
        addCategory: addMutation.mutate,
        updateCategory: updateMutation.mutate,
        deleteCategory: deleteMutation.mutate,
        isAdding: addMutation.isPending,
    };
}
