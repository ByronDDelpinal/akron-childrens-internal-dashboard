-- ══════════════════════════════════════════════════════════════
-- Write policies for documents and meeting_documents
-- The app is password-gated at the application layer, so the
-- anon role is safe to grant INSERT/UPDATE/DELETE here.
-- ══════════════════════════════════════════════════════════════

-- Documents: anon can insert, update, and delete
create policy "Anon insert documents"
  on documents for insert
  with check (true);

create policy "Anon update documents"
  on documents for update
  using (true);

create policy "Anon delete documents"
  on documents for delete
  using (true);

-- Meeting-document links: anon can insert and delete
create policy "Anon insert meeting_documents"
  on meeting_documents for insert
  with check (true);

create policy "Anon delete meeting_documents"
  on meeting_documents for delete
  using (true);
