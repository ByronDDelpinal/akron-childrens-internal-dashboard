import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Filter,
  Database,
  HardDrive,
  ChevronRight,
} from 'lucide-react';
import IconBox from '../components/ui/IconBox';
import Badge from '../components/ui/Badge';
import { useMeetings } from '../hooks/useMeetings';
import { upcomingMeetings, pastMeetings, timeDisplay, typeLabel } from '../data/meetings';
import { formatDateMedium, formatDateShort, daysUntil } from '../lib/formatters';

const typeFilters = [
  ['all', 'All'],
  ['full_board', 'Full Board'],
  ['committee', 'Committee'],
  ['special', 'Special'],
];

function MeetingRow({ meeting }) {
  const time = timeDisplay(meeting);
  const isPast = new Date(meeting.meetingDate + 'T23:59:59') < new Date();

  return (
    <Link
      to={`/meetings/${meeting.id}`}
      className="flex items-center gap-3 p-4 bg-white rounded-xl border border-border
                 hover:shadow-sm hover:border-teal/30 transition-all group"
    >
      <IconBox
        icon={Calendar}
        accent={meeting.meetingType === 'full_board' ? 'purple' : 'teal'}
        size="sm"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-medium text-dark group-hover:text-teal transition-colors">
            {meeting.title}
          </p>
          <Badge variant={meeting.meetingType === 'full_board' ? 'info' : 'default'}>
            {typeLabel(meeting)}
          </Badge>
          {meeting.isCancelled && <Badge variant="important">Cancelled</Badge>}
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1">
          <span className="flex items-center gap-1 text-xs text-med-gray">
            <Clock className="w-3 h-3" />
            {formatDateMedium(meeting.meetingDate)}{time ? ` · ${time}` : ''}
          </span>
          {meeting.location && (
            <span className="flex items-center gap-1 text-xs text-med-gray">
              <MapPin className="w-3 h-3" />
              {meeting.location}
            </span>
          )}
        </div>
      </div>
      {!isPast && (
        <span className="hidden sm:inline shrink-0 text-xs text-med-gray bg-light-gray px-2 py-0.5 rounded-full border border-border">
          {daysUntil(meeting.meetingDate)}
        </span>
      )}
      <ChevronRight className="w-4 h-4 text-med-gray shrink-0 group-hover:text-teal transition-colors" />
    </Link>
  );
}

export default function Meetings() {
  const { meetings, source, isLoading } = useMeetings();
  const [typeFilter, setTypeFilter] = useState('all');

  const upcoming = useMemo(() => {
    let list = upcomingMeetings(meetings);
    if (typeFilter !== 'all') list = list.filter(m => m.meetingType === typeFilter);
    return list;
  }, [meetings, typeFilter]);

  const past = useMemo(() => {
    let list = pastMeetings(meetings);
    if (typeFilter !== 'all') list = list.filter(m => m.meetingType === typeFilter);
    return list;
  }, [meetings, typeFilter]);

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-5">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-dark">Meetings</h2>
          <p className="text-sm text-med-gray mt-0.5">
            {isLoading ? 'Loading...' : `${upcoming.length} upcoming · ${past.length} past`}
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-med-gray">
          {source === 'supabase'
            ? <><Database className="w-3 h-3" /> Live from database</>
            : <><HardDrive className="w-3 h-3" /> Local data</>
          }
        </div>
      </div>

      {/* Filter bar */}
      <div className="relative w-fit">
        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-med-gray pointer-events-none" />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="pl-9 pr-8 py-2.5 rounded-lg border border-border bg-white
                     text-sm text-dark appearance-none cursor-pointer
                     focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent
                     transition-all"
        >
          {typeFilters.map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-med-gray uppercase tracking-wider">Upcoming</h3>
          {upcoming.map(m => <MeetingRow key={m.id} meeting={m} />)}
        </div>
      )}

      {/* Past */}
      {past.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-med-gray uppercase tracking-wider">Past</h3>
          {past.map(m => <MeetingRow key={m.id} meeting={m} />)}
        </div>
      )}

      {/* Empty state */}
      {upcoming.length === 0 && past.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Calendar className="w-10 h-10 text-med-gray/40 mx-auto mb-3" />
          <p className="text-sm text-med-gray">No meetings found.</p>
        </div>
      )}
    </div>
  );
}
