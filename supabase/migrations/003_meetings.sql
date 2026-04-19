-- ══════════════════════════════════════════════════════════════
-- Meetings table
-- Tracks full-board and committee meetings with details.
-- ══════════════════════════════════════════════════════════════

create type meeting_type as enum ('full_board', 'committee', 'special', 'social');

create table meetings (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,       -- human-readable ID (e.g., 'full-board-2026-02')
  title         text not null,
  meeting_type  meeting_type not null,
  meeting_date  date not null,
  start_time    time,                       -- e.g., '11:30:00'
  end_time      time,                       -- e.g., '13:00:00'
  location      text,
  description   text,
  committee     text,                       -- null for full-board, committee name otherwise
  is_cancelled  boolean default false,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Indexes
create index idx_meetings_date on meetings (meeting_date desc);
create index idx_meetings_type on meetings (meeting_type);

-- Auto-update `updated_at`
create trigger meetings_updated_at
  before update on meetings
  for each row
  execute function update_updated_at();

-- ══════════════════════════════════════════════════════════════
-- Row Level Security
-- Same pattern as board_members: anon key can read all meetings.
-- ══════════════════════════════════════════════════════════════

alter table meetings enable row level security;

create policy "Public read meetings"
  on meetings for select
  using (true);
