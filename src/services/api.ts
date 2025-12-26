import { PromptShare, SharedPrompt, CommonVariable, VideoAnalysis, Prompt } from '../types';
import { MOCK_PROMPTS } from './mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- Sharing ---

export const sharePrompt = async (promptId: string, data: { emails: string[], permission: string, message?: string }) => {
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
                    title: 'Roteiro Viral Curto',
                    content: 'Crie um roteiro de curto com gancho polêmico sobre [Tópico].',
                    category: 'Social Media',
                    variables: ['Tópico']
                },
                {
                    title: 'Script Educativo',
                    content: 'Explique [Tema] usando metodo de 3 passos.',
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
