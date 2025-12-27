-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES
-- Links to Supabase Auth (auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  name text,
  avatar_url text,
  plan_id text default 'free',
  role text default 'user',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- WORKSPACES
create table workspaces (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  slug text not null,
  description text,
  icon text,
  color text default '#3b82f6',
  is_default boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- CATEGORIES
create table categories (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  workspace_id uuid references workspaces(id) on delete cascade,
  parent_id uuid references categories(id) on delete set null,
  name text not null,
  slug text not null,
  description text,
  icon text default '📁',
  color text default '#3b82f6',
  order_index integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- PROMPTS
create table prompts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  workspace_id uuid references workspaces(id) on delete cascade,
  category_id uuid references categories(id) on delete set null,
  title text not null,
  description text,
  content text not null, -- The prompt template
  variables jsonb default '[]'::jsonb, -- Array of variable objects
  tags text[] default array[]::text[],
  recommended_ai text,
  is_favorite boolean default false,
  is_public boolean default false,
  is_template boolean default false,
  copy_count integer default 0,
  order_index integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- RLS (Row Level Security) POLICIES

alter table profiles enable row level security;
alter table workspaces enable row level security;
alter table categories enable row level security;
alter table prompts enable row level security;

-- Profiles: Users can read/update their own profile
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Workspaces: Users can view/edit workspaces they own
create policy "Users can CRUD own workspaces" on workspaces for all using (auth.uid() = owner_id);

-- Categories: Users can CRUD categories in their workspaces (or owned by them)
create policy "Users can CRUD own categories" on categories for all using (auth.uid() = user_id);

-- Prompts: Users can CRUD own prompts
create policy "Users can CRUD own prompts" on prompts for all using (auth.uid() = user_id);

-- TRIGGERS for Updated At
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language 'plpgsql';

create trigger update_profiles_updated_at before update on profiles for each row execute procedure update_updated_at_column();
create trigger update_workspaces_updated_at before update on workspaces for each row execute procedure update_updated_at_column();
create trigger update_categories_updated_at before update on categories for each row execute procedure update_updated_at_column();
create trigger update_prompts_updated_at before update on prompts for each row execute procedure update_updated_at_column();
