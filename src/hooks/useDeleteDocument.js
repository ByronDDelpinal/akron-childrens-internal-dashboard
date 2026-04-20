import { useState } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Deletes a document from Supabase and creates a low-priority announcement.
 * The meeting_documents junction rows cascade-delete automatically.
 */
export function useDeleteDocument() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  async function deleteDocument(doc) {
    if (!supabase) {
      setError('Database connection unavailable.');
      return false;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const { error: delErr } = await supabase
        .from('documents')
        .delete()
        .eq('id', doc.id);

      if (delErr) throw delErr;

      // Auto-create announcement
      await supabase
        .from('announcements')
        .insert({
          title: `Document removed: ${doc.title}`,
          summary: `The ${(doc.category || 'document').replace(/_/g, ' ')} "${doc.title}" has been removed from the library.`,
          priority: 'normal',
        })
        .then(({ error: annErr }) => {
          if (annErr) console.warn('Auto-announcement failed:', annErr.message);
        });

      return true;
    } catch (err) {
      console.error('Failed to delete document:', err.message);
      setError(err.message);
      return false;
    } finally {
      setIsDeleting(false);
    }
  }

  return { deleteDocument, isDeleting, error };
}
