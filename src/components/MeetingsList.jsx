import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock } from 'lucide-react';
import Card, { CardHeader } from './ui/Card';
import ScrollFade from './ui/ScrollFade';
import IconBox from './ui/IconBox';
import { formatDateMedium, daysUntil } from '../lib/formatters';

/**
 * List of upcoming meetings.
 * Each meeting links to its detail view at /meetings/:slug.
 */
export default function MeetingsList({ meetings }) {
  return (
    <Card>
      <CardHeader title="Upcoming Meetings" />
      <ScrollFade>
        {meetings.map((meeting) => (
          <Link
            key={meeting.id}
            to={`/meetings/${meeting.id}`}
            className="flex gap-3 p-3 rounded-lg bg-light-gray/60 border border-border/50
                       hover:border-teal/30 hover:bg-teal-light/20 transition-all group"
          >
            <IconBox
              icon={Calendar}
              accent={meeting.meetingType === 'full_board' ? 'purple' : 'teal'}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-dark leading-snug group-hover:text-teal transition-colors">
                  {meeting.title}
                </p>
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
