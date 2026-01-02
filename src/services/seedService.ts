/**
 * Serviço de Seeding de Prompts para Novos Usuários
 * 
 * Este serviço verifica se o usuário é novo e popula automaticamente
 * sua conta com o banco de prompts pré-definido.
 */

import { supabase } from '../lib/supabase';
import seedPromptsData from '../data/seed-prompts.json';

// Interface para os prompts do seed
interface SeedPrompt {
    title: string;
    content: string;
    category: string;
    recommended_ai?: string;
    tags?: string[];
    is_favorite?: boolean;
    variables?: Array<{
        name: string;
        placeholder: string;
        value: string;
    }>;
}

interface SeedData {
    version: string;
    exported_at: string;
    total_prompts: number;
    prompts: SeedPrompt[];
}

// Cores para categorias
const categoryColors = [
    '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
    '#f43f5e', '#ef4444', '#f97316', '#f59e0b', '#eab308',
    '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4',
    '#0ea5e9', '#3b82f6',
];

function getColorForCategory(index: number): string {
    return categoryColors[index % categoryColors.length];
}

/**
 * Verifica se o usuário é novo (não tem prompts) e faz o seeding
 */
export async function seedPromptsForNewUser(userId: string): Promise<boolean> {
    if (!supabase) {
        console.warn('[Seed] Supabase não configurado');
        return false;
    }

    try {
        // Verificar se o usuário já tem prompts
        const { data: existingPrompts, error: checkError } = await supabase
            .from('prompts')
            .select('id')
            .eq('user_id', userId)
            .limit(1);

        if (checkError) {
            console.error('[Seed] Erro ao verificar prompts existentes:', checkError);
            return false;
        }

        // Se já tem prompts, não fazer seeding
        if (existingPrompts && existingPrompts.length > 0) {
            console.log('[Seed] Usuário já tem prompts, pulando seeding');
            return false;
        }

        console.log('[Seed] Novo usuário detectado, iniciando seeding...');

        // Buscar ou criar workspace
        let workspace = await getOrCreateWorkspace(userId);
        if (!workspace) {
            console.error('[Seed] Não foi possível obter/criar workspace');
            return false;
        }

        // Carregar dados do seed
        const seedData = seedPromptsData as SeedData;
        const prompts = seedData.prompts;

        if (!prompts || prompts.length === 0) {
            console.warn('[Seed] Nenhum prompt no arquivo de seed');
            return false;
        }

        // Criar categorias e mapear para IDs
        const categoryMap = new Map<string, string>();
        let colorIndex = 0;

        for (const prompt of prompts) {
            const categoryName = prompt.category?.trim() || 'Geral';

            if (!categoryMap.has(categoryName)) {
                const categoryId = await getOrCreateCategory(
                    userId,
                    workspace.id,
                    categoryName,
                    colorIndex++
                );
                if (categoryId) {
                    categoryMap.set(categoryName, categoryId);
                }
            }
        }

        // Inserir prompts em lotes
        const BATCH_SIZE = 50;
        let insertedCount = 0;

        for (let i = 0; i < prompts.length; i += BATCH_SIZE) {
            const batch = prompts.slice(i, i + BATCH_SIZE).map((prompt, idx) => ({
                user_id: userId,
                workspace_id: workspace.id,
                category_id: categoryMap.get(prompt.category?.trim() || 'Geral') || null,
                title: prompt.title,
                content: prompt.content,
                variables: prompt.variables || [],
                tags: prompt.tags || [],
                recommended_ai: prompt.recommended_ai || null,
                is_favorite: prompt.is_favorite || false,
                copy_count: 0,
                order_index: i + idx
            }));

            const { error: insertError } = await supabase
                .from('prompts')
                .insert(batch);

            if (insertError) {
                console.error(`[Seed] Erro ao inserir lote ${Math.floor(i / BATCH_SIZE) + 1}:`, insertError);
            } else {
                insertedCount += batch.length;
            }
        }

        console.log(`[Seed] ✓ ${insertedCount} prompts inseridos com sucesso`);
        return true;

    } catch (error) {
        console.error('[Seed] Erro durante seeding:', error);
        return false;
    }
}

async function getOrCreateWorkspace(userId: string) {
    if (!supabase) return null;

    // Buscar workspace existente
    const { data: existing } = await supabase
        .from('workspaces')
        .select('*')
        .eq('owner_id', userId)
        .eq('is_default', true)
        .single();

    if (existing) return existing;

    // Criar novo workspace
    const slug = `workspace-${userId.slice(0, 8)}-${Date.now()}`;
    const { data: newWorkspace, error } = await supabase
        .from('workspaces')
        .insert({
            owner_id: userId,
            name: 'Meu Workspace',
            slug: slug,
            is_default: true
        })
        .select()
        .single();

    if (error) {
        console.error('[Seed] Erro ao criar workspace:', error);
        return null;
    }

    return newWorkspace;
}

async function getOrCreateCategory(
    userId: string,
    workspaceId: string,
    categoryName: string,
    colorIndex: number
): Promise<string | null> {
    if (!supabase) return null;

    // Buscar categoria existente
    const { data: existing } = await supabase
        .from('categories')
        .select('id')
        .eq('user_id', userId)
        .eq('workspace_id', workspaceId)
        .eq('name', categoryName)
        .single();

    if (existing) return existing.id;

    // Criar nova categoria
    const { data: newCategory, error } = await supabase
        .from('categories')
        .insert({
            user_id: userId,
            workspace_id: workspaceId,
            name: categoryName,
            color: getColorForCategory(colorIndex),
            order_index: colorIndex
        })
        .select()
        .single();

    if (error) {
        console.error(`[Seed] Erro ao criar categoria "${categoryName}":`, error);
        return null;
    }

    return newCategory.id;
}
