-- ===========================================
-- SCHEMA: PLANS & SUBSCRIPTIONS
-- Execute este SQL no Supabase SQL Editor
-- ===========================================

-- ===========================================
-- TABELA: plans
-- Definição de planos de assinatura
-- ===========================================
create table if not exists public.plans (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    slug text unique not null,
    description text,
    price_monthly numeric(10,2) default 0,
    price_yearly numeric(10,2) default 0,
    max_prompts integer default 50,
    max_workspaces integer default 1,
    max_variables integer default 20,
    features jsonb default '[]'::jsonb,
    is_active boolean default true,
    is_featured boolean default false,
    sort_order integer default 0,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- RLS
alter table public.plans enable row level security;

-- Todos podem ver planos ativos (para página de pricing)
create policy "Anyone can view active plans"
    on public.plans for select
    using (is_active = true);

-- Admins podem ver todos os planos (incluindo inativos)
create policy "Admins can view all plans"
    on public.plans for select
    using (
        exists (
            select 1 from public.user_profiles up
            where up.id = auth.uid() 
            and up.role in ('admin', 'super_admin')
        )
    );

-- Admins podem criar/editar/deletar planos
create policy "Admins can insert plans"
    on public.plans for insert
    with check (
        exists (
            select 1 from public.user_profiles up
            where up.id = auth.uid() 
            and up.role in ('admin', 'super_admin')
        )
    );

create policy "Admins can update plans"
    on public.plans for update
    using (
        exists (
            select 1 from public.user_profiles up
            where up.id = auth.uid() 
            and up.role in ('admin', 'super_admin')
        )
    );

create policy "Admins can delete plans"
    on public.plans for delete
    using (
        exists (
            select 1 from public.user_profiles up
            where up.id = auth.uid() 
            and up.role in ('admin', 'super_admin')
        )
    );

-- ===========================================
-- TABELA: subscriptions
-- Assinaturas dos usuários
-- ===========================================
create table if not exists public.subscriptions (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    plan_id uuid references public.plans(id) on delete set null,
    status text default 'active' check (status in ('active', 'canceled', 'expired', 'past_due')),
    payment_provider text, -- 'stripe', 'mercadopago', etc
    payment_provider_id text, -- ID externo do pagamento
    current_period_start timestamptz,
    current_period_end timestamptz,
    canceled_at timestamptz,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- RLS
alter table public.subscriptions enable row level security;

-- Usuários podem ver sua própria assinatura
create policy "Users can view own subscription"
    on public.subscriptions for select
    using (user_id = auth.uid());

-- Admins podem ver todas as assinaturas
create policy "Admins can view all subscriptions"
    on public.subscriptions for select
    using (
        exists (
            select 1 from public.user_profiles up
            where up.id = auth.uid() 
            and up.role in ('admin', 'super_admin')
        )
    );

-- Admins podem criar/editar assinaturas
create policy "Admins can manage subscriptions"
    on public.subscriptions for all
    using (
        exists (
            select 1 from public.user_profiles up
            where up.id = auth.uid() 
            and up.role in ('admin', 'super_admin')
        )
    );

-- Índices
create index if not exists idx_plans_slug on public.plans(slug);
create index if not exists idx_plans_active on public.plans(is_active);
create index if not exists idx_subscriptions_user on public.subscriptions(user_id);
create index if not exists idx_subscriptions_status on public.subscriptions(status);

-- ===========================================
-- INSERIR PLANOS PADRÃO
-- ===========================================
insert into public.plans (name, slug, description, price_monthly, price_yearly, max_prompts, max_workspaces, max_variables, features, is_active, is_featured, sort_order) values
    ('Free', 'free', 'Para começar a organizar seus prompts', 0, 0, 50, 1, 10,
     '["50 prompts", "1 workspace", "Variáveis básicas", "Exportar prompts"]'::jsonb,
     true, false, 1),
    
    ('Pro', 'pro', 'Para profissionais e criadores de conteúdo', 29, 290, 500, 5, 50,
     '["500 prompts", "5 workspaces", "Variáveis ilimitadas", "Compartilhamento", "Análise de vídeo", "Suporte prioritário"]'::jsonb,
     true, true, 2),
    
    ('Enterprise', 'enterprise', 'Para equipes e empresas', 99, 990, -1, -1, -1,
     '["Prompts ilimitados", "Workspaces ilimitados", "Variáveis ilimitadas", "Compartilhamento em equipe", "API de integração", "Suporte dedicado", "SSO/SAML"]'::jsonb,
     true, false, 3)
on conflict (slug) do update set
    name = excluded.name,
    description = excluded.description,
    price_monthly = excluded.price_monthly,
    price_yearly = excluded.price_yearly,
    max_prompts = excluded.max_prompts,
    max_workspaces = excluded.max_workspaces,
    features = excluded.features,
    updated_at = now();

-- ===========================================
-- ATUALIZAR REFERÊNCIA DE PLANO NO PROFILE
-- ===========================================
alter table public.user_profiles 
    add constraint fk_user_profiles_plan 
    foreign key (plan_id) references public.plans(id) on delete set null;

-- Atribuir plano free para usuários sem plano
update public.user_profiles 
set plan_id = (select id from public.plans where slug = 'free' limit 1)
where plan_id is null;

-- ===========================================
-- PRONTO! Execute e os planos estarão ativos
-- ===========================================
