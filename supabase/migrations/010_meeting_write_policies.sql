-- ══════════════════════════════════════════════════════════════
-- Write policies for meetings table
-- Allows the anon role to insert, update, and delete meetings.
-- ══════════════════════════════════════════════════════════════

create policy "Anon insert meetings"
  on meetings for insert
  with check (true);

create policy "Anon update meetings"
  on meetings for update
  using (true);

create policy "Anon delete meetings"
  on meetings for delete
  using (true);
