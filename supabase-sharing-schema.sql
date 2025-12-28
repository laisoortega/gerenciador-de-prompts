-- ===========================================
-- SCHEMA: COMPARTILHAMENTO DE PROMPTS
-- Execute no Supabase SQL Editor
-- ===========================================

-- ===========================================
-- TABELA: prompt_shares
-- ===========================================
create table public.prompt_shares (
    id uuid default uuid_generate_v4() primary key,
    prompt_id uuid references public.prompts(id) on delete cascade not null,
    shared_by uuid references auth.users(id) on delete cascade not null,
    shared_with_email text not null,
    shared_with_user uuid references auth.users(id) on delete set null,
    permission text default 'view' check (permission in ('view', 'edit', 'full')),
    status text default 'pending' check (status in ('pending', 'active', 'declined', 'revoked')),
    message text,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    
    -- Evitar duplicatas: mesmo prompt não pode ser compartilhado duas vezes com mesmo email
    unique(prompt_id, shared_with_email)
);

-- ===========================================
-- RLS POLICIES
-- ===========================================
alter table public.prompt_shares enable row level security;

-- Dono do prompt pode ver todos os compartilhamentos dele
create policy "Owner can view prompt shares"
    on public.prompt_shares for select
    using (shared_by = auth.uid());

-- Destinatário pode ver compartilhamentos recebidos
create policy "Recipient can view received shares"
    on public.prompt_shares for select
    using (
        shared_with_user = auth.uid() 
        OR shared_with_email = (select email from auth.users where id = auth.uid())
    );

-- Dono do prompt pode criar compartilhamentos
create policy "Owner can create shares"
    on public.prompt_shares for insert
    with check (shared_by = auth.uid());

-- Dono pode atualizar (revogar)
create policy "Owner can update shares"
    on public.prompt_shares for update
    using (shared_by = auth.uid());

-- Destinatário pode atualizar (aceitar/recusar)
create policy "Recipient can update shares"
    on public.prompt_shares for update
    using (
        shared_with_user = auth.uid() 
        OR shared_with_email = (select email from auth.users where id = auth.uid())
    );

-- Dono pode deletar
create policy "Owner can delete shares"
    on public.prompt_shares for delete
    using (shared_by = auth.uid());

-- ===========================================
-- POLÍTICAS ADICIONAIS PARA PROMPTS
-- Permitir que usuários vejam prompts compartilhados com eles
-- ===========================================

-- Adicionar policy para ver prompts compartilhados
create policy "Users can view shared prompts"
    on public.prompts for select
    using (
        user_id = auth.uid() 
        OR id in (
            select prompt_id from public.prompt_shares 
            where status = 'active' 
            and (
                shared_with_user = auth.uid()
                OR shared_with_email = (select email from auth.users where id = auth.uid())
            )
        )
    );

-- Permitir edição se tiver permissão 'edit' ou 'full'
create policy "Users can edit shared prompts with permission"
    on public.prompts for update
    using (
        user_id = auth.uid() 
        OR id in (
            select prompt_id from public.prompt_shares 
            where status = 'active' 
            and permission in ('edit', 'full')
            and (
                shared_with_user = auth.uid()
                OR shared_with_email = (select email from auth.users where id = auth.uid())
            )
        )
    );

-- ===========================================
-- ÍNDICES
-- ===========================================
create index idx_prompt_shares_prompt on public.prompt_shares(prompt_id);
create index idx_prompt_shares_shared_by on public.prompt_shares(shared_by);
create index idx_prompt_shares_shared_with_user on public.prompt_shares(shared_with_user);
create index idx_prompt_shares_shared_with_email on public.prompt_shares(shared_with_email);
create index idx_prompt_shares_status on public.prompt_shares(status);

-- ===========================================
-- FUNÇÃO: Vincular email ao user_id quando usuário existe
-- ===========================================
create or replace function public.link_share_to_user()
returns trigger as $$
begin
    -- Procurar se já existe um usuário com esse email
    new.shared_with_user := (
        select id from auth.users where email = new.shared_with_email limit 1
    );
    return new;
end;
$$ language plpgsql security definer;

-- Trigger para vincular automaticamente
create trigger on_share_created
    before insert on public.prompt_shares
    for each row
    execute function public.link_share_to_user();

-- ===========================================
-- PRONTO! Agora as funções da API podem usar essa tabela
-- ===========================================
