import { PromptShare, SharedPrompt, CommonVariable, VideoAnalysis, Prompt } from '../types';
import { MOCK_PROMPTS, MOCK_CATEGORIES } from './mockData';
import { supabase } from '../lib/supabase';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const IS_REAL_DB = !!supabase;

// In-Memory DB for Mock State (persists while dev server runs)
let MEM_PROMPTS = [...MOCK_PROMPTS];
let MEM_CATEGORIES = [...MOCK_CATEGORIES];

// --- Core Data Fetching ---

export const fetchWorkspaces = async () => {
    if (IS_REAL_DB && supabase) {
        const { data, error } = await supabase.from('workspaces').select('*');
        if (error) throw error;
        return data;
    }
    await delay(500);
    // TODO: move MEM_WORKSPACES if needed
    return import('./mockData').then(m => m.MOCK_WORKSPACES);
};

export const fetchPrompts = async (workspaceId: string) => {
    if (IS_REAL_DB && supabase) {
        const { data, error } = await supabase
            .from('prompts')
            .select('*')
            .eq('workspace_id', workspaceId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        // Manual join for category in Supabase would be .select('*, categories(*)')
        // For now let's assume raw data
        return data as Prompt[];
    }
    await delay(600);
    // Filter by workspace if we had multiple mock workspaces populated
    return MEM_PROMPTS;
};

export const fetchCategories = async (workspaceId: string) => {
    if (IS_REAL_DB && supabase) {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('workspace_id', workspaceId)
            .order('order_index');
        if (error) throw error;
        return data as Category[];
    }
    await delay(500);
    return MEM_CATEGORIES;
};

// --- CRUD Operations ---

export const createPrompt = async (promptData: Partial<Prompt>) => {
    if (IS_REAL_DB && supabase) {
        const { data, error } = await supabase.from('prompts').insert(promptData).select().single();
        if (error) throw error;
        return data;
    }
    await delay(800);
    const newPrompt = {
        ...promptData,
        id: `p-mock-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        copy_count: 0
    } as Prompt;
    MEM_PROMPTS = [newPrompt, ...MEM_PROMPTS];
    return newPrompt;
};

export const updatePrompt = async (id: string, updates: Partial<Prompt>) => {
    if (IS_REAL_DB && supabase) {
        const { data, error } = await supabase.from('prompts').update(updates).eq('id', id).select().single();
        if (error) throw error;
        return data;
    }
    await delay(600);
    MEM_PROMPTS = MEM_PROMPTS.map(p => p.id === id ? { ...p, ...updates } : p);
    return MEM_PROMPTS.find(p => p.id === id);
};

export const deletePrompt = async (id: string) => {
    if (IS_REAL_DB && supabase) {
        const { error } = await supabase.from('prompts').delete().eq('id', id);
        if (error) throw error;
        return true;
    }
    await delay(500);
    MEM_PROMPTS = MEM_PROMPTS.filter(p => p.id !== id);
    return true;
};

// Categories CRUD
export const createCategory = async (catData: Partial<Category>) => {
    if (IS_REAL_DB && supabase) {
        const { data, error } = await supabase.from('categories').insert(catData).select().single();
        if (error) throw error;
        return data;
    }
    await delay(500);
    const newCat = {
        ...catData,
        id: `c-mock-${Date.now()}`,
        children: []
    } as Category;
    MEM_CATEGORIES = [...MEM_CATEGORIES, newCat];
    return newCat;
};

export const updateCategory = async (id: string, updates: Partial<Category>) => {
    if (IS_REAL_DB && supabase) {
        const { data, error } = await supabase.from('categories').update(updates).eq('id', id).select().single();
        if (error) throw error;
        return data;
    }
    await delay(400);
    MEM_CATEGORIES = MEM_CATEGORIES.map(c => c.id === id ? { ...c, ...updates } : c);
    return MEM_CATEGORIES.find(c => c.id === id);
};

export const deleteCategory = async (id: string) => {
    if (IS_REAL_DB && supabase) {
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) throw error;
        return true;
    }
    await delay(400);
    MEM_CATEGORIES = MEM_CATEGORIES.filter(c => c.id !== id);
    return true;
};

// Workspace initialization for new users
export const createDefaultWorkspace = async (userId: string) => {
    if (IS_REAL_DB && supabase) {
        const { data, error } = await supabase
            .from('workspaces')
            .insert({
                owner_id: userId,
                name: 'Meu Workspace',
                slug: 'meu-workspace',
                is_default: true
            })
            .select()
            .single();
        if (error) throw error;
        return data;
    }
    return null;
};

export const fetchUserDefaultWorkspace = async (userId: string) => {
    if (IS_REAL_DB && supabase) {
        // First try to get any workspace for this user
        const { data: workspaces, error: fetchError } = await supabase
            .from('workspaces')
            .select('*')
            .eq('owner_id', userId)
            .order('created_at', { ascending: true });

        if (fetchError) throw fetchError;

        // If user has workspaces, return the first one (or the default one if exists)
        if (workspaces && workspaces.length > 0) {
            const defaultWs = workspaces.find(w => w.is_default) || workspaces[0];
            return defaultWs;
        }

        // No workspace found, create one
        return await createDefaultWorkspace(userId);
    }
    return { id: 'mock-workspace-1', name: 'Mock Workspace' };
};

// --- Sharing ---

export const sharePrompt = async (promptId: string, data: { emails: string[], permission: string, message?: string }) => {
    if (IS_REAL_DB && supabase) {
        // TODO: Implement Real Share Logic
        console.warn('Real Share Logic not yet implemented');
    }

    await delay(1000);
    // Mock response
    return {
        shared: data.emails.map(email => ({
            id: `share-${Date.now()}-${Math.random()}`,
            prompt_id: promptId,
            shared_by: 'user-1',
            shared_with_email: email,
            permission: data.permission,
            status: 'pending',
            created_at: new Date().toISOString()
        })),
        errors: []
    };
};

export const fetchPromptShares = async (promptId: string): Promise<PromptShare[]> => {
    if (IS_REAL_DB && supabase) {
        // Real implementation would go here
    }
    await delay(600);
    return [
        {
            id: 'share-1',
            prompt_id: promptId,
            shared_by: 'user-1',
            shared_with_email: 'colega@exemplo.com',
            shared_with_user: { name: 'Colega de Trabalho' },
            permission: 'view',
            status: 'active',
            created_at: new Date().toISOString()
        }
    ] as PromptShare[];
};

export const revokeShare = async (promptId: string, shareId: string) => {
    await delay(500);
    return true;
};

export const updateSharePermission = async (promptId: string, shareId: string, permission: string) => {
    await delay(500);
    return true;
};

export const fetchSharedWithMe = async (params: { status?: string, search?: string }): Promise<{ prompts: SharedPrompt[], activeCount: number, pendingCount: number }> => {
    await delay(800);

    // Mock shared prompts
    const mockSharedPrompts: SharedPrompt[] = [
        {
            share: {
                id: 'share-recv-1',
                prompt_id: 'p-external-1',
                shared_by: 'user-external',
                shared_with_email: 'me@example.com',
                permission: 'view',
                status: 'active',
                created_at: new Date(Date.now() - 86400000).toISOString(),
                message: 'Acho que você vai gostar deste prompt para SEO.'
            },
            prompt: {
                ...MOCK_PROMPTS[0],
                id: 'p-external-1',
                title: 'SEO Master Blaster (Compartilhado)',
                user_id: 'user-external'
            },
            shared_by: {
                name: 'João Silva',
                avatar_url: ''
            }
        },
        {
            share: {
                id: 'share-recv-2',
                prompt_id: 'p-external-2',
                shared_by: 'user-boss',
                shared_with_email: 'me@example.com',
                permission: 'edit',
                status: 'pending',
                created_at: new Date().toISOString(),
                message: 'Por favor revise este prompt de vendas.'
            },
            prompt: {
                ...MOCK_PROMPTS[1],
                id: 'p-external-2',
                title: 'Script de Vendas Enterprise',
                user_id: 'user-boss'
            },
            shared_by: {
                name: 'Maria Chefe',
                avatar_url: ''
            }
        }
    ];

    const filtered = mockSharedPrompts.filter(item =>
        !params.status || item.share.status === params.status
    );

    return {
        prompts: filtered,
        activeCount: 1,
        pendingCount: 1
    };
};

export const respondToShare = async (shareId: string, action: 'accept' | 'decline') => {
    await delay(600);
    return true;
};

export const copySharedPrompt = async (shareId: string, data: any): Promise<Prompt> => {
    await delay(1000);
    return {
        ...MOCK_PROMPTS[0],
        id: `p-new-${Date.now()}`,
        title: data.new_title || 'Cópia de Prompt',
        category_id: data.category_id
    };
};

// --- Variables ---

export const fetchCommonVariables = async (): Promise<CommonVariable[]> => {
    await delay(400);
    // Mocking the seed data from SQL
    return [
        { id: 'v1', name: 'tone', label: 'Tom de Voz', category: 'copy', options: '["Profissional", "Casual", "Humorístico"]', input_type: 'select', order_index: 1 },
        { id: 'v2', name: 'target_audience', label: 'Público-Alvo', category: 'copy', input_type: 'text', placeholder: 'Ex: Jovens 18-24', order_index: 2 },
        { id: 'v3', name: 'style', label: 'Estilo Visual', category: 'image', options: '["Fotorrealista", "3D Render", "Minimalista"]', input_type: 'select', order_index: 1 },
        { id: 'v4', name: 'video_duration', label: 'Duração', category: 'video', options: '["15s", "30s", "60s"]', input_type: 'select', order_index: 1 },
        { id: 'v5', name: 'platform', label: 'Plataforma', category: 'copy', options: '["Instagram", "LinkedIn", "Email"]', input_type: 'multiselect', order_index: 8 }
    ] as CommonVariable[];
};

// --- Custom Variables (User-defined) ---

export interface CustomVariable {
    id: string;
    user_id: string;
    name: string;
    label: string;
    description?: string;
    type: 'text' | 'select' | 'multiselect';
    options: { value: string; label: string }[];
    placeholder?: string;
    category: string;
    order_index: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export const fetchCustomVariables = async (userId: string): Promise<CustomVariable[]> => {
    if (IS_REAL_DB && supabase) {
        const { data, error } = await supabase
            .from('custom_variables')
            .select('*')
            .eq('user_id', userId)
            .eq('is_active', true)
            .order('order_index');
        if (error) throw error;
        return (data || []).map(v => ({
            ...v,
            options: typeof v.options === 'string' ? JSON.parse(v.options) : v.options || []
        }));
    }
    return [];
};

export const createCustomVariable = async (data: Partial<CustomVariable>): Promise<CustomVariable> => {
    if (IS_REAL_DB && supabase) {
        const payload = {
            ...data,
            options: JSON.stringify(data.options || [])
        };
        const { data: result, error } = await supabase
            .from('custom_variables')
            .insert(payload)
            .select()
            .single();
        if (error) throw error;
        return {
            ...result,
            options: typeof result.options === 'string' ? JSON.parse(result.options) : result.options || []
        };
    }
    throw new Error('Database not configured');
};

export const updateCustomVariable = async (id: string, updates: Partial<CustomVariable>): Promise<CustomVariable> => {
    if (IS_REAL_DB && supabase) {
        const payload = {
            ...updates,
            options: updates.options ? JSON.stringify(updates.options) : undefined
        };
        const { data: result, error } = await supabase
            .from('custom_variables')
            .update(payload)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return {
            ...result,
            options: typeof result.options === 'string' ? JSON.parse(result.options) : result.options || []
        };
    }
    throw new Error('Database not configured');
};

export const deleteCustomVariable = async (id: string): Promise<boolean> => {
    if (IS_REAL_DB && supabase) {
        const { error } = await supabase
            .from('custom_variables')
            .delete()
            .eq('id', id);
        if (error) throw error;
        return true;
    }
    throw new Error('Database not configured');
};

// --- Video Analysis ---

export const analyzeVideo = async (url: string) => {
    await delay(3000); // Simulate processing time

    // Determine platform for mock data
    const _platform = url.includes('youtube') ? 'youtube' : url.includes('instagram') ? 'instagram' : 'tiktok';

    // Mock success
    return {
        id: `analysis-${Date.now()}`,
        status: 'processing'
    };
};

export const fetchAnalysisStatus = async (id: string): Promise<VideoAnalysis> => {
    await delay(500);
    // After some time, return completed
    return {
        id,
        user_id: 'user-1',
        platform: 'youtube',
        video_url: 'https://youtube.com/watch?v=mock',
        status: 'completed',
        video_info: {
            title: 'Como Fazer Roteiros Virais em 2024',
            description: 'Neste vídeo explico a técnica...',
            author: 'Creator Pro',
            view_count: 154000,
            thumbnail_url: 'https://picsum.photos/300/200'
        },
        result: {
            summary: 'O vídeo explica uma técnica de 3 passos para roteiros: Gancho polêmico, Conteúdo estruturado e CTA forte.',
            generated_prompts: [
                {
                    content: 'Crie um roteiro de curto com gancho polêmico sobre [Tópico].',
                    title: 'Roteiro Viral Curto',
                    category: 'Social Media',
                    variables: ['Tópico']
                },
                {
                    content: 'Explique [Tema] usando metodo de 3 passos.',
                    title: 'Script Educativo',
                    category: 'Education',
                    variables: ['Tema']
                }
            ]
        },
        created_at: new Date().toISOString()
    };
};

export const createPromptFromAnalysis = async (analysisId: string, data: any): Promise<Prompt> => {
    await delay(1000);
    return {
        ...MOCK_PROMPTS[0],
        id: `p-video-${Date.now()}`,
        title: data.title,
        content: data.content,
        category_id: data.category_id
    };
};
