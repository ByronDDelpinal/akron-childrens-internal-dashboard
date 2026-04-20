import { useState } from 'react';
import { Calendar, Plus, Loader2 } from 'lucide-react';
import SlideOver from '../ui/SlideOver';
import { useAddMeeting } from '../../hooks/useMeetings';
import { meetingTypeOptions } from '../../lib/constants';

/**
 * Slide-over form for scheduling a new meeting.
 */
export default function AddMeetingForm({ onClose, onSuccess }) {
  const { addMeeting, isSubmitting, error } = useAddMeeting();

  const [title, setTitle] = useState('');
  const [meetingType, setMeetingType] = useState('full_board');
  const [meetingDate, setMeetingDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState("Akron Children's Museum – Community Room");
  const [description, setDescription] = useState('');
  const [committee, setCommittee] = useState('');
  const [createAgenda, setCreateAgenda] = useState(true);

  // Default agenda creation ON for full board, OFF for others
  function handleTypeChange(type) {
    setMeetingType(type);
    setCreateAgenda(type === 'full_board');
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const result = await addMeeting({
      title,
      meetingType,
      meetingDate,
      startTime: startTime || null,
      endTime: endTime || null,
      location,
      description,
      committee: meetingType === 'committee' ? committee : null,
      createAgenda,
    });

    if (result) {
      onSuccess?.();
      onClose();
    }
  }

  const isValid = title.trim() && meetingDate;

  return (
    <SlideOver onClose={onClose} icon={Calendar} title="Schedule Meeting">
      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-medium text-dark mb-1">
            Meeting Title <span className="text-orange">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Full Board Meeting"
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-white
                       text-sm text-dark placeholder:text-med-gray
                       focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
          />
        </div>

        {/* Meeting Type */}
        <div>
          <label className="block text-xs font-medium text-dark mb-1.5">Meeting Type</label>
          <div className="grid grid-cols-2 gap-2">
            {meetingTypeOptions.map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => handleTypeChange(value)}
                className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors
                  ${meetingType === value
                    ? 'border-teal bg-teal-light/30 text-teal'
                    : 'border-border text-med-gray hover:bg-light-gray'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Committee name (conditional) */}
        {meetingType === 'committee' && (
          <div>
            <label className="block text-xs font-medium text-dark mb-1">
              Committee Name <span className="text-orange">*</span>
            </label>
            <input
              type="text"
              value={committee}
              onChange={(e) => setCommittee(e.target.value)}
              placeholder="e.g., Executive, Finance"
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-white
                         text-sm text-dark placeholder:text-med-gray
                         focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
            />
          </div>
        )}

        {/* Date */}
        <div>
          <label className="block text-xs font-medium text-dark mb-1">
            Date <span className="text-orange">*</span>
          </label>
          <input
            type="date"
            value={meetingDate}
            onChange={(e) => setMeetingDate(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-white
                       text-sm text-dark
                       focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
          />
        </div>

        {/* Time range */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-dark mb-1">Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-white
                         text-sm text-dark
                         focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-dark mb-1">End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-white
                         text-sm text-dark
                         focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-xs font-medium text-dark mb-1">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Community Room"
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-white
                       text-sm text-dark placeholder:text-med-gray
                       focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-dark mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional notes about this meeting..."
            rows={2}
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-white
                       text-sm text-dark placeholder:text-med-gray resize-none
                       focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
          />
        </div>

        {/* Auto-create agenda */}
        <div className="pt-1 border-t border-border/50">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={createAgenda}
              onChange={(e) => setCreateAgenda(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-border text-teal
                         focus:ring-teal focus:ring-offset-0 accent-teal"
            />
            <div>
              <span className="text-xs font-medium text-dark">Create placeholder agenda &amp; minutes</span>
              <p className="text-[10px] text-med-gray">
                Automatically creates agenda and minutes documents linked to this meeting.
                You can replace them with the final versions later.
              </p>
            </div>
          </label>
        </div>

        {/* Error */}
        {error && (
          <p className="text-xs text-orange bg-orange/10 px-3 py-2 rounded-lg">{error}</p>
        )}
      </form>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-border flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm text-med-gray hover:text-dark rounded-lg
                     hover:bg-light-gray transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!isValid || isSubmitting || (meetingType === 'committee' && !committee.trim())}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white
                     bg-teal rounded-lg hover:bg-teal-dark transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          Schedule Meeting
        </button>
      </div>
    </SlideOver>
  );
}
