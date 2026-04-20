import { useState } from 'react';
import { X, Calendar, Plus, Loader2 } from 'lucide-react';
import { useAddMeeting } from '../../hooks/useMeetings';

const typeOptions = [
  ['full_board', 'Full Board'],
  ['committee', 'Committee'],
  ['special', 'Special'],
  ['social', 'Social'],
];

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
    });

    if (result) {
      onSuccess?.();
      onClose();
    }
  }

  const isValid = title.trim() && meetingDate;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-50" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-teal" />
            <h3 className="text-sm font-semibold text-dark">Schedule Meeting</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-light-gray transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

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
              {typeOptions.map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMeetingType(value)}
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
      </div>
    </>
  );
}
