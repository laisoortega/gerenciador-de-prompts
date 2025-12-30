-- ===========================================
-- SCHEMA: SYSTEM SETTINGS
-- Execute este SQL no Supabase SQL Editor
-- ===========================================

-- ===========================================
-- TABELA: system_settings
-- Configurações globais do sistema (apenas admins)
-- ===========================================
create table if not exists public.system_settings (
    id uuid default uuid_generate_v4() primary key,
    key text unique not null,
    value jsonb not null,
    description text,
    updated_by uuid references auth.users(id),
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- RLS
alter table public.system_settings enable row level security;

-- Todos podem ler as configurações (necessário para aplicar no frontend)
create policy "Anyone can view system settings"
    on public.system_settings for select
    using (true);

-- Apenas admins podem inserir/atualizar/deletar
-- Nota: Você precisa ter uma coluna 'role' na tabela profiles ou usar app_metadata
create policy "Only admins can insert system settings"
    on public.system_settings for insert
    with check (
        exists (
            select 1 from auth.users 
            where id = auth.uid() 
            and raw_app_meta_data->>'role' in ('admin', 'super_admin')
        )
    );

create policy "Only admins can update system settings"
    on public.system_settings for update
    using (
        exists (
            select 1 from auth.users 
            where id = auth.uid() 
            and raw_app_meta_data->>'role' in ('admin', 'super_admin')
        )
    );

create policy "Only admins can delete system settings"
    on public.system_settings for delete
    using (
        exists (
            select 1 from auth.users 
            where id = auth.uid() 
            and raw_app_meta_data->>'role' in ('admin', 'super_admin')
        )
    );

-- Índice para busca por key
create index if not exists idx_system_settings_key on public.system_settings(key);

-- ===========================================
-- INSERIR CONFIGURAÇÕES PADRÃO
-- ===========================================
insert into public.system_settings (key, value, description) values
    ('general', '{
        "maintenance_mode": false,
        "new_registrations": true,
        "email_verification": true
    }', 'Configurações gerais do sistema'),
    
    ('notifications', '{
        "email_notifications": true,
        "new_user_notifications": true,
        "payment_notifications": true
    }', 'Configurações de notificações'),
    
    ('plan_limits', '{
        "free_prompt_limit": 50,
        "pro_prompt_limit": 500,
        "max_variables_per_prompt": 20
    }', 'Limites de planos'),
    
    ('branding', '{
        "site_name": "PromptMaster",
        "support_email": "suporte@promptmaster.com"
    }', 'Configurações de branding')
on conflict (key) do nothing;

-- ===========================================
-- PRONTO! Execute e as configurações estarão ativas
-- ===========================================
