import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { createUpdate } from './useUpdates';

/**
 * Fetches meetings from Supabase.
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
    driveFolderUrl: row.drive_folder_url,
    driveParentFolderUrl: row.drive_parent_folder_url,
    driveRootFolderUrl: row.drive_root_folder_url,
  };
}

export function useMeetings() {
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refetch = useCallback(() => setRefreshKey(k => k + 1), []);

  useEffect(() => {
    let cancelled = false;

    async function fetchMeetings() {
      if (!supabase) {
        setError('Database connection unavailable.');
        setIsLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('meetings')
          .select('*')
          .order('meeting_date', { ascending: true });

        if (fetchError) throw fetchError;

        if (!cancelled && data) {
          setMeetings(data.map(mapRow));
        }
      } catch (err) {
        if (import.meta.env.DEV) console.error('Failed to fetch meetings:', err.message);
        setError(err.message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchMeetings();
    return () => { cancelled = true; };
  }, [refreshKey]);

  return { meetings, isLoading, error, refetch };
}

/**
 * Generates a URL-friendly slug from meeting type, date, and optional committee.
 * Includes the full date + a short random suffix to avoid collisions.
 * e.g., "full-board-2026-04-20-a3f", "committee-finance-2026-05-15-b7c"
 */
function generateSlug(meetingType, meetingDate, committee) {
  const suffix = Math.random().toString(36).slice(2, 5); // 3-char random
  if (meetingType === 'committee' && committee) {
    const committeePart = committee.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return `committee-${committeePart}-${meetingDate}-${suffix}`;
  }
  const typePart = meetingType.replace(/_/g, '-');
  return `${typePart}-${meetingDate}-${suffix}`;
}

/**
 * Inserts a new meeting into Supabase and auto-creates an update.
 */
export function useAddMeeting() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function addMeeting({ title, meetingType, meetingDate, startTime, endTime, location, description, committee, createAgenda = false }) {
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

      // Auto-create placeholder agenda document if requested
      if (createAgenda) {
        try {
          const agendaTitle = `Agenda — ${title} (${meetingDate})`;

          const { data: agendaDoc, error: agendaErr } = await supabase
            .from('documents')
            .insert({
              title: agendaTitle,
              description: `Placeholder agenda for ${title}. Replace with a link to the final agenda when ready.`,
              category: 'agenda',
              storage_type: 'external',
              external_url: null,
            })
            .select()
            .single();

          if (agendaErr) throw agendaErr;

          // Create placeholder minutes document
          const minutesTitle = `Minutes — ${title} (${meetingDate})`;

          const { data: minutesDoc, error: minutesErr } = await supabase
            .from('documents')
            .insert({
              title: minutesTitle,
              description: `Placeholder minutes for ${title}. Replace with a link to the approved minutes when ready.`,
              category: 'minutes',
              storage_type: 'external',
              external_url: null,
            })
            .select()
            .single();

          if (minutesErr) throw minutesErr;

          // Link both documents to this meeting
          await supabase
            .from('meeting_documents')
            .insert([
              { meeting_id: data.id, document_id: agendaDoc.id, sort_order: 0 },
              { meeting_id: data.id, document_id: minutesDoc.id, sort_order: 1 },
            ]);
        } catch (placeholderErr) {
          // Non-critical — log but don't fail the meeting creation
          if (import.meta.env.DEV) console.warn('Auto-placeholder creation failed:', placeholderErr.message);
        }
      }

      // Auto-create update entry
      await createUpdate({
        title: `New meeting scheduled: ${title}`,
        summary: `${title} scheduled for ${meetingDate}${location ? ` at ${location}` : ''}.`,
        source: 'meeting',
      });

      return data;
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to add meeting:', err.message);
      setError(err.message);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }

  return { addMeeting, isSubmitting, error };
}

/**
 * Updates an existing meeting in Supabase by slug.
 * Only sends changed fields to avoid unnecessary writes.
 */
export function useUpdateMeeting() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function updateMeeting(slug, fields) {
    if (!supabase) {
      setError('Database connection unavailable.');
      return false;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {};

      if (fields.title !== undefined) payload.title = fields.title;
      if (fields.meetingDate !== undefined) payload.meeting_date = fields.meetingDate;
      if (fields.startTime !== undefined) payload.start_time = fields.startTime || null;
      if (fields.endTime !== undefined) payload.end_time = fields.endTime || null;
      if (fields.location !== undefined) payload.location = fields.location || null;
      if (fields.description !== undefined) payload.description = fields.description || null;
      if (fields.isCancelled !== undefined) payload.is_cancelled = fields.isCancelled;

      const { error: updateErr } = await supabase
        .from('meetings')
        .update(payload)
        .eq('slug', slug);

      if (updateErr) throw updateErr;

      // Auto-create update entry
      const action = fields.isCancelled ? 'cancelled' : 'updated';
      await createUpdate({
        title: `Meeting ${action}: ${fields.title || slug}`,
        summary: fields.isCancelled
          ? `${fields.title || slug} has been cancelled.`
          : `${fields.title || slug} details have been updated.`,
        source: 'meeting',
      });

      return true;
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to update meeting:', err.message);
      setError(err.message);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  return { updateMeeting, isSubmitting, error };
}
