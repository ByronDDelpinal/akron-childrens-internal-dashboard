-- ══════════════════════════════════════════════════════════════
-- Board Members table
-- Supports soft-delete via `status` for historical tracking.
-- ══════════════════════════════════════════════════════════════

create type member_status as enum ('active', 'emeritus', 'former');

create table board_members (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,  -- human-readable ID (e.g., 'angie-rogers')
  first_name    text not null,
  preferred_name text,
  last_name     text not null,
  title         text,                  -- Officer role: President, Vice President, etc.
  organization  text not null,
  phone         text,
  email         text,
  bio           text,
  photo_url     text,                  -- Supabase Storage path or external URL
  committees    text[] default '{}',   -- Array of committee names
  committee_roles jsonb default '{}',  -- { "Finance": "Chair", "Executive": "Lead" }
  term_start    date,
  term_end      date,                  -- null = lifetime trustee
  status        member_status default 'active',
  archived_at   timestamptz,           -- When status changed to 'former'
  archived_reason text,                -- Why they left (resigned, term ended, etc.)
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Index for common queries
create index idx_board_members_status on board_members (status);
create index idx_board_members_committees on board_members using gin (committees);

-- Auto-update `updated_at` on row changes
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger board_members_updated_at
  before update on board_members
  for each row
  execute function update_updated_at();

-- ══════════════════════════════════════════════════════════════
-- Row Level Security
-- The anon/publishable key can only READ active members.
-- Service role (Edge Functions, admin) can do everything.
-- ══════════════════════════════════════════════════════════════

alter table board_members enable row level security;

-- Anyone with the anon key can read active members
create policy "Public read active members"
  on board_members for select
  using (status = 'active');

-- Service role bypasses RLS automatically, so no insert/update/delete
-- policies needed for now. When you add admin auth, add policies here.
