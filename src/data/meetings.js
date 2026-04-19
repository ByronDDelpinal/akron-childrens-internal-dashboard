// Local meetings data — mirrors the seed SQL for offline fallback.
// Only includes upcoming/recent meetings to keep the bundle small.

const meetings = [
  // Full Board Meetings
  {
    id: 'full-board-2026-04',
    title: 'Full Board Meeting',
    meetingType: 'full_board',
    meetingDate: '2026-04-06',
    startTime: '11:30',
    endTime: '13:00',
    location: "Akron Children's Museum – Community Room",
    committee: null,
    isCancelled: false,
  },
  {
    id: 'full-board-2026-06',
    title: 'Full Board Meeting',
    meetingType: 'full_board',
    meetingDate: '2026-06-01',
    startTime: '11:30',
    endTime: '13:00',
    location: "Akron Children's Museum – Community Room",
    committee: null,
    isCancelled: false,
  },
  {
    id: 'full-board-2026-08',
    title: 'Full Board Meeting',
    meetingType: 'full_board',
    meetingDate: '2026-08-03',
    startTime: '11:30',
    endTime: '13:00',
    location: "Akron Children's Museum – Community Room",
    committee: null,
    isCancelled: false,
  },
  {
    id: 'full-board-2026-10',
    title: 'Full Board Meeting',
    meetingType: 'full_board',
    meetingDate: '2026-10-05',
    startTime: '11:30',
    endTime: '13:00',
    location: "Akron Children's Museum – Community Room",
    committee: null,
    isCancelled: false,
  },
  {
    id: 'full-board-2026-12',
    title: 'Full Board Meeting',
    meetingType: 'full_board',
    meetingDate: '2026-12-07',
    startTime: '11:30',
    endTime: '13:00',
    location: "Akron Children's Museum – Community Room",
    committee: null,
    isCancelled: false,
  },

  // Executive Committee (upcoming)
  {
    id: 'exec-2026-04',
    title: 'Executive Committee',
    meetingType: 'committee',
    meetingDate: '2026-04-23',
    startTime: '12:00',
    endTime: '13:00',
    location: 'Virtual (Zoom)',
    committee: 'Executive',
    isCancelled: false,
  },
  {
    id: 'exec-2026-05',
    title: 'Executive Committee',
    meetingType: 'committee',
    meetingDate: '2026-05-28',
    startTime: '12:00',
    endTime: '13:00',
    location: 'Virtual (Zoom)',
    committee: 'Executive',
    isCancelled: false,
  },
  {
    id: 'exec-2026-06',
    title: 'Executive Committee',
    meetingType: 'committee',
    meetingDate: '2026-06-25',
    startTime: '12:00',
    endTime: '13:00',
    location: 'Virtual (Zoom)',
    committee: 'Executive',
    isCancelled: false,
  },

  // Finance Committee (upcoming)
  {
    id: 'finance-2026-04',
    title: 'Finance Committee',
    meetingType: 'committee',
    meetingDate: '2026-04-27',
    startTime: '12:00',
    endTime: '13:00',
    location: 'Virtual (Zoom)',
    committee: 'Finance',
    isCancelled: false,
  },
  {
    id: 'finance-2026-05',
    title: 'Finance Committee',
    meetingType: 'committee',
    meetingDate: '2026-05-25',
    startTime: '12:00',
    endTime: '13:00',
    location: 'Virtual (Zoom)',
    committee: 'Finance',
    isCancelled: false,
  },
  {
    id: 'finance-2026-06',
    title: 'Finance Committee',
    meetingType: 'committee',
    meetingDate: '2026-06-22',
    startTime: '12:00',
    endTime: '13:00',
    location: 'Virtual (Zoom)',
    committee: 'Finance',
    isCancelled: false,
  },
];

export default meetings;

// ── Helpers ──────────────────────────────────────────────────

/** Upcoming meetings sorted by date (nearest first). */
export function upcomingMeetings(list, fromDate = new Date().toISOString().slice(0, 10)) {
  return list
    .filter(m => m.meetingDate >= fromDate && !m.isCancelled)
    .sort((a, b) => a.meetingDate.localeCompare(b.meetingDate));
}

/** Past meetings sorted by date (most recent first). */
export function pastMeetings(list, fromDate = new Date().toISOString().slice(0, 10)) {
  return list
    .filter(m => m.meetingDate < fromDate && !m.isCancelled)
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
