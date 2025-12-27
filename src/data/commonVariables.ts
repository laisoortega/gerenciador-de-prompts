/**
 * Biblioteca de Variáveis Comuns para Prompts
 * Baseada na documentação completa de variáveis profissionais
 */

export interface VariableOption {
    value: string;
    label: string;
}

export interface CommonVariable {
    name: string;
    label: string;
    description: string;
    type: 'text' | 'select' | 'multiselect';
    options?: VariableOption[];
    placeholder?: string;
}

export interface VariableCategory {
    id: string;
    label: string;
    icon: string;
    color: string;
    variables: CommonVariable[];
}

export const COMMON_VARIABLES: VariableCategory[] = [
    {
        id: 'copywriting',
        label: 'Copywriting',
        icon: 'pen-tool',
        color: '#3b82f6',
        variables: [
            {
                name: 'tom_de_voz',
                label: 'Tom de Voz',
                description: 'Personalidade da comunicação',
                type: 'select',
                options: [
                    { value: 'profissional', label: 'Profissional' },
                    { value: 'casual', label: 'Casual/Conversacional' },
                    { value: 'empatico', label: 'Empático/Acolhedor' },
                    { value: 'persuasivo', label: 'Persuasivo/Vendas' },
                    { value: 'divertido', label: 'Divertido/Humorístico' },
                    { value: 'autoritativo', label: 'Autoritativo/Expert' },
                    { value: 'inspirador', label: 'Inspirador/Motivacional' },
                ]
            },
            {
                name: 'publico_alvo',
                label: 'Público-Alvo',
                description: 'Quem é o destinatário da mensagem',
                type: 'text',
                placeholder: 'Ex: Empreendedores digitais 25-45 anos'
            },
            {
                name: 'framework_copy',
                label: 'Framework',
                description: 'Estrutura metodológica para a copy',
                type: 'select',
                options: [
                    { value: 'aida', label: 'AIDA (Atenção, Interesse, Desejo, Ação)' },
                    { value: 'pas', label: 'PAS (Problema, Agitação, Solução)' },
                    { value: 'bab', label: 'BAB (Before, After, Bridge)' },
                    { value: 'fab', label: 'FAB (Features, Advantages, Benefits)' },
                    { value: '4ps', label: '4 Ps (Promise, Picture, Proof, Push)' },
                ]
            },
            {
                name: 'objetivo_copy',
                label: 'Objetivo',
                description: 'O que a copy deve alcançar',
                type: 'select',
                options: [
                    { value: 'vender', label: 'Vender/Converter' },
                    { value: 'leads', label: 'Capturar Leads' },
                    { value: 'engajar', label: 'Engajar/Interagir' },
                    { value: 'educar', label: 'Educar/Informar' },
                    { value: 'autoridade', label: 'Construir Autoridade' },
                ]
            },
            {
                name: 'gatilho_mental',
                label: 'Gatilho Mental',
                description: 'Gatilho psicológico a utilizar',
                type: 'select',
                options: [
                    { value: 'escassez', label: 'Escassez (quantidade limitada)' },
                    { value: 'urgencia', label: 'Urgência (tempo limitado)' },
                    { value: 'prova_social', label: 'Prova Social (depoimentos)' },
                    { value: 'autoridade', label: 'Autoridade (expertise)' },
                    { value: 'reciprocidade', label: 'Reciprocidade (dar antes)' },
                    { value: 'curiosidade', label: 'Curiosidade (loop aberto)' },
                ]
            },
        ]
    },
    {
        id: 'imagens',
        label: 'Imagens IA',
        icon: 'image',
        color: '#ec4899',
        variables: [
            {
                name: 'estilo_artistico',
                label: 'Estilo Artístico',
                description: 'Define a estética visual geral',
                type: 'select',
                options: [
                    { value: 'fotografia_realista', label: 'Fotografia Realista' },
                    { value: 'ilustracao_digital', label: 'Ilustração Digital' },
                    { value: 'pintura_oleo', label: 'Pintura a Óleo' },
                    { value: 'aquarela', label: 'Aquarela' },
                    { value: 'anime_manga', label: 'Anime/Manga' },
                    { value: '3d_render', label: 'Renderização 3D' },
                    { value: 'pixel_art', label: 'Pixel Art' },
                    { value: 'concept_art', label: 'Concept Art' },
                ]
            },
            {
                name: 'tipo_iluminacao',
                label: 'Iluminação',
                description: 'Como a luz incide na cena',
                type: 'select',
                options: [
                    { value: 'natural', label: 'Luz Natural' },
                    { value: 'golden_hour', label: 'Golden Hour' },
                    { value: 'estudio', label: 'Iluminação de Estúdio' },
                    { value: 'cinematografica', label: 'Cinematográfica' },
                    { value: 'neon', label: 'Luz Neon' },
                    { value: 'dramatica', label: 'Dramática/Alto Contraste' },
                ]
            },
            {
                name: 'paleta_cores',
                label: 'Paleta de Cores',
                description: 'Esquema de cores predominante',
                type: 'select',
                options: [
                    { value: 'vibrante', label: 'Vibrante/Saturado' },
                    { value: 'pastel', label: 'Pastel/Suave' },
                    { value: 'monocromatico', label: 'Monocromático' },
                    { value: 'quente', label: 'Tons Quentes' },
                    { value: 'frio', label: 'Tons Frios' },
                    { value: 'pb', label: 'Preto e Branco' },
                ]
            },
            {
                name: 'proporcao_imagem',
                label: 'Proporção',
                description: 'Aspect ratio da imagem',
                type: 'select',
                options: [
                    { value: '1:1', label: '1:1 (Quadrado - Instagram)' },
                    { value: '9:16', label: '9:16 (Stories/Reels)' },
                    { value: '16:9', label: '16:9 (YouTube/Widescreen)' },
                    { value: '4:3', label: '4:3 (Padrão)' },
                    { value: '3:2', label: '3:2 (Fotografia)' },
                ]
            },
        ]
    },
    {
        id: 'videos',
        label: 'Vídeos',
        icon: 'video',
        color: '#f59e0b',
        variables: [
            {
                name: 'formato_video',
                label: 'Formato',
                description: 'Tipo/formato do vídeo',
                type: 'select',
                options: [
                    { value: 'reels', label: 'Reels/TikTok (curto)' },
                    { value: 'youtube', label: 'YouTube (médio/longo)' },
                    { value: 'stories', label: 'Stories (15s)' },
                    { value: 'vsl', label: 'VSL (Vídeo de Vendas)' },
                    { value: 'tutorial', label: 'Tutorial' },
                    { value: 'webinar', label: 'Webinário' },
                ]
            },
            {
                name: 'tipo_hook',
                label: 'Tipo de Hook',
                description: 'Gancho para os primeiros segundos',
                type: 'select',
                options: [
                    { value: 'pergunta', label: 'Pergunta provocativa' },
                    { value: 'afirmacao', label: 'Afirmação chocante' },
                    { value: 'promessa', label: 'Promessa de resultado' },
                    { value: 'estatistica', label: 'Estatística impactante' },
                    { value: 'historia', label: 'Início de história' },
                    { value: 'fomo', label: 'FOMO (medo de perder)' },
                ]
            },
            {
                name: 'duracao_video',
                label: 'Duração',
                description: 'Tempo do vídeo',
                type: 'select',
                options: [
                    { value: '15s', label: '15 segundos (Stories)' },
                    { value: '60s', label: '60 segundos (Reels/Shorts)' },
                    { value: '3min', label: '3 minutos (TikTok)' },
                    { value: '10min', label: '10 minutos (YouTube curto)' },
                    { value: '20min', label: '20 minutos (YouTube médio)' },
                ]
            },
        ]
    },
    {
        id: 'universal',
        label: 'Universal',
        icon: 'globe',
        color: '#8b5cf6',
        variables: [
            {
                name: 'nome_marca',
                label: 'Nome da Marca',
                description: 'Nome da empresa/marca',
                type: 'text',
                placeholder: 'Ex: PromptMaster'
            },
            {
                name: 'produto',
                label: 'Produto/Serviço',
                description: 'O que está sendo oferecido',
                type: 'text',
                placeholder: 'Ex: Curso de Marketing Digital'
            },
            {
                name: 'beneficio_principal',
                label: 'Benefício Principal',
                description: 'Maior transformação/resultado',
                type: 'text',
                placeholder: 'Ex: Dobrar suas vendas em 90 dias'
            },
            {
                name: 'idioma',
                label: 'Idioma',
                description: 'Idioma do conteúdo',
                type: 'select',
                options: [
                    { value: 'pt-br', label: 'Português (Brasil)' },
                    { value: 'pt-pt', label: 'Português (Portugal)' },
                    { value: 'en-us', label: 'Inglês (EUA)' },
                    { value: 'es', label: 'Espanhol' },
                ]
            },
            {
                name: 'contexto',
                label: 'Contexto Adicional',
                description: 'Informações extras relevantes',
                type: 'text',
                placeholder: 'Ex: Lançamento de Black Friday'
            },
        ]
    },
];

// Helper function to get all variables as a flat array
export function getAllVariables(): CommonVariable[] {
    return COMMON_VARIABLES.flatMap(cat => cat.variables);
}

// Helper function to find a variable by name
export function findVariable(name: string): CommonVariable | undefined {
    return getAllVariables().find(v => v.name === name);
}

// Helper function to get category by variable name
export function getVariableCategory(name: string): VariableCategory | undefined {
    return COMMON_VARIABLES.find(cat => cat.variables.some(v => v.name === name));
}
