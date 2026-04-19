import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import localMeetings from '../data/meetings';

/**
 * Fetches meetings from Supabase.
 * Falls back to local data if Supabase is unavailable.
 *
 * Maps snake_case DB columns → camelCase JS properties.
 */

function mapRow(row) {
  return {
    id: row.slug,
    dbId: row.id,
    title: row.title,
    meetingType: row.meeting_type,
    meetingDate: row.meeting_date,
    startTime: row.start_time?.slice(0, 5),  // "11:30:00" → "11:30"
    endTime: row.end_time?.slice(0, 5),
    location: row.location,
    description: row.description,
    committee: row.committee,
    isCancelled: row.is_cancelled,
  };
}

export function useMeetings() {
  const [meetings, setMeetings] = useState(localMeetings);
  const [source, setSource] = useState('local');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchMeetings() {
      if (!supabase) {
        setSource('local');
        setIsLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('meetings')
          .select('*')
          .order('meeting_date', { ascending: true });

        if (fetchError) throw fetchError;

        if (!cancelled && data?.length > 0) {
          setMeetings(data.map(mapRow));
          setSource('supabase');
        }
      } catch (err) {
        console.warn('Supabase meetings fetch failed, using local data:', err.message);
        setError(err.message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchMeetings();
    return () => { cancelled = true; };
  }, []);

  return { meetings, source, isLoading, error };
}
