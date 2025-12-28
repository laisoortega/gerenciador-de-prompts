-- ===========================================
-- SCHEMA PROMPTMASTER SAAS
-- Execute este SQL no Supabase SQL Editor
-- ===========================================

-- Habilitar UUID
create extension if not exists "uuid-ossp";

-- ===========================================
-- TABELA: workspaces
-- ===========================================
create table public.workspaces (
    id uuid default uuid_generate_v4() primary key,
    owner_id uuid references auth.users(id) on delete cascade not null,
    name text not null default 'Meu Workspace',
    slug text,
    is_default boolean default true,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- RLS
alter table public.workspaces enable row level security;

create policy "Users can view own workspaces"
    on public.workspaces for select
    using (owner_id = auth.uid());

create policy "Users can insert own workspaces"
    on public.workspaces for insert
    with check (owner_id = auth.uid());

create policy "Users can update own workspaces"
    on public.workspaces for update
    using (owner_id = auth.uid());

create policy "Users can delete own workspaces"
    on public.workspaces for delete
    using (owner_id = auth.uid());

-- ===========================================
-- TABELA: categories
-- ===========================================
create table public.categories (
    id uuid default uuid_generate_v4() primary key,
    workspace_id uuid references public.workspaces(id) on delete cascade not null,
    user_id uuid references auth.users(id) on delete cascade not null,
    name text not null,
    color text default '#3b82f6',
    icon text,
    parent_id uuid references public.categories(id) on delete set null,
    order_index integer default 0,
    is_expanded boolean default true,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- RLS
alter table public.categories enable row level security;

create policy "Users can view own categories"
    on public.categories for select
    using (user_id = auth.uid());

create policy "Users can insert own categories"
    on public.categories for insert
    with check (user_id = auth.uid());

create policy "Users can update own categories"
    on public.categories for update
    using (user_id = auth.uid());

create policy "Users can delete own categories"
    on public.categories for delete
    using (user_id = auth.uid());

-- ===========================================
-- TABELA: prompts
-- ===========================================
create table public.prompts (
    id uuid default uuid_generate_v4() primary key,
    workspace_id uuid references public.workspaces(id) on delete cascade not null,
    user_id uuid references auth.users(id) on delete cascade not null,
    category_id uuid references public.categories(id) on delete set null,
    title text not null,
    content text not null,
    variables jsonb default '[]'::jsonb,
    tags text[] default '{}',
    recommended_ai text,
    is_favorite boolean default false,
    copy_count integer default 0,
    order_index integer default 0,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- RLS
alter table public.prompts enable row level security;

create policy "Users can view own prompts"
    on public.prompts for select
    using (user_id = auth.uid());

create policy "Users can insert own prompts"
    on public.prompts for insert
    with check (user_id = auth.uid());

create policy "Users can update own prompts"
    on public.prompts for update
    using (user_id = auth.uid());

create policy "Users can delete own prompts"
    on public.prompts for delete
    using (user_id = auth.uid());

-- ===========================================
-- TABELA: custom_variables
-- ===========================================
create table public.custom_variables (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    name text not null,
    label text not null,
    description text,
    type text default 'text' check (type in ('text', 'select', 'multiselect')),
    options jsonb default '[]'::jsonb,
    placeholder text,
    category text not null,
    order_index integer default 0,
    is_active boolean default true,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- RLS
alter table public.custom_variables enable row level security;

create policy "Users can view own variables"
    on public.custom_variables for select
    using (user_id = auth.uid());

create policy "Users can insert own variables"
    on public.custom_variables for insert
    with check (user_id = auth.uid());

create policy "Users can update own variables"
    on public.custom_variables for update
    using (user_id = auth.uid());

create policy "Users can delete own variables"
    on public.custom_variables for delete
    using (user_id = auth.uid());

-- ===========================================
-- ÍNDICES PARA PERFORMANCE
-- ===========================================
create index idx_prompts_workspace on public.prompts(workspace_id);
create index idx_prompts_category on public.prompts(category_id);
create index idx_prompts_user on public.prompts(user_id);
create index idx_categories_workspace on public.categories(workspace_id);
create index idx_categories_parent on public.categories(parent_id);
create index idx_custom_variables_user on public.custom_variables(user_id);

-- ===========================================
-- PRONTO! Agora configure o .env e faça deploy
-- ===========================================
