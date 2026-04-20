import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Fetches documents associated with a specific meeting.
 * Returns empty array when Supabase is unavailable (no local fallback for docs).
 */

function mapDoc(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    storageType: row.storage_type,
    storagePath: row.storage_path,
    fileSize: row.file_size,
    mimeType: row.mime_type,
    externalUrl: row.external_url,
    fileName: row.file_name,
    uploadedBy: row.uploaded_by,
    createdAt: row.created_at,
  };
}

export function useMeetingDocuments(meetingSlug) {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refetch = useCallback(() => setRefreshKey(k => k + 1), []);

  useEffect(() => {
    let cancelled = false;

    async function fetchDocuments() {
      if (!supabase || !meetingSlug) {
        setIsLoading(false);
        return;
      }

      try {
        // First get the meeting's UUID from its slug
        const { data: meeting, error: meetingError } = await supabase
          .from('meetings')
          .select('id')
          .eq('slug', meetingSlug)
          .single();

        if (meetingError) throw meetingError;

        // Then fetch associated documents via junction table
        const { data, error: docsError } = await supabase
          .from('meeting_documents')
          .select(`
            sort_order,
            documents (*)
          `)
          .eq('meeting_id', meeting.id)
          .order('sort_order');

        if (docsError) throw docsError;

        if (!cancelled) {
          const docs = (data || [])
            .map(row => ({ ...mapDoc(row.documents), sortOrder: row.sort_order }))
            .sort((a, b) => a.sortOrder - b.sortOrder);
          setDocuments(docs);
        }
      } catch (err) {
        console.warn('Failed to fetch meeting documents:', err.message);
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchDocuments();
    return () => { cancelled = true; };
  }, [meetingSlug, refreshKey]);

  return { documents, isLoading, error, refetch };
}

/**
 * Fetches ALL documents, optionally filtered by category.
 */
export function useDocuments(category = null) {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refetch = useCallback(() => setRefreshKey(k => k + 1), []);

  useEffect(() => {
    let cancelled = false;

    async function fetchDocuments() {
      if (!supabase) {
        setError('Database connection unavailable.');
        setIsLoading(false);
        return;
      }

      try {
        let query = supabase
          .from('documents')
          .select('*')
          .order('created_at', { ascending: false });

        if (category) {
          query = query.eq('category', category);
        }

        const { data, error: fetchError } = await query;
        if (fetchError) throw fetchError;

        if (!cancelled && data) {
          setDocuments(data.map(mapDoc));
        }
      } catch (err) {
        console.warn('Failed to fetch documents:', err.message);
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchDocuments();
    return () => { cancelled = true; };
  }, [category, refreshKey]);

  return { documents, isLoading, error, refetch };
}
