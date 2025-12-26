import { User, Workspace, Prompt, Category, Plan } from '../types';

export const INITIAL_USER: User = {
    id: 'user-1',
    email: 'usuario@exemplo.com',
    name: 'Demo User',
    role: 'super_admin',
    plan_id: 'pro',
    onboarding_completed: true,
    prompts_count: 5,
    categories_count: 3,
    workspaces_count: 1,
    subscription: {
        id: 'sub-1',
        user_id: 'user-1',
        plan_id: 'pro',
        status: 'active',
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    }
};

export const INITIAL_WORKSPACES: Workspace[] = [
    {
        id: 'ws-1',
        owner_id: 'user-1',
        name: 'Meus Prompts',
        slug: 'meus-prompts',
        is_default: true,
        color: '#3b82f6',
        description: 'Workspace pessoal padrão',
        prompts_count: 5,
        categories_count: 3
    }
];

export const INITIAL_CATEGORIES: Category[] = [
    {
        id: 'cat-1',
        workspace_id: 'ws-1',
        parent_id: null,
        name: 'Copywriting',
        slug: 'copywriting',
        color: '#3b82f6',
        icon: '📝',
        depth: 0,
        is_expanded: true,
        prompt_count: 3,
        order_index: 0
    },
    {
        id: 'cat-2',
        workspace_id: 'ws-1',
        parent_id: 'cat-1', // Subcategoria
        name: 'Email Marketing',
        slug: 'email-marketing',
        color: '#3b82f6',
        icon: '📧',
        depth: 1,
        is_expanded: true,
        prompt_count: 1,
        order_index: 0
    },
    {
        id: 'cat-3',
        workspace_id: 'ws-1',
        parent_id: null,
        name: 'Midjourney',
        slug: 'midjourney',
        color: '#8b5cf6',
        icon: '🎨',
        depth: 0,
        is_expanded: true,
        prompt_count: 2,
        order_index: 1
    }
];

export const INITIAL_PROMPTS: Prompt[] = [
    {
        id: 'p-1',
        workspace_id: 'ws-1',
        category_id: 'cat-2',
        user_id: 'user-1',
        title: 'Campanha de Lançamento - Email 1',
        description: 'Email de aquecimento para lançamento de produto digital',
        content: 'Atue como um copywriter sênior. Escreva um email de aquecimento para o lançamento do produto {{produto}} que resolve o problema {{problema}}. O tom deve ser {{tom}}.',
        variables: [
            { name: 'produto', placeholder: 'Nome do produto' },
            { name: 'problema', placeholder: 'Dor principal' },
            { name: 'tom', placeholder: 'Ex: Urgente, Empático', default: 'Empático' }
        ],
        recommended_ai: 'chatgpt',
        tags: ['lançamento', 'email', 'vendas'],
        is_favorite: true,
        copy_count: 12,
        updated_at: new Date().toISOString(),
        order_index: 0
    },
    {
        id: 'p-2',
        workspace_id: 'ws-1',
        category_id: 'cat-3',
        user_id: 'user-1',
        title: 'Retrato Realista 8k',
        content: 'Ultra realistic photo of {{sujeito}}, cinematic lighting, detailed texture, 8k resolution, shot on 35mm lens --v 6.0',
        variables: [
            { name: 'sujeito', placeholder: 'Descrição da pessoa/objeto' }
        ],
        recommended_ai: 'midjourney',
        tags: ['imagem', 'realismo'],
        is_favorite: false,
        copy_count: 5,
        updated_at: new Date(Date.now() - 86400000).toISOString(),
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
        features: ['50 Prompts', '1 Workspace', 'Suporte da comunidade'],
        is_featured: false
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
        features: ['Prompts Ilimitados', '3 Workspaces', 'Prioridade no suporte', 'Análise de IA'],
        is_featured: true
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
        features: ['Tudo do Pro', 'Times ilimitados', 'API Access', 'SSO'],
        is_featured: false
    }
];
