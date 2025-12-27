import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    fetchCustomVariables,
    createCustomVariable,
    updateCustomVariable,
    deleteCustomVariable,
    CustomVariable
} from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export function useCustomVariablesQuery() {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const userId = user?.id || '';
    const queryKey = ['custom-variables', userId];

    const { data: variables = [], isLoading, error } = useQuery({
        queryKey,
        queryFn: () => fetchCustomVariables(userId),
        enabled: !!userId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const addMutation = useMutation({
        mutationFn: (data: Partial<CustomVariable>) => createCustomVariable({ ...data, user_id: userId }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey })
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<CustomVariable> }) => updateCustomVariable(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey })
    });

    const deleteMutation = useMutation({
        mutationFn: deleteCustomVariable,
        onSuccess: () => queryClient.invalidateQueries({ queryKey })
    });

    return {
        variables,
        isLoading,
        error,
        addVariable: addMutation.mutate,
        updateVariable: updateMutation.mutate,
        deleteVariable: deleteMutation.mutate,
        isAdding: addMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
}
