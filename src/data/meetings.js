// Meeting helper functions used by pages and components.
// Actual meeting data is fetched from Supabase; seed data lives in
// supabase/migrations/005_seed_meetings.sql.

/** Upcoming meetings sorted by date (nearest first). Includes cancelled meetings. */
export function upcomingMeetings(list, fromDate = new Date().toISOString().slice(0, 10)) {
  return list
    .filter(m => m.meetingDate >= fromDate)
    .sort((a, b) => a.meetingDate.localeCompare(b.meetingDate));
}

/** Past meetings sorted by date (most recent first). Includes cancelled meetings. */
export function pastMeetings(list, fromDate = new Date().toISOString().slice(0, 10)) {
  return list
    .filter(m => m.meetingDate < fromDate)
    .sort((a, b) => b.meetingDate.localeCompare(a.meetingDate));
}

/** Format meeting time range for display. */
export function timeDisplay(meeting) {
  if (!meeting.startTime) return '';
  const fmt = (t) => {
    const [h, m] = t.split(':').map(Number);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return m === 0 ? `${hour} ${suffix}` : `${hour}:${String(m).padStart(2, '0')} ${suffix}`;
  };
  return meeting.endTime
    ? `${fmt(meeting.startTime)} – ${fmt(meeting.endTime)}`
    : fmt(meeting.startTime);
}

/** Human-readable meeting type label. */
export function typeLabel(meeting) {
  const labels = {
    full_board: 'Full Board',
    committee: meeting.committee || 'Committee',
    special: 'Special',
    social: 'Social',
  };
  return labels[meeting.meetingType] || meeting.meetingType;
}
