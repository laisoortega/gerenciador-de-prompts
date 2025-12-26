import { User, Workspace, Category, Prompt, Plan } from '../types';

export const INITIAL_USER: User = {
    id: 'user-1',
    email: 'lais@example.com',
    name: 'Laís Ortega',
    avatar_url: 'https://github.com/laisoortega.png',
    role: 'super_admin',
    plan_id: 'pro',
    status: 'active',
    onboarding_completed: true,
    prompts_count: 12,
    categories_count: 5,
    workspaces_count: 1,
    created_at: new Date().toISOString(),
    subscription: {
        id: 'sub-1',
        user_id: 'user-1',
        plan_id: 'pro',
        status: 'active',
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    }
};

export const MOCK_WORKSPACES: Workspace[] = [
    {
        id: 'default',
        owner_id: 'user-1',
        name: 'Meus Prompts',
        slug: 'meus-prompts',
        is_default: true,
        color: 'blue',
        icon: '🏠',
        prompts_count: 12,
        categories_count: 5
    }
];

export const MOCK_CATEGORIES: Category[] = [
    {
        id: 'cat-1',
        workspace_id: 'default',
        parent_id: null,
        name: 'Copywriting',
        slug: 'copywriting',
        color: '#3b82f6',
        icon: '✍️',
        depth: 0,
        path: 'cat-1',
        is_expanded: true,
        prompt_count: 5,
        order_index: 0
    },
    {
        id: 'cat-2',
        workspace_id: 'default',
        parent_id: 'cat-1',
        name: 'VSL Scripts',
        slug: 'vsl-scripts',
        color: '#3b82f6',
        icon: '📹',
        depth: 1,
        path: 'cat-1/cat-2',
        is_expanded: true,
        prompt_count: 3,
        order_index: 0
    },
    {
        id: 'cat-3',
        workspace_id: 'default',
        parent_id: null,
        name: 'Social Media',
        slug: 'social-media',
        color: '#ec4899',
        icon: '📱',
        depth: 0,
        path: 'cat-3',
        is_expanded: true,
        prompt_count: 7,
        order_index: 1
    }
];

export const MOCK_PROMPTS: Prompt[] = [
    {
        id: 'prompt-1',
        workspace_id: 'default',
        category_id: 'cat-2',
        user_id: 'user-1',
        title: 'Estrutura VSL Alta Conversão',
        description: 'Template base para vídeos de vendas',
        content: 'Crie um roteiro de vídeo de vendas para {{produto}} seguindo a estrutura: Gancho, História, Problema, Solução, Oferta.',
        variables: [{ name: 'produto', value: '' }],
        recommended_ai: 'claude',
        tags: ['vendas', 'video', 'marketing'],
        is_favorite: true,
        copy_count: 15,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        order_index: 0
    },
    {
        id: 'prompt-2',
        workspace_id: 'default',
        category_id: 'cat-3',
        user_id: 'user-1',
        title: 'Calendário de Conteúdo Instagram',
        description: 'Gera 30 ideias de posts',
        content: 'Crie um calendário editorial de 30 dias para um perfil de {{nicho}} focado em {{objetivo}}.',
        variables: [
            { name: 'nicho', value: '' },
            { name: 'objetivo', value: '' }
        ],
        recommended_ai: 'chatgpt',
        tags: ['social-media', 'instagram', 'planejamento'],
        is_favorite: false,
        copy_count: 8,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        order_index: 1
    }
];

export const MOCK_PLANS: Plan[] = [
    {
        id: 'free',
        name: 'Free',
        slug: 'free',
        description: 'Para iniciantes',
        price_monthly: 0,
        max_prompts: 50,
        max_categories: 5,
        max_workspaces: 1,
        features: ['50 Prompts', '5 Categorias', '1 Workspace'],
        is_featured: false,
        can_share: false
    },
    {
        id: 'pro',
        name: 'Pro',
        slug: 'pro',
        description: 'Para profissionais',
        price_monthly: 29.90,
        max_prompts: 1000,
        max_categories: 100,
        max_workspaces: 3,
        features: ['Prompts Ilimitados', 'Categorias Ilimitadas', '3 Workspaces', 'Compartilhamento'],
        is_featured: true,
        can_share: true
    },
    {
        id: 'business',
        name: 'Business',
        slug: 'business',
        description: 'Para times',
        price_monthly: 99.90,
        max_prompts: 10000,
        max_categories: 1000,
        max_workspaces: 10,
        features: ['Tudo do Pro', 'Times', 'API', 'Suporte Prioritário'],
        is_featured: false,
        can_share: true
    }
];
