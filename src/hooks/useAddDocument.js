import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { createUpdate } from './useUpdates';

/**
 * Inserts a new external-link document into Supabase and optionally
 * links it to one or more meetings.
 *
 * Returns { addDocument, isSubmitting, error }.
 */
export function useAddDocument() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function addDocument({ title, category, externalUrl, fileName, description, meetingSlugs = [] }) {
    if (!supabase) {
      setError('Database connection unavailable.');
      return null;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Insert the document
      const { data: doc, error: insertErr } = await supabase
        .from('documents')
        .insert({
          title,
          description: description || null,
          category,
          storage_type: 'external',
          external_url: externalUrl,
          file_name: fileName || null,
        })
        .select()
        .single();

      if (insertErr) throw insertErr;

      // 2. Link to meetings if any slugs provided
      if (meetingSlugs.length > 0) {
        // Resolve slugs → UUIDs
        const { data: meetings, error: meetErr } = await supabase
          .from('meetings')
          .select('id, slug')
          .in('slug', meetingSlugs);

        if (meetErr) throw meetErr;

        if (meetings?.length > 0) {
          const links = meetings.map((m, i) => ({
            meeting_id: m.id,
            document_id: doc.id,
            sort_order: i,
          }));

          const { error: linkErr } = await supabase
            .from('meeting_documents')
            .insert(links);

          if (linkErr) throw linkErr;
        }
      }

      // 3. Auto-create an update entry
      await createUpdate({
        title: `New document added: ${title}`,
        summary: description || `A new ${category.replace(/_/g, ' ')} has been added to the document library.`,
        source: 'document',
      });

      return doc;
    } catch (err) {
      console.error('Failed to add document:', err.message);
      setError(err.message);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }

  return { addDocument, isSubmitting, error };
}
