-- ══════════════════════════════════════════════════════════════
-- Proposals table
-- Board action proposals submitted by members, committees, or staff.
-- The full proposal lives in a Google Doc; this table tracks metadata.
-- ══════════════════════════════════════════════════════════════

create type proposal_status as enum ('draft', 'submitted', 'approved', 'denied');

create table proposals (
  id                uuid primary key default gen_random_uuid(),
  title             text not null,
  description       text not null,
  submitter         text not null,          -- person, group, or committee name
  proposal_link     text,                   -- Google Docs URL
  time_sensitive    boolean default false,
  board_vote        boolean default false,  -- whether a board vote is required
  status            proposal_status default 'submitted',
  submitted_at      timestamptz default now(),
  resolved_at       timestamptz,            -- when approved or denied
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

-- Indexes
create index idx_proposals_status on proposals (status);
create index idx_proposals_submitted on proposals (submitted_at desc);

-- Auto-update `updated_at`
create trigger proposals_updated_at
  before update on proposals
  for each row
  execute function update_updated_at();

-- ══════════════════════════════════════════════════════════════
-- Row Level Security
-- ══════════════════════════════════════════════════════════════

alter table proposals enable row level security;

create policy "Public read proposals"
  on proposals for select
  using (true);

create policy "Anon insert proposals"
  on proposals for insert
  with check (true);

create policy "Anon update proposals"
  on proposals for update
  using (true);

create policy "Anon delete proposals"
  on proposals for delete
  using (true);
