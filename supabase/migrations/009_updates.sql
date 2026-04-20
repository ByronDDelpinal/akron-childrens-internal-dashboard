-- ══════════════════════════════════════════════════════════════
-- Updates table
-- Auto-generated activity feed entries triggered by system actions
-- (document uploads/deletions, proposal submissions/status changes, etc.)
-- Manual announcements stay in the announcements table.
-- ══════════════════════════════════════════════════════════════

create type update_source as enum ('document', 'proposal', 'meeting', 'system');

create table updates (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  summary     text not null,
  source      update_source not null default 'system',
  created_at  timestamptz default now()
);

-- Index for feed queries
create index idx_updates_created on updates (created_at desc);

-- ══════════════════════════════════════════════════════════════
-- Row Level Security
-- ══════════════════════════════════════════════════════════════

alter table updates enable row level security;

create policy "Public read updates"
  on updates for select
  using (true);

create policy "Anon insert updates"
  on updates for insert
  with check (true);
