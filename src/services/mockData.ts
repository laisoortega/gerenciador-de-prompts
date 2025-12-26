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
    prompts_count: 125,
    categories_count: 15,
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
        prompts_count: 125,
        categories_count: 15
    }
];

// Helper to create dates
const now = new Date().toISOString();

export const MOCK_CATEGORIES: Category[] = [
    // Main Category: Copywriting
    {
        id: 'cat-copy',
        workspace_id: 'default',
        parent_id: null,
        name: 'Copywriting',
        slug: 'copywriting',
        color: '#3b82f6',
        icon: '✍️',
        depth: 0,
        path: 'cat-copy',
        is_expanded: false,
        prompt_count: 45,
        order_index: 0
    },
    // Subcategories for Copywriting
    {
        id: 'cat-email',
        workspace_id: 'default',
        parent_id: 'cat-copy',
        name: 'E-mails',
        slug: 'emails',
        color: '#3b82f6',
        icon: '📧',
        depth: 1,
        path: 'cat-copy/cat-email',
        is_expanded: false,
        prompt_count: 8,
        order_index: 0
    },
    {
        id: 'cat-whatsapp',
        workspace_id: 'default',
        parent_id: 'cat-copy',
        name: 'WhatsApp',
        slug: 'whatsapp',
        color: '#25D366',
        icon: '💬',
        depth: 1,
        path: 'cat-copy/cat-whatsapp',
        is_expanded: false,
        prompt_count: 6,
        order_index: 1
    },
    {
        id: 'cat-sales-page',
        workspace_id: 'default',
        parent_id: 'cat-copy',
        name: 'Página de Vendas',
        slug: 'pagina-vendas',
        color: '#f59e0b',
        icon: '💰',
        depth: 1,
        path: 'cat-copy/cat-sales-page',
        is_expanded: false,
        prompt_count: 7,
        order_index: 2
    },
    {
        id: 'cat-capture-page',
        workspace_id: 'default',
        parent_id: 'cat-copy',
        name: 'Página de Captura',
        slug: 'pagina-captura',
        color: '#10b981',
        icon: '🧲',
        depth: 1,
        path: 'cat-copy/cat-capture-page',
        is_expanded: false,
        prompt_count: 5,
        order_index: 3
    },
    {
        id: 'cat-ads',
        workspace_id: 'default',
        parent_id: 'cat-copy',
        name: 'Anúncios Pagos',
        slug: 'anuncios',
        color: '#ef4444',
        icon: '📢',
        depth: 1,
        path: 'cat-copy/cat-ads',
        is_expanded: false,
        prompt_count: 5,
        order_index: 4
    },
    {
        id: 'cat-vsl',
        workspace_id: 'default',
        parent_id: 'cat-copy',
        name: 'Roteiros de VSL',
        slug: 'vsl',
        color: '#8b5cf6',
        icon: '📹',
        depth: 1,
        path: 'cat-copy/cat-vsl',
        is_expanded: false,
        prompt_count: 5,
        order_index: 5
    },

    // Main Category: Redes Sociais
    {
        id: 'cat-social',
        workspace_id: 'default',
        parent_id: null,
        name: 'Redes Sociais',
        slug: 'redes-sociais',
        color: '#ec4899',
        icon: '📱',
        depth: 0,
        path: 'cat-social',
        is_expanded: false,
        prompt_count: 35,
        order_index: 1
    },
    {
        id: 'cat-instagram',
        workspace_id: 'default',
        parent_id: 'cat-social',
        name: 'Instagram',
        slug: 'instagram',
        color: '#d946ef',
        icon: '📸',
        depth: 1,
        path: 'cat-social/cat-instagram',
        is_expanded: false,
        prompt_count: 7,
        order_index: 0
    },
    {
        id: 'cat-tiktok',
        workspace_id: 'default',
        parent_id: 'cat-social',
        name: 'TikTok',
        slug: 'tiktok',
        color: '#000000',
        icon: '🎵',
        depth: 1,
        path: 'cat-social/cat-tiktok',
        is_expanded: false,
        prompt_count: 5,
        order_index: 1
    },
    {
        id: 'cat-youtube',
        workspace_id: 'default',
        parent_id: 'cat-social',
        name: 'YouTube',
        slug: 'youtube',
        color: '#ff0000',
        icon: '▶️',
        depth: 1,
        path: 'cat-social/cat-youtube',
        is_expanded: false,
        prompt_count: 5,
        order_index: 2
    },

    // Main Category: Estratégia & Viralização
    {
        id: 'cat-strategy',
        workspace_id: 'default',
        parent_id: null,
        name: 'Estratégia & Viral',
        slug: 'estrategia',
        color: '#8b5cf6',
        icon: '🚀',
        depth: 0,
        path: 'cat-strategy',
        is_expanded: false,
        prompt_count: 20,
        order_index: 2
    },
    {
        id: 'cat-viral',
        workspace_id: 'default',
        parent_id: 'cat-strategy',
        name: 'Roteiros Virais',
        slug: 'roteiros-virais',
        color: '#8b5cf6',
        icon: '🔥',
        depth: 1,
        path: 'cat-strategy/cat-viral',
        is_expanded: false,
        prompt_count: 5,
        order_index: 0
    },
    {
        id: 'cat-webinar',
        workspace_id: 'default',
        parent_id: 'cat-strategy',
        name: 'Webinários',
        slug: 'webinarios',
        color: '#6366f1',
        icon: '🎓',
        depth: 1,
        path: 'cat-strategy/cat-webinar',
        is_expanded: false,
        prompt_count: 4,
        order_index: 1
    },
    {
        id: 'cat-hooks',
        workspace_id: 'default',
        parent_id: 'cat-strategy',
        name: 'Hooks & Headlines',
        slug: 'hooks',
        color: '#f43f5e',
        icon: '🪝',
        depth: 1,
        path: 'cat-strategy/cat-hooks',
        is_expanded: false,
        prompt_count: 3,
        order_index: 2
    }
];

export const MOCK_PROMPTS: Prompt[] = [
    // --- E-mails ---
    {
        id: 'p-email-1',
        workspace_id: 'default',
        category_id: 'cat-email',
        user_id: 'user-1',
        title: 'E-mail de Boas-Vindas',
        description: 'Primeiro e-mail após cadastro, criando conexão',
        content: 'Crie um e-mail de boas-vindas para novos inscritos com as seguintes características:\n\n**Contexto:**\n- Produto/Serviço: {{produto}}\n- Nome do remetente: {{nome_remetente}}\n- Promessa principal: {{promessa_principal}}\n- Tom de voz: {{tom_de_voz}}\n\n**Estrutura do e-mail:**\n1. Assunto chamativo (máximo 50 caracteres) + opção com emoji\n2. Saudação personalizada usando o nome\n3. Parágrafo de boas-vindas e validação da decisão\n4. O que o inscrito pode esperar (3 bullets)\n5. Próximo passo claro (CTA)\n6. P.S. com curiosidade ou bônus\n\n**Regras:**\n- Máximo 200 palavras no corpo\n- Linguagem conversacional e próxima\n- Criar senso de comunidade\n- Incluir 1 elemento de prova social sutil',
        variables: [
            { "name": "produto", "value": "Nome do produto/serviço" },
            { "name": "nome_remetente", "value": "Seu nome" },
            { "name": "promessa_principal", "value": "Promessa principal" },
            { "name": "tom_de_voz", "value": "Profissional/Amigável" }
        ],
        recommended_ai: 'claude',
        tags: ['email', 'boas-vindas', 'onboarding'],
        is_favorite: true,
        copy_count: 0,
        updated_at: now,
        created_at: now,
        order_index: 0
    },
    {
        id: 'p-email-2',
        workspace_id: 'default',
        category_id: 'cat-email',
        user_id: 'user-1',
        title: 'Recuperação de Carrinho',
        description: 'Sequência de 3 e-mails para recuperar vendas',
        content: 'Crie uma sequência de 3 e-mails para recuperação de carrinho abandonado:\n\n**Contexto:**\n- Produto: {{produto}}\n- Preço: {{preco}}\n- Benefício principal: {{beneficio_principal}}\n- Objeção comum: {{objecao_comum}}\n- Urgência/Escassez: {{urgencia}}\n\n**E-mail 1 (1h):** Prestativo, "Esqueceu algo?", CTA voltar.\n**E-mail 2 (24h):** Urgência leve, benefícios, prova social.\n**E-mail 3 (48h):** Última chance, escassez, bônus/desconto.',
        variables: [
            { "name": "produto", "value": "" },
            { "name": "preco", "value": "" },
            { "name": "beneficio_principal", "value": "" },
            { "name": "objecao_comum", "value": "" },
            { "name": "urgencia", "value": "" }
        ],
        recommended_ai: 'claude',
        tags: ['email', 'vendas', 'recuperação'],
        is_favorite: false,
        copy_count: 0,
        updated_at: now,
        created_at: now,
        order_index: 1
    },

    // --- WhatsApp ---
    {
        id: 'p-whats-1',
        workspace_id: 'default',
        category_id: 'cat-whatsapp',
        user_id: 'user-1',
        title: 'Sequência de Lançamento',
        description: 'Mensagens para grupo VIP durante lançamento',
        content: 'Crie uma sequência de mensagens de WhatsApp para lançamento:\n\n**Contexto:**\n- Produto: {{produto}}\n- Preço: {{preco}}\n- Link de vendas: {{link}}\n- Duração do carrinho: {{duracao}}\n- Bônus exclusivo: {{bonus_exclusivo}}\n\nCrie mensagens para: Aquecimento, Abertura, Lembrete D+1, Meio do carrinho, Penúltimo dia, Último dia (manhã e noite).',
        variables: [
            { "name": "produto", "value": "" },
            { "name": "preco", "value": "" },
            { "name": "link", "value": "" },
            { "name": "duracao", "value": "" },
            { "name": "bonus_exclusivo", "value": "" }
        ],
        recommended_ai: 'claude',
        tags: ['whatsapp', 'lançamento', 'grupo'],
        is_favorite: false,
        copy_count: 0,
        updated_at: now,
        created_at: now,
        order_index: 0
    },

    // --- Instagram ---
    {
        id: 'p-insta-1',
        workspace_id: 'default',
        category_id: 'cat-instagram',
        user_id: 'user-1',
        title: 'Carrossel Educativo (10 slides)',
        description: 'Estrutura para carrossel que gera salvamentos',
        content: 'Crie um carrossel educativo de 10 slides para Instagram:\n\n**Contexto:**\n- Tema: {{tema}}\n- Público-alvo: {{publico}}\n- Nível: {{nivel}}\n- CTA: {{cta}}\n\n**Estrutura:**\nSlide 1: Capa (Headline)\nSlide 2: Contexto\nSlides 3-8: Conteúdo (1 dica por slide)\nSlide 9: Resumo\nSlide 10: CTA',
        variables: [
            { "name": "tema", "value": "" },
            { "name": "publico", "value": "" },
            { "name": "nivel", "value": "Iniciante" },
            { "name": "cta", "value": "Salvar" }
        ],
        recommended_ai: 'gpt4',
        tags: ['instagram', 'carrossel', 'educativo'],
        is_favorite: true,
        copy_count: 0,
        updated_at: now,
        created_at: now,
        order_index: 0
    },
    {
        id: 'p-insta-2',
        workspace_id: 'default',
        category_id: 'cat-instagram',
        user_id: 'user-1',
        title: 'Legenda para Post de Feed',
        description: 'Legenda engajadora com gancho forte',
        content: 'Crie uma legenda para post de Instagram:\n\n**Contexto:**\n- Tema: {{tema}}\n- Objetivo: {{objetivo}}\n- Tom: {{tom}}\n- CTA: {{cta}}\n\n**Estrutura:**\n1. Gancho (primeira linha impactante)\n2. Corpo (desenvolvimento com espaçamento)\n3. CTA (pergunta ou instrução)\nEntregue 3 opções de Gancho.',
        variables: [
            { "name": "tema", "value": "" },
            { "name": "objetivo", "value": "Engajamento" },
            { "name": "tom", "value": "Casual" },
            { "name": "cta", "value": "Comentar" }
        ],
        recommended_ai: 'gpt4',
        tags: ['instagram', 'legenda', 'feed'],
        is_favorite: false,
        copy_count: 0,
        updated_at: now,
        created_at: now,
        order_index: 1
    },

    // --- YouTube ---
    {
        id: 'p-yt-1',
        workspace_id: 'default',
        category_id: 'cat-youtube',
        user_id: 'user-1',
        title: 'Roteiro de Vídeo (10-15 min)',
        description: 'Roteiro completo com retenção em mente',
        content: 'Crie um roteiro completo para vídeo de YouTube:\n\n**Contexto:**\n- Título: {{titulo}}\n- Objetivo: {{objetivo}}\n- Público: {{publico}}\n\n**Estrutura:**\n0:00 HOOK (5s)\n0:30 INTRODUÇÃO\n2:00 CONTEÚDO (Dividido em seções)\n10:00 RECAPITULAÇÃO\n12:00 CTA\n13:00 BÔNUS/EXTRA',
        variables: [
            { "name": "titulo", "value": "" },
            { "name": "objetivo", "value": "Educar" },
            { "name": "publico", "value": "" }
        ],
        recommended_ai: 'claude',
        tags: ['youtube', 'roteiro', 'video'],
        is_favorite: false,
        copy_count: 0,
        updated_at: now,
        created_at: now,
        order_index: 0
    },

    // --- TikTok ---
    {
        id: 'p-tiktok-1',
        workspace_id: 'default',
        category_id: 'cat-tiktok',
        user_id: 'user-1',
        title: 'Script Viral (15-30s)',
        description: 'Roteiro dinâmico para TikTok',
        content: 'Crie um roteiro de TikTok viral:\n\n**Contexto:**\n- Nicho: {{nicho}}\n- Objetivo: {{objetivo}}\n\n**Estrutura:**\n0-1s: Pattern Interrupt\n1-3s: Hook Verbal\n3-25s: Conteúdo Rápido\n25-30s: Payoff + CTA\n\nEntregue 5 opções de gancho.',
        variables: [
            { "name": "nicho", "value": "" },
            { "name": "objetivo", "value": "Viralizar" }
        ],
        recommended_ai: 'gpt4',
        tags: ['tiktok', 'viral', 'script'],
        is_favorite: false,
        copy_count: 0,
        updated_at: now,
        created_at: now,
        order_index: 0
    },

    // --- Páginas de Venda ---
    {
        id: 'p-sales-1',
        workspace_id: 'default',
        category_id: 'cat-sales-page',
        user_id: 'user-1',
        title: 'Página de Vendas Longa',
        description: 'Estrutura completa de sales page',
        content: 'Crie uma página de vendas completa:\n\n**Produto:** {{produto}}\n**Preço:** {{preco}}\n**Dor:** {{dor}}\n**Transformação:** {{transformacao}}\n\n**Seções:**\n1. Headline\n2. Problema/Agitação\n3. História\n4. Solução\n5. Oferta\n6. Bônus\n7. Prova Social\n8. Garantia\n9. FAQ\n10. Fechamento',
        variables: [
            { "name": "produto", "value": "" },
            { "name": "preco", "value": "" },
            { "name": "dor", "value": "" },
            { "name": "transformacao", "value": "" }
        ],
        recommended_ai: 'claude',
        tags: ['vendas', 'copywriting', 'landing-page'],
        is_favorite: false,
        copy_count: 0,
        updated_at: now,
        created_at: now,
        order_index: 0
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
