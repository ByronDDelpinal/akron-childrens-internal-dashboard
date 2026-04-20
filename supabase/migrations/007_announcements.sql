-- ══════════════════════════════════════════════════════════════
-- Announcements table
-- Board-wide announcements shown on the dashboard.
-- ══════════════════════════════════════════════════════════════

create type announcement_priority as enum ('normal', 'high');

create table announcements (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  summary     text not null,
  priority    announcement_priority default 'normal',
  posted_at   timestamptz default now(),
  expires_at  timestamptz,                -- null = never expires
  posted_by   uuid references board_members(id),
  is_archived boolean default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Index for dashboard query (recent, non-archived)
create index idx_announcements_posted on announcements (posted_at desc);
create index idx_announcements_active on announcements (is_archived, posted_at desc);

-- Auto-update `updated_at`
create trigger announcements_updated_at
  before update on announcements
  for each row
  execute function update_updated_at();

-- ══════════════════════════════════════════════════════════════
-- Row Level Security
-- ══════════════════════════════════════════════════════════════

alter table announcements enable row level security;

create policy "Public read announcements"
  on announcements for select
  using (true);

create policy "Anon insert announcements"
  on announcements for insert
  with check (true);

create policy "Anon update announcements"
  on announcements for update
  using (true);

create policy "Anon delete announcements"
  on announcements for delete
  using (true);
