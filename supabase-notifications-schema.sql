-- ===========================================
-- SCHEMA: NOTIFICATIONS
-- Execute este SQL no Supabase SQL Editor
-- ===========================================

-- ===========================================
-- TABELA: notifications
-- Sistema de notificações para usuários
-- ===========================================
create table if not exists public.notifications (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    type text not null check (type in ('share', 'system', 'subscription', 'info', 'success', 'warning')),
    title text not null,
    description text,
    link text, -- URL para redirecionar ao clicar
    metadata jsonb default '{}'::jsonb, -- dados extras (ex: prompt_id, share_id)
    read boolean default false,
    created_at timestamptz default now()
);

-- RLS
alter table public.notifications enable row level security;

-- Usuários podem ver suas próprias notificações
create policy "Users can view own notifications"
    on public.notifications for select
    using (user_id = auth.uid());

-- Usuários podem atualizar suas próprias notificações (marcar como lida)
create policy "Users can update own notifications"
    on public.notifications for update
    using (user_id = auth.uid());

-- Usuários podem deletar suas próprias notificações
create policy "Users can delete own notifications"
    on public.notifications for delete
    using (user_id = auth.uid());

-- Sistema/Admins podem criar notificações para qualquer usuário
create policy "System can insert notifications"
    on public.notifications for insert
    with check (
        -- Próprio usuário pode criar para si
        user_id = auth.uid()
        or
        -- Admins podem criar para qualquer um
        exists (
            select 1 from public.user_profiles up
            where up.id = auth.uid() 
            and up.role in ('admin', 'super_admin')
        )
    );

-- Índices
create index if not exists idx_notifications_user on public.notifications(user_id);
create index if not exists idx_notifications_read on public.notifications(read);
create index if not exists idx_notifications_created on public.notifications(created_at desc);

-- ===========================================
-- FUNÇÃO: Criar notificação de compartilhamento
-- Chamada automaticamente quando alguém compartilha um prompt
-- ===========================================
create or replace function public.notify_on_share()
returns trigger as $$
declare
    recipient_user_id uuid;
    prompt_title text;
    sharer_name text;
begin
    -- Buscar usuário pelo email
    select id into recipient_user_id
    from auth.users
    where email = lower(new.shared_with_email);

    -- Buscar título do prompt
    select title into prompt_title
    from public.prompts
    where id = new.prompt_id;

    -- Buscar nome de quem compartilhou
    select coalesce(name, split_part(email, '@', 1)) into sharer_name
    from public.user_profiles up
    join auth.users au on au.id = up.id
    where up.id = new.shared_by;

    -- Se encontrou o usuário, criar notificação
    if recipient_user_id is not null then
        insert into public.notifications (user_id, type, title, description, metadata)
        values (
            recipient_user_id,
            'share',
            coalesce(sharer_name, 'Alguém') || ' compartilhou um prompt com você',
            'Prompt: ' || coalesce(prompt_title, 'Sem título'),
            jsonb_build_object('prompt_id', new.prompt_id, 'share_id', new.id)
        );
    end if;

    return new;
end;
$$ language plpgsql security definer;

-- Trigger para notificar ao compartilhar
drop trigger if exists on_prompt_shared on public.prompt_shares;
create trigger on_prompt_shared
    after insert on public.prompt_shares
    for each row execute procedure public.notify_on_share();

-- ===========================================
-- FUNÇÃO: Criar notificação de boas-vindas
-- Chamada automaticamente quando novo usuário se registra
-- ===========================================
create or replace function public.notify_welcome()
returns trigger as $$
begin
    -- Criar notificação de boas-vindas
    insert into public.notifications (user_id, type, title, description)
    values (
        new.id,
        'info',
        'Bem-vindo ao PromptMaster! 🎉',
        'Complete seu perfil e comece a organizar seus prompts de IA.'
    );

    return new;
end;
$$ language plpgsql security definer;

-- Trigger para notificar novos usuários (na criação do perfil)
drop trigger if exists on_profile_created on public.user_profiles;
create trigger on_profile_created
    after insert on public.user_profiles
    for each row execute procedure public.notify_welcome();

-- ===========================================
-- PRONTO! Execute e as notificações estarão ativas
-- ===========================================
