import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Plus } from 'lucide-react';
import Card, { CardHeader } from './ui/Card';
import ScrollFade from './ui/ScrollFade';
import Badge from './ui/Badge';
import IconBox from './ui/IconBox';
import { formatDateMedium, daysUntil } from '../lib/formatters';
import { getMeetingAccent } from '../lib/constants';

/**
 * List of upcoming meetings.
 * Each meeting links to its detail view at /meetings/:slug.
 * Cancelled meetings are shown with reduced opacity and a badge.
 */
export default function MeetingsList({ meetings, onAdd }) {
  return (
    <Card>
      <CardHeader title="Upcoming Meetings">
        {onAdd && (
          <button
            onClick={onAdd}
            className="flex items-center gap-1 text-xs font-medium text-teal hover:text-teal-dark transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        )}
      </CardHeader>
      <ScrollFade>
        {meetings.map((meeting) => (
          <Link
            key={meeting.id}
            to={`/meetings/${meeting.id}`}
            className={`flex gap-3 p-3 rounded-lg border border-border/50
                       hover:border-teal/30 hover:bg-teal-light/20 transition-all group
                       ${meeting.isCancelled ? 'bg-light-gray/30 opacity-60' : 'bg-light-gray/60'}`}
          >
            <IconBox
              icon={Calendar}
              accent={meeting.isCancelled ? 'orange' : getMeetingAccent(meeting.meetingType)}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <p className={`text-sm font-medium leading-snug group-hover:text-teal transition-colors truncate
                    ${meeting.isCancelled ? 'text-med-gray line-through' : 'text-dark'}`}>
                    {meeting.title}
                  </p>
                  {meeting.isCancelled && <Badge variant="important">Cancelled</Badge>}
                </div>
                <span className="shrink-0 text-xs text-med-gray bg-white px-2 py-0.5 rounded-full border border-border">
                  {daysUntil(meeting.meetingDate)}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1">
                <span className="flex items-center gap-1 text-xs text-med-gray">
                  <Clock className="w-3 h-3" />
                  {formatDateMedium(meeting.meetingDate)} · {meeting.time || `${meeting.startTime} – ${meeting.endTime}`}
                </span>
                <span className="flex items-center gap-1 text-xs text-med-gray">
                  <MapPin className="w-3 h-3" />
                  {meeting.location}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </ScrollFade>
    </Card>
  );
}
