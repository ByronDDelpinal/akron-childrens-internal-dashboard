import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Fetches announcements from Supabase.
 * Only returns non-archived announcements that haven't expired.
 */

function mapRow(row) {
  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    priority: row.priority,
    date: row.posted_at?.slice(0, 10),
    postedBy: row.posted_by,
    expiresAt: row.expires_at,
    isArchived: row.is_archived,
  };
}

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refetch = useCallback(() => setRefreshKey(k => k + 1), []);

  useEffect(() => {
    let cancelled = false;

    async function fetchAnnouncements() {
      if (!supabase) {
        setError('Database connection unavailable.');
        setIsLoading(false);
        return;
      }

      try {
        const now = new Date().toISOString();

        const { data, error: fetchError } = await supabase
          .from('announcements')
          .select('*')
          .eq('is_archived', false)
          .or(`expires_at.is.null,expires_at.gt.${now}`)
          .order('posted_at', { ascending: false })
          .limit(5);

        if (fetchError) throw fetchError;

        if (!cancelled && data) {
          setAnnouncements(data.map(mapRow));
        }
      } catch (err) {
        if (import.meta.env.DEV) console.error('Failed to fetch announcements:', err.message);
        setError(err.message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchAnnouncements();
    return () => { cancelled = true; };
  }, [refreshKey]);

  return { announcements, isLoading, error, refetch };
}

/**
 * Inserts a new announcement into Supabase.
 */
export function useAddAnnouncement() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function addAnnouncement({ title, summary, priority = 'normal', expiresAt = null }) {
    if (!supabase) {
      setError('Database connection unavailable.');
      return null;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { data, error: insertErr } = await supabase
        .from('announcements')
        .insert({
          title,
          summary,
          priority,
          expires_at: expiresAt || null,
        })
        .select()
        .single();

      if (insertErr) throw insertErr;
      return data;
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to add announcement:', err.message);
      setError(err.message);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }

  return { addAnnouncement, isSubmitting, error };
}
