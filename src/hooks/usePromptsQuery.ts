import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPrompts, createPrompt, updatePrompt, deletePrompt } from '../services/api';
import { Prompt } from '../types';

export function usePromptsQuery(activeWorkspaceId: string) {
    const queryClient = useQueryClient();
    const queryKey = ['prompts', activeWorkspaceId];

    const { data: prompts = [], isLoading, error } = useQuery({
        queryKey,
        queryFn: () => fetchPrompts(activeWorkspaceId),
        enabled: !!activeWorkspaceId,
        staleTime: 1000 * 60 * 5, // 5 minutes cache
    });

    // Add mutation with optimistic update
    const addMutation = useMutation({
        mutationFn: createPrompt,
        onMutate: async (newPrompt) => {
            // Cancel in-flight queries
            await queryClient.cancelQueries({ queryKey });

            // Snapshot current data
            const previousPrompts = queryClient.getQueryData<Prompt[]>(queryKey);

            // Optimistically add to cache with temp ID
            const tempPrompt = {
                ...newPrompt,
                id: `temp-${Date.now()}`,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                copy_count: 0,
                order_index: 0,
            };

            queryClient.setQueryData<Prompt[]>(queryKey, (old = []) => [...old, tempPrompt as Prompt]);

            return { previousPrompts };
        },
        onError: (_err, _newPrompt, context) => {
            // Rollback on error
            if (context?.previousPrompts) {
                queryClient.setQueryData(queryKey, context.previousPrompts);
            }
        },
        onSettled: () => {
            // Refetch to sync with server
            queryClient.invalidateQueries({ queryKey });
        },
    });

    // Update mutation with optimistic update
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Prompt> }) => updatePrompt(id, data),
        onMutate: async ({ id, data }) => {
            // Cancel in-flight queries
            await queryClient.cancelQueries({ queryKey });

            // Snapshot current data
            const previousPrompts = queryClient.getQueryData<Prompt[]>(queryKey);

            // Optimistically update in cache
            queryClient.setQueryData<Prompt[]>(queryKey, (old = []) =>
                old.map(p => p.id === id ? { ...p, ...data, updated_at: new Date().toISOString() } : p)
            );

            return { previousPrompts };
        },
        onError: (_err, _vars, context) => {
            // Rollback on error
            if (context?.previousPrompts) {
                queryClient.setQueryData(queryKey, context.previousPrompts);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
        }
    });

    // Delete mutation with optimistic update
    const deleteMutation = useMutation({
        mutationFn: deletePrompt,
        onMutate: async (id) => {
            // Cancel in-flight queries
            await queryClient.cancelQueries({ queryKey });

            // Snapshot current data
            const previousPrompts = queryClient.getQueryData<Prompt[]>(queryKey);

            // Optimistically remove from cache
            queryClient.setQueryData<Prompt[]>(queryKey, (old = []) =>
                old.filter(p => p.id !== id)
            );

            return { previousPrompts };
        },
        onError: (_err, _id, context) => {
            // Rollback on error
            if (context?.previousPrompts) {
                queryClient.setQueryData(queryKey, context.previousPrompts);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
        }
    });

    return {
        prompts,
        isLoading,
        error,
        addPrompt: addMutation.mutate,
        updatePrompt: updateMutation.mutate,
        deletePrompt: deleteMutation.mutate,
        isAdding: addMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
}
