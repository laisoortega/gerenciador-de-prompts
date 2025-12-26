export type UserRole = 'super_admin' | 'admin' | 'user';
export type PlanType = 'free' | 'pro' | 'business';
export type ViewType = 'cards' | 'table' | 'kanban' | 'folders';
export type Theme = 'light' | 'dark' | 'system';

export interface Plan {
    id: string;
    name: string;
    slug: PlanType;
    description: string;
    price_monthly: number;
    max_prompts: number;
    max_categories: number;
    max_workspaces: number;
    features: string[];
    is_featured: boolean;
}

export interface Subscription {
    id: string;
    user_id: string;
    plan_id: string;
    status: 'active' | 'trialing' | 'past_due' | 'canceled';
    current_period_end: string;
}

export interface User {
    id: string;
    email: string;
    name: string;
    avatar_url?: string;
    role: UserRole;
    plan_id: PlanType;
    onboarding_completed: boolean;
    prompts_count: number;
    categories_count: number;
    workspaces_count: number;
    subscription?: Subscription;
}

export interface Workspace {
    id: string;
    owner_id: string;
    name: string;
    description?: string;
    slug: string;
    is_default: boolean;
    color: string;
    icon?: string;
    prompts_count?: number;
    categories_count?: number;
}

export interface Category {
    id: string;
    workspace_id: string;
    parent_id: string | null;
    name: string;
    slug: string;
    color: string;
    icon?: string;
    depth: number;
    is_expanded: boolean;
    prompt_count: number;
    order_index: number;
    children?: Category[];
}

export interface PromptVariable {
    name: string;
    value?: string;
    placeholder?: string;
    default?: string;
}

export interface Prompt {
    id: string;
    workspace_id: string;
    category_id?: string;
    user_id: string;
    title: string;
    description?: string;
    content: string;
    variables: PromptVariable[];
    recommended_ai?: string;
    tags: string[];
    is_favorite: boolean;
    copy_count: number;
    updated_at: string;
    order_index: number;
}

export const SUPPORTED_AIS = [
    { id: 'chatgpt', name: 'ChatGPT', icon: 'Bot' },
    { id: 'claude', name: 'Claude', icon: 'Brain' },
    { id: 'gemini', name: 'Gemini', icon: 'Sparkles' },
    { id: 'midjourney', name: 'Midjourney', icon: 'Image' },
    { id: 'other', name: 'Outros', icon: 'Zap' },
];

export interface PromptShare {
    id: string;
    prompt_id: string;
    shared_by: string;
    shared_with_email: string;
    shared_with_user_id?: string;
    shared_with_user?: {
        name: string;
        avatar_url?: string;
    };
    permission: 'view' | 'edit' | 'full';
    status: 'pending' | 'active' | 'revoked' | 'declined';
    message?: string;
    created_at: string;
}

export interface SharedPrompt {
    share: PromptShare;
    prompt: Prompt;
    shared_by: {
        name: string;
        avatar_url?: string;
    };
}

export interface CommonVariable {
    id: string;
    name: string;
    label: string;
    placeholder?: string;
    description?: string;
    category: 'copy' | 'image' | 'video' | 'general';
    options?: string; // JSON string
    input_type: 'text' | 'select' | 'multiselect' | 'textarea';
    order_index: number;
}

export interface VideoAnalysis {
    id: string;
    user_id: string;
    platform: 'youtube' | 'instagram' | 'tiktok';
    video_url: string;
    video_id?: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    error_message?: string;
    video_metadata?: {
        title: string;
        description?: string;
        duration?: number;
        thumbnail_url?: string;
        channel_name?: string;
        view_count?: number;
        like_count?: number;
    };
    transcript?: string;
    analysis?: {
        hook?: {
            text: string;
            type: string;
        };
        structure?: string;
        tone?: string;
        cta?: {
            text: string;
        };
        engagement_techniques?: string[];
    };
    generated_prompt_template?: string;
    created_at: string;
}

export interface GeneratedPrompt {
    content: string;
    title: string;
    variables: string[];
    source_video?: {
        platform: string;
        url: string;
        title?: string;
    };
}
