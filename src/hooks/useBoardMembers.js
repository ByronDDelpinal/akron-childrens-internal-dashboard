import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Fetches board members from Supabase.
 * Maps snake_case DB columns → camelCase JS properties.
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
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchMembers() {
      if (!supabase) {
        setError('Database connection unavailable.');
        setIsLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('board_members')
          .select('*')
          .order('last_name');

        if (fetchError) throw fetchError;

        if (!cancelled && data) {
          setMembers(data.map(mapRow));
        }
      } catch (err) {
        if (import.meta.env.DEV) console.error('Failed to fetch board members:', err.message);
        setError(err.message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchMembers();
    return () => { cancelled = true; };
  }, []);

  return { members, isLoading, error };
}
