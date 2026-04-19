import { Calendar, MapPin, Clock } from 'lucide-react';
import { upcomingMeetings } from '../data/dashboard';

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function daysUntil(dateStr) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + 'T12:00:00');
  target.setHours(0, 0, 0, 0);
  const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff < 0) return 'Past';
  return `${diff} days`;
}

export default function MeetingsList() {
  return (
    <div className="bg-white rounded-xl border border-border p-4">
      <h3 className="text-sm font-semibold text-dark mb-3">Upcoming Meetings</h3>
      <div className="space-y-3">
        {upcomingMeetings.map((meeting) => (
          <div
            key={meeting.id}
            className="flex gap-3 p-3 rounded-lg bg-light-gray/60 border border-border/50"
          >
            <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
              meeting.type === 'board' ? 'bg-purple-light text-purple' : 'bg-teal-light text-teal'
            }`}>
              <Calendar className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-dark leading-snug">{meeting.title}</p>
                <span className="shrink-0 text-xs text-med-gray bg-white px-2 py-0.5 rounded-full border border-border">
                  {daysUntil(meeting.date)}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1">
                <span className="flex items-center gap-1 text-xs text-med-gray">
                  <Clock className="w-3 h-3" />
                  {formatDate(meeting.date)} · {meeting.time}
                </span>
                <span className="flex items-center gap-1 text-xs text-med-gray">
                  <MapPin className="w-3 h-3" />
                  {meeting.location}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
