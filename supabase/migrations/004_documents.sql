-- ══════════════════════════════════════════════════════════════
-- Documents table
-- Hybrid storage: Supabase Storage uploads OR external links.
-- ══════════════════════════════════════════════════════════════

create type document_category as enum (
  'board_packet',
  'agenda',
  'minutes',
  'financial_report',
  'governance',
  'policy',
  'strategic_plan',
  'bylaw',
  'presentation',
  'other'
);

create type storage_type as enum ('supabase', 'external');

create table documents (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  description     text,
  category        document_category not null default 'other',
  storage_type    storage_type not null,

  -- Supabase Storage fields (used when storage_type = 'supabase')
  storage_path    text,                    -- path in Supabase Storage bucket
  file_size       bigint,                  -- bytes
  mime_type       text,                    -- e.g., 'application/pdf'

  -- External link fields (used when storage_type = 'external')
  external_url    text,                    -- Google Drive, Dropbox, etc.

  file_name       text,                    -- original filename for display
  uploaded_by     uuid references board_members(id),
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- Indexes
create index idx_documents_category on documents (category);
create index idx_documents_created on documents (created_at desc);

-- Auto-update `updated_at`
create trigger documents_updated_at
  before update on documents
  for each row
  execute function update_updated_at();

-- ══════════════════════════════════════════════════════════════
-- Meeting ↔ Document junction table (many-to-many)
-- A document can belong to multiple meetings;
-- a meeting can have multiple documents.
-- ══════════════════════════════════════════════════════════════

create table meeting_documents (
  meeting_id    uuid not null references meetings(id) on delete cascade,
  document_id   uuid not null references documents(id) on delete cascade,
  sort_order    smallint default 0,        -- display order within a meeting
  primary key (meeting_id, document_id)
);

create index idx_meeting_documents_doc on meeting_documents (document_id);

-- ══════════════════════════════════════════════════════════════
-- Row Level Security
-- ══════════════════════════════════════════════════════════════

alter table documents enable row level security;
alter table meeting_documents enable row level security;

create policy "Public read documents"
  on documents for select
  using (true);

create policy "Public read meeting_documents"
  on meeting_documents for select
  using (true);
