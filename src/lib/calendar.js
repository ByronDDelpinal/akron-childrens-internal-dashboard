/**
 * Generates a Google Calendar "Add Event" URL from meeting data.
 * No API required — uses Google's public URL scheme.
 *
 * @param {Object} meeting - Meeting object with camelCase fields
 * @returns {string} URL that opens Google Calendar with pre-filled event
 */
export function googleCalendarUrl(meeting) {
  const params = new URLSearchParams();

  params.set('action', 'TEMPLATE');
  params.set('text', meeting.title);

  // Build date/time strings in Google's format: YYYYMMDDTHHmmSS
  if (meeting.startTime && meeting.endTime) {
    const start = formatDateTime(meeting.meetingDate, meeting.startTime);
    const end = formatDateTime(meeting.meetingDate, meeting.endTime);
    params.set('dates', `${start}/${end}`);
  } else {
    // All-day event if no times specified
    const dateCompact = meeting.meetingDate.replace(/-/g, '');
    params.set('dates', `${dateCompact}/${dateCompact}`);
  }

  if (meeting.location) {
    params.set('location', meeting.location);
  }

  if (meeting.description) {
    params.set('details', meeting.description);
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Formats a date + time into Google Calendar's compact format.
 * Input:  "2026-06-01", "11:30"
 * Output: "20260601T113000"
 */
function formatDateTime(date, time) {
  const d = date.replace(/-/g, '');
  const t = time.replace(':', '') + '00';
  return `${d}T${t}`;
}
