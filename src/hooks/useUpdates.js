import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Maps a Supabase row (snake_case) → camelCase JS object.
 */
function mapRow(row) {
  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    source: row.source,
    date: row.created_at?.slice(0, 10),
    createdAt: row.created_at,
  };
}

/**
 * Fetches auto-generated updates from Supabase.
 * Returns the most recent entries, ordered newest-first.
 */
export function useUpdates(limit = 10) {
  const [updates, setUpdates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refetch = useCallback(() => setRefreshKey(k => k + 1), []);

  useEffect(() => {
    let cancelled = false;

    async function fetchUpdates() {
      if (!supabase) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('updates')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit);

        if (fetchError) throw fetchError;

        if (!cancelled && data) {
          setUpdates(data.map(mapRow));
        }
      } catch (err) {
        if (import.meta.env.DEV) console.warn('Supabase updates fetch failed:', err.message);
        setError(err.message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchUpdates();
    return () => { cancelled = true; };
  }, [refreshKey, limit]);

  return { updates, isLoading, error, refetch };
}

/**
 * Helper to insert an auto-generated update.
 * Used internally by other hooks (documents, proposals, etc.)
 * Fails silently — updates are non-critical.
 */
export async function createUpdate({ title, summary, source = 'system' }) {
  if (!supabase) return;

  const { error } = await supabase
    .from('updates')
    .insert({ title, summary, source });

  if (error) {
    if (import.meta.env.DEV) console.warn('Auto-update insert failed:', error.message);
  }
}
