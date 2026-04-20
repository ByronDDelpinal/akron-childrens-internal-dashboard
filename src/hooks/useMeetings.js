import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { createUpdate } from './useUpdates';
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
  const [refreshKey, setRefreshKey] = useState(0);

  const refetch = useCallback(() => setRefreshKey(k => k + 1), []);

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
  }, [refreshKey]);

  return { meetings, source, isLoading, error, refetch };
}

/**
 * Generates a URL-friendly slug from meeting type, date, and optional committee.
 * e.g., "full-board-2026-04", "committee-finance-2026-05"
 */
function generateSlug(meetingType, meetingDate, committee) {
  const datePart = meetingDate.slice(0, 7).replace('-', '-'); // "2026-04"
  if (meetingType === 'committee' && committee) {
    const committeePart = committee.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return `committee-${committeePart}-${datePart}`;
  }
  const typePart = meetingType.replace(/_/g, '-');
  return `${typePart}-${datePart}`;
}

/**
 * Inserts a new meeting into Supabase and auto-creates an update.
 */
export function useAddMeeting() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function addMeeting({ title, meetingType, meetingDate, startTime, endTime, location, description, committee }) {
    if (!supabase) {
      setError('Database connection unavailable.');
      return null;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const slug = generateSlug(meetingType, meetingDate, committee);

      const { data, error: insertErr } = await supabase
        .from('meetings')
        .insert({
          slug,
          title,
          meeting_type: meetingType,
          meeting_date: meetingDate,
          start_time: startTime || null,
          end_time: endTime || null,
          location: location || null,
          description: description || null,
          committee: committee || null,
        })
        .select()
        .single();

      if (insertErr) throw insertErr;

      // Auto-create update entry
      await createUpdate({
        title: `New meeting scheduled: ${title}`,
        summary: `${title} scheduled for ${meetingDate}${location ? ` at ${location}` : ''}.`,
        source: 'meeting',
      });

      return data;
    } catch (err) {
      console.error('Failed to add meeting:', err.message);
      setError(err.message);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }

  return { addMeeting, isSubmitting, error };
}
