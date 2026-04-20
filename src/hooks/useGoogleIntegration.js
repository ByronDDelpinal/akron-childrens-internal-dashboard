import { useState } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Calls the google-drive Edge Function to create agenda and minutes
 * documents from templates in the correct Drive folder.
 *
 * For committee meetings, also replaces [Date] and [Committee] placeholders.
 * Returns document URLs, folder URLs, and Google Doc IDs.
 */
export function useCreateMeetingDocs() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);

  async function createDocs({ meetingTitle, meetingDate, meetingType, committee }) {
    if (!supabase) {
      setError('Database connection unavailable.');
      return null;
    }

    setIsCreating(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('google-drive', {
        body: { meetingTitle, meetingDate, meetingType, committee },
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);

      // {
      //   folderUrl, folderId, parentFolderUrl, rootFolderUrl,
      //   agendaUrl, agendaId, minutesUrl, minutesId
      // }
      return data;
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to create meeting docs:', err.message);
      setError(err.message);
      return null;
    } finally {
      setIsCreating(false);
    }
  }

  return { createDocs, isCreating, error };
}

/**
 * Calls the google-calendar Edge Function to create a calendar event
 * and send invites to all board members.
 */
export function useCreateCalendarEvent() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);

  async function createEvent({ title, date, startTime, endTime, location, description, attendeeEmails }) {
    if (!supabase) {
      setError('Database connection unavailable.');
      return null;
    }

    setIsCreating(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('google-calendar', {
        body: { title, date, startTime, endTime, location, description, attendeeEmails },
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);

      return data; // { eventId, eventUrl }
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to create calendar event:', err.message);
      setError(err.message);
      return null;
    } finally {
      setIsCreating(false);
    }
  }

  return { createEvent, isCreating, error };
}
