create extension if not exists pgcrypto;
create table if not exists public.profiles (id uuid primary key references auth.users(id) on delete cascade, display_name text not null default 'New member', avatar_url text, created_at timestamptz not null default now());
create table if not exists public.conversations (id uuid primary key default gen_random_uuid(), title text not null, revision bigint not null default 0, created_at timestamptz not null default now());
create table if not exists public.conversation_members (conversation_id uuid not null references public.conversations(id) on delete cascade, user_id uuid not null references auth.users(id) on delete cascade, joined_at timestamptz not null default now(), primary key (conversation_id, user_id));
create table if not exists public.messages (id uuid primary key, conversation_id uuid not null references public.conversations(id) on delete cascade, sender_id uuid not null references auth.users(id), body text not null, kind text not null default 'text' check (kind in ('text', 'image', 'system')), conversation_revision bigint not null, created_at timestamptz not null default now(), edited_at timestamptz);
create table if not exists public.devices (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, platform text not null check (platform in ('ios', 'android')), push_token text not null, updated_at timestamptz not null default now(), unique (user_id, push_token));

create or replace function public.is_conversation_member(target_conversation uuid) returns boolean language sql stable security definer set search_path = public as $$ select exists (select 1 from public.conversation_members where conversation_id = target_conversation and user_id = auth.uid()); $$;
create or replace function public.send_message(message_id uuid, target_conversation uuid, message_body text, message_kind text default 'text') returns public.messages language plpgsql security definer set search_path = public as $$ declare next_revision bigint; result public.messages; begin if auth.uid() is null or not public.is_conversation_member(target_conversation) then raise exception 'not a conversation member'; end if; select * into result from public.messages where id = message_id; if found then return result; end if; update public.conversations set revision = revision + 1 where id = target_conversation returning revision into next_revision; if next_revision is null then raise exception 'conversation not found'; end if; insert into public.messages (id, conversation_id, sender_id, body, kind, conversation_revision) values (message_id, target_conversation, auth.uid(), message_body, message_kind, next_revision) returning * into result; return result; end; $$;

alter table public.profiles enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages enable row level security;
alter table public.devices enable row level security;
create policy "members can view conversations" on public.conversations for select to authenticated using (public.is_conversation_member(id));
create policy "members can view membership" on public.conversation_members for select to authenticated using (user_id = auth.uid() or public.is_conversation_member(conversation_id));
create policy "members can view messages" on public.messages for select to authenticated using (public.is_conversation_member(conversation_id));
create policy "users manage own profile" on public.profiles for all to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "users manage own devices" on public.devices for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
grant execute on function public.send_message(uuid, uuid, text, text) to authenticated;
alter publication supabase_realtime add table public.messages;
