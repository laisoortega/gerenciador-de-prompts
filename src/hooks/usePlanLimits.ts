import { useMemo } from 'react';
import { useStore } from '../contexts/StoreContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface PlanLimits {
    maxPrompts: number;
    maxWorkspaces: number;
    maxVariables: number;
    canExport: boolean;
    canImport: boolean;
    canShare: boolean;
}

export interface UsageStats {
    promptCount: number;
    workspaceCount: number;
    variableCount: number;
}

export interface PlanLimitsResult {
    limits: PlanLimits;
    usage: UsageStats;
    isLoading: boolean;
    canCreatePrompt: boolean;
    canCreateWorkspace: boolean;
    canCreateVariable: boolean;
    canImport: (count: number) => boolean;
    promptsRemaining: number;
    workspacesRemaining: number;
    variablesRemaining: number;
    usagePercentage: {
        prompts: number;
        workspaces: number;
        variables: number;
    };
}

// Default limits by plan
const PLAN_LIMITS: Record<string, PlanLimits> = {
    free: {
        maxPrompts: 25,
        maxWorkspaces: 2,
        maxVariables: 10,
        canExport: false,
        canImport: true,
        canShare: true,
    },
    pro: {
        maxPrompts: 500,
        maxWorkspaces: 10,
        maxVariables: 100,
        canExport: true,
        canImport: true,
        canShare: true,
    },
    enterprise: {
        maxPrompts: -1, // Unlimited
        maxWorkspaces: -1,
        maxVariables: -1,
        canExport: true,
        canImport: true,
        canShare: true,
    },
};

export function usePlanLimits(): PlanLimitsResult {
    const { user, prompts, workspaces } = useStore();
    const { user: authUser } = useAuth();
    const planId = user?.plan_id || 'free';

    // Get limits for current plan
    const limits = PLAN_LIMITS[planId] || PLAN_LIMITS.free;

    // Fetch real counts from Supabase if available
    const { data: dbCounts, isLoading } = useQuery({
        queryKey: ['usage-counts', authUser?.id],
        queryFn: async () => {
            if (!supabase || !authUser?.id) return null;

            // Count prompts
            const { count: promptCount } = await supabase
                .from('prompts')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', authUser.id);

            // Count workspaces
            const { count: workspaceCount } = await supabase
                .from('workspaces')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', authUser.id);

            // Count variables
            const { count: variableCount } = await supabase
                .from('custom_variables')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', authUser.id);

            return {
                promptCount: promptCount || 0,
                workspaceCount: workspaceCount || 0,
                variableCount: variableCount || 0,
            };
        },
        enabled: !!authUser?.id && !!supabase,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // Fall back to local state if Supabase not available
    const usage: UsageStats = dbCounts || {
        promptCount: prompts.length,
        workspaceCount: workspaces.length,
        variableCount: 0, // Can't count without Supabase
    };

    // Calculate remaining
    const promptsRemaining = limits.maxPrompts === -1
        ? Infinity
        : Math.max(0, limits.maxPrompts - usage.promptCount);

    const workspacesRemaining = limits.maxWorkspaces === -1
        ? Infinity
        : Math.max(0, limits.maxWorkspaces - usage.workspaceCount);

    const variablesRemaining = limits.maxVariables === -1
        ? Infinity
        : Math.max(0, limits.maxVariables - usage.variableCount);

    // Calculate percentages
    const usagePercentage = {
        prompts: limits.maxPrompts === -1
            ? 0
            : Math.min(100, (usage.promptCount / limits.maxPrompts) * 100),
        workspaces: limits.maxWorkspaces === -1
            ? 0
            : Math.min(100, (usage.workspaceCount / limits.maxWorkspaces) * 100),
        variables: limits.maxVariables === -1
            ? 0
            : Math.min(100, (usage.variableCount / limits.maxVariables) * 100),
    };

    return useMemo(() => ({
        limits,
        usage,
        isLoading,
        canCreatePrompt: promptsRemaining > 0,
        canCreateWorkspace: workspacesRemaining > 0,
        canCreateVariable: variablesRemaining > 0,
        canImport: (count: number) => limits.canImport && promptsRemaining >= count,
        promptsRemaining,
        workspacesRemaining,
        variablesRemaining,
        usagePercentage,
    }), [limits, usage, isLoading, promptsRemaining, workspacesRemaining, variablesRemaining, usagePercentage]);
}
