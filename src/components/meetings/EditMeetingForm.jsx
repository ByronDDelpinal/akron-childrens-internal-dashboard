import { useState } from 'react';
import { Pencil, Save, Loader2 } from 'lucide-react';
import SlideOver from '../ui/SlideOver';
import { useUpdateMeeting } from '../../hooks/useMeetings';
import { meetingTypeOptions } from '../../lib/constants';

/**
 * Slide-over form for editing an existing meeting.
 * Pre-fills all fields from the current meeting data.
 */
export default function EditMeetingForm({ meeting, onClose, onSuccess }) {
  const { updateMeeting, isSubmitting, error } = useUpdateMeeting();

  const [title, setTitle] = useState(meeting.title);
  const [meetingDate, setMeetingDate] = useState(meeting.meetingDate);
  const [startTime, setStartTime] = useState(meeting.startTime || '');
  const [endTime, setEndTime] = useState(meeting.endTime || '');
  const [location, setLocation] = useState(meeting.location || '');
  const [description, setDescription] = useState(meeting.description || '');
  const [isCancelled, setIsCancelled] = useState(meeting.isCancelled || false);

  async function handleSubmit(e) {
    e.preventDefault();

    const success = await updateMeeting(meeting.id, {
      title,
      meetingDate,
      startTime: startTime || null,
      endTime: endTime || null,
      location,
      description,
      isCancelled,
    });

    if (success) {
      onSuccess?.();
      onClose();
    }
  }

  const isValid = title.trim() && meetingDate;

  // Find the label for the current meeting type
  const typeLabel = meetingTypeOptions.find(([v]) => v === meeting.meetingType)?.[1] || meeting.meetingType;

  return (
    <SlideOver onClose={onClose} icon={Pencil} title="Edit Meeting">
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
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-white
                       text-sm text-dark placeholder:text-med-gray
                       focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
          />
        </div>

        {/* Meeting type (read-only) */}
        <div>
          <label className="block text-xs font-medium text-dark mb-1">Meeting Type</label>
          <div className="px-3 py-2.5 rounded-lg border border-border bg-light-gray/60 text-sm text-med-gray">
            {typeLabel}
            {meeting.committee && ` — ${meeting.committee}`}
          </div>
          <p className="text-[10px] text-med-gray mt-1">
            Meeting type cannot be changed after creation.
          </p>
        </div>

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

        {/* Cancel / Reinstate toggle */}
        <div className="pt-1 border-t border-border/50">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={isCancelled}
              onChange={(e) => setIsCancelled(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-border text-orange
                         focus:ring-orange focus:ring-offset-0 accent-orange"
            />
            <div>
              <span className="text-xs font-medium text-dark">
                {isCancelled ? 'This meeting is cancelled' : 'Mark as cancelled'}
              </span>
              <p className="text-[10px] text-med-gray">
                {isCancelled
                  ? 'Uncheck to reinstate this meeting. The board will be notified.'
                  : 'Cancelling will notify the board. The meeting will remain visible but marked as cancelled.'}
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
          disabled={!isValid || isSubmitting}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white
                     bg-teal rounded-lg hover:bg-teal-dark transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Changes
        </button>
      </div>
    </SlideOver>
  );
}
