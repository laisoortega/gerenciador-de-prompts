export type UserRole = 'super_admin' | 'admin' | 'user';
export type PlanType = 'free' | 'pro' | 'business';
export type ViewType = 'cards' | 'table' | 'kanban' | 'folders';
export type Theme = 'light' | 'dark' | 'system';

// --- User & Auth ---

export interface User {
    id: string;
    email: string;
    name: string;
    avatar_url?: string;
    role: UserRole;
    plan_id: PlanType;
    status: 'active' | 'inactive' | 'suspended' | 'trial';
    onboarding_completed: boolean;
    prompts_count: number;
    categories_count: number;
    workspaces_count: number;
    subscription?: Subscription;
    last_login_at?: string;
    created_at: string;
}

export interface UserSettings {
    id: string;
    user_id: string;
    theme: Theme;
    language: string;
    default_view: ViewType;
    default_workspace_id?: string;
    auto_copy_on_click: boolean;
    show_copy_confirmation: boolean;
    email_notifications: boolean;
    notify_on_pack_assignment: boolean;
    notify_on_trial_ending: boolean;
    marketing_emails: boolean;
}

// --- Billing & Plans ---

export interface Plan {
    id: string;
    name: string;
    slug: PlanType;
    description: string;
    price_monthly: number;
    price_yearly?: number;
    max_prompts: number;
    max_categories: number;
    max_workspaces: number;
    features: string[];
    is_featured: boolean;
    can_share: boolean;
}

export interface Subscription {
    id: string;
    user_id: string;
    plan_id: string;
    status: 'active' | 'trialing' | 'past_due' | 'canceled';
    current_period_end: string;
    trial_ends_at?: string;
    canceled_at?: string;
}

// --- Workspace & Categories ---

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
    role?: 'owner' | 'admin' | 'editor' | 'viewer';
}

export interface Category {
    id: string;
    workspace_id: string;
    parent_id: string | null;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    color: string;

    // Hierarchy
    depth: number;
    path: string; // "id/child_id"
    order_index: number;

    // UI State
    is_expanded: boolean;
    is_system?: boolean;
    prompt_count?: number;

    // Recursive
    children?: Category[];
}

// --- Prompts ---

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
    category?: Category; // Joined data
    user_id: string;

    title: string;
    description?: string;
    content: string;

    variables: PromptVariable[];
    recommended_ai?: string; // 'chatgpt' | 'claude' | ...
    tags: string[];

    is_favorite: boolean;
    is_public?: boolean;
    is_template?: boolean;

    copy_count: number;
    created_at: string;
    updated_at: string;
    last_used_at?: string;
    order_index: number;
}

// --- Sharing ---

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

// --- Video Analysis ---

export interface VideoAnalysis {
    id: string;
    user_id: string;
    platform: 'youtube' | 'instagram' | 'tiktok';
    video_url: string;
    video_id?: string;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'error';
    error_message?: string;
    error?: string;
    video_info?: {
        title: string;
        description?: string;
        duration?: number;
        thumbnail_url?: string;
        author?: string;
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
    result?: {
        summary: string;
        generated_prompts: GeneratedPrompt[];
    };
    generated_prompt_template?: string;
    created_at: string;
}

export interface GeneratedPrompt {
    content: string;
    title: string;
    category?: string;
    variables: string[];
    source_video?: {
        platform: string;
        url: string;
        title?: string;
    };
}

// --- Constants & Config ---

export const SUPPORTED_AIS = [
    { id: 'chatgpt', name: 'ChatGPT', icon: 'Bot' },
    { id: 'claude', name: 'Claude', icon: 'Brain' },
    { id: 'gemini', name: 'Gemini', icon: 'Sparkles' },
    { id: 'perplexity', name: 'Perplexity', icon: 'Search' },
    { id: 'grok', name: 'Grok', icon: 'Cpu' },
    { id: 'manus', name: 'Manus', icon: 'Hand' }, // Placeholder icon
    { id: 'whisk', name: 'Whisk', icon: 'Palette' },
    { id: 'midjourney', name: 'Midjourney', icon: 'Image' },
    { id: 'dalle', name: 'DALL-E', icon: 'Image' },
    { id: 'ideogram', name: 'Ideogram', icon: 'Image' },
    { id: 'leonardo', name: 'Leonardo AI', icon: 'Image' },
];

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
