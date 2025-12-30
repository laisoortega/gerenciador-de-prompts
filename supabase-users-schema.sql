-- ===========================================
-- SCHEMA: USER PROFILES
-- Execute este SQL no Supabase SQL Editor
-- ===========================================

-- ===========================================
-- TABELA: user_profiles
-- Perfis de usuário expandidos para admin
-- ===========================================
create table if not exists public.user_profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    name text,
    avatar_url text,
    role text default 'user' check (role in ('user', 'admin', 'super_admin')),
    status text default 'active' check (status in ('active', 'inactive', 'banned')),
    plan_id uuid,
    plan_expires_at timestamptz,
    onboarding_completed boolean default false,
    preferences jsonb default '{}'::jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- RLS
alter table public.user_profiles enable row level security;

-- Usuários podem ver e editar seu próprio perfil
create policy "Users can view own profile"
    on public.user_profiles for select
    using (id = auth.uid());

create policy "Users can update own profile"
    on public.user_profiles for update
    using (id = auth.uid());

-- Admins podem ver e editar todos os perfis
create policy "Admins can view all profiles"
    on public.user_profiles for select
    using (
        exists (
            select 1 from public.user_profiles up
            where up.id = auth.uid() 
            and up.role in ('admin', 'super_admin')
        )
    );

create policy "Admins can update all profiles"
    on public.user_profiles for update
    using (
        exists (
            select 1 from public.user_profiles up
            where up.id = auth.uid() 
            and up.role in ('admin', 'super_admin')
        )
    );

create policy "Admins can insert profiles"
    on public.user_profiles for insert
    with check (
        -- Allow user to create their own profile
        id = auth.uid()
        or
        -- Allow admins to create profiles
        exists (
            select 1 from public.user_profiles up
            where up.id = auth.uid() 
            and up.role in ('admin', 'super_admin')
        )
    );

-- Índices
create index if not exists idx_user_profiles_role on public.user_profiles(role);
create index if not exists idx_user_profiles_status on public.user_profiles(status);

-- ===========================================
-- FUNÇÃO: Criar perfil automaticamente ao registrar
-- ===========================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.user_profiles (id, name, role, status)
    values (
        new.id,
        coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
        coalesce(new.raw_app_meta_data->>'role', 'user'),
        'active'
    );
    return new;
end;
$$ language plpgsql security definer;

-- Trigger para criar perfil ao registrar
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- ===========================================
-- VIEW: Usuários para admin (combina auth.users + profiles)
-- ===========================================
create or replace view public.admin_users_view as
select 
    au.id,
    au.email,
    au.created_at as joined_at,
    au.last_sign_in_at,
    coalesce(up.name, split_part(au.email, '@', 1)) as name,
    coalesce(up.role, 'user') as role,
    coalesce(up.status, 'active') as status,
    up.avatar_url,
    up.plan_id,
    up.onboarding_completed
from auth.users au
left join public.user_profiles up on au.id = up.id;

-- Permissão para admins verem a view
grant select on public.admin_users_view to authenticated;

-- ===========================================
-- CRIAR PERFIL PARA USUÁRIOS EXISTENTES
-- ===========================================
insert into public.user_profiles (id, name, role, status)
select 
    id,
    coalesce(raw_user_meta_data->>'name', split_part(email, '@', 1)),
    coalesce(raw_app_meta_data->>'role', 'user'),
    'active'
from auth.users
where id not in (select id from public.user_profiles)
on conflict (id) do nothing;

-- ===========================================
-- PRONTO! Execute e os perfis de usuário estarão ativos
-- ===========================================
