-- ══════════════════════════════════════════════════════════════
-- Add Google Drive folder URL columns to meetings
--
-- When a meeting is created with Google Drive integration, these
-- columns store links to the Drive folders so the portal can
-- link directly to them from the meeting detail page.
-- ══════════════════════════════════════════════════════════════

alter table meetings
  add column drive_folder_url      text,   -- meeting-specific subfolder
  add column drive_parent_folder_url text, -- type-level folder (e.g. "Board Meetings")
  add column drive_root_folder_url   text; -- top-level "Board & Committee Meeting Materials"
