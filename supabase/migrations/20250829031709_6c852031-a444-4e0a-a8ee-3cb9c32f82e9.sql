-- Create table for group prayer cards
create table public.prayer_cards (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  current_count integer not null default 0 check (current_count >= 0),
  target_count integer not null default 1 check (target_count > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.prayer_cards enable row level security;

-- Timestamp trigger
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_prayer_cards_updated_at
before update on public.prayer_cards
for each row execute function public.update_updated_at_column();

-- Public (anon) access policies for collaborative tracker
create policy "Public can read prayer cards"
  on public.prayer_cards for select
  to anon using (true);

create policy "Public can insert prayer cards"
  on public.prayer_cards for insert
  to anon with check (true);

create policy "Public can update prayer cards"
  on public.prayer_cards for update
  to anon using (true);

create policy "Public can delete prayer cards"
  on public.prayer_cards for delete
  to anon using (true);

-- Realtime support (optional but harmless)
alter table public.prayer_cards replica identity full;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'prayer_cards'
  ) then
    execute 'alter publication supabase_realtime add table public.prayer_cards';
  end if;
end$$;