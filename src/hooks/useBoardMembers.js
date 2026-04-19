import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import localBoardMembers from '../data/boardMembers';

/**
 * Fetches board members from Supabase.
 * Falls back to local JSON if Supabase is unavailable or the table doesn't exist yet.
 *
 * Maps snake_case DB columns → camelCase JS properties so the rest of the app
 * doesn't need to know where the data came from.
 */

function mapRow(row) {
  return {
    id: row.slug,
    dbId: row.id,
    firstName: row.first_name,
    preferredName: row.preferred_name,
    lastName: row.last_name,
    title: row.title,
    organization: row.organization,
    phone: row.phone,
    email: row.email,
    bio: row.bio,
    photoUrl: row.photo_url,
    committees: row.committees || [],
    committeeRoles: row.committee_roles || {},
    termStart: row.term_start?.slice(0, 7),  // "2025-04-01" → "2025-04"
    termEnd: row.term_end?.slice(0, 7) || null,
    status: row.status,
  };
}

export function useBoardMembers() {
  const [members, setMembers] = useState(localBoardMembers);
  const [source, setSource] = useState('local');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchMembers() {
      if (!supabase) {
        setSource('local');
        setIsLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('board_members')
          .select('*')
          .order('last_name');

        if (fetchError) throw fetchError;

        if (!cancelled && data?.length > 0) {
          setMembers(data.map(mapRow));
          setSource('supabase');
        }
      } catch (err) {
        console.warn('Supabase fetch failed, using local data:', err.message);
        setError(err.message);
        // Keep local data as fallback — no state change needed
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchMembers();
    return () => { cancelled = true; };
  }, []);

  return { members, source, isLoading, error };
}
