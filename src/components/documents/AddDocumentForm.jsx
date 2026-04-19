import { useState, useMemo } from 'react';
import { X, Link as LinkIcon, Plus, Loader2, Search } from 'lucide-react';
import { useAddDocument } from '../../hooks/useAddDocument';
import { useMeetings } from '../../hooks/useMeetings';
import { upcomingMeetings, pastMeetings, typeLabel } from '../../data/meetings';
import { formatDateShort } from '../../lib/formatters';

const categoryOptions = [
  ['board_packet', 'Board Packet'],
  ['agenda', 'Agenda'],
  ['minutes', 'Minutes'],
  ['financial_report', 'Financial Report'],
  ['governance', 'Governance'],
  ['policy', 'Policy'],
  ['strategic_plan', 'Strategic Plan'],
  ['bylaw', 'Bylaw'],
  ['presentation', 'Presentation'],
  ['other', 'Other'],
];

/**
 * Slide-over form for adding an external document link.
 * Can optionally pre-select a meeting when opened from MeetingDetail.
 */
export default function AddDocumentForm({ onClose, onSuccess, preselectedMeetingSlug = null }) {
  const { addDocument, isSubmitting, error } = useAddDocument();
  const { meetings } = useMeetings();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('other');
  const [externalUrl, setExternalUrl] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMeetings, setSelectedMeetings] = useState(
    preselectedMeetingSlug ? [preselectedMeetingSlug] : []
  );
  const [meetingSearch, setMeetingSearch] = useState('');

  // Build a sorted list: upcoming first, then recent past
  const upcoming = upcomingMeetings(meetings);
  const past = pastMeetings(meetings).slice(0, 10);
  const meetingOptions = [...upcoming, ...past];

  const filteredMeetings = useMemo(() => {
    if (!meetingSearch.trim()) return meetingOptions;
    const q = meetingSearch.toLowerCase();
    return meetingOptions.filter(m =>
      m.title.toLowerCase().includes(q) ||
      (m.committee || '').toLowerCase().includes(q) ||
      m.meetingDate.includes(q)
    );
  }, [meetingOptions, meetingSearch]);

  function toggleMeeting(slug) {
    setSelectedMeetings(prev =>
      prev.includes(slug)
        ? prev.filter(s => s !== slug)
        : [...prev, slug]
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const doc = await addDocument({
      title,
      category,
      externalUrl,
      description,
      meetingSlugs: selectedMeetings,
    });

    if (doc) {
      onSuccess?.();
      onClose();
    }
  }

  const isValid = title.trim() && externalUrl.trim();

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-50" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-teal" />
            <h3 className="text-sm font-semibold text-dark">Add External Document</h3>
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
              Title <span className="text-orange">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., April Board Packet"
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-white
                         text-sm text-dark placeholder:text-med-gray
                         focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
            />
          </div>

          {/* URL */}
          <div>
            <label className="block text-xs font-medium text-dark mb-1">
              Link URL <span className="text-orange">*</span>
            </label>
            <input
              type="url"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              placeholder="https://drive.google.com/..."
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-white
                         text-sm text-dark placeholder:text-med-gray
                         focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-dark mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-white
                         text-sm text-dark appearance-none cursor-pointer
                         focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
            >
              {categoryOptions.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-dark mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional notes about this document..."
              rows={2}
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-white
                         text-sm text-dark placeholder:text-med-gray resize-none
                         focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
            />
          </div>

          {/* Meeting associations */}
          <div>
            <label className="block text-xs font-medium text-dark mb-1.5">
              Link to Meetings
            </label>
            <div className="relative mb-2">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-med-gray" />
              <input
                type="text"
                value={meetingSearch}
                onChange={(e) => setMeetingSearch(e.target.value)}
                placeholder="Search meetings..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-border bg-white
                           text-xs text-dark placeholder:text-med-gray
                           focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
              />
            </div>
            <div className="max-h-48 overflow-y-auto border border-border rounded-lg divide-y divide-border/50">
              {filteredMeetings.map(m => {
                const checked = selectedMeetings.includes(m.id);
                return (
                  <label
                    key={m.id}
                    className={`flex items-center gap-2.5 px-3 py-2 cursor-pointer transition-colors
                      ${checked ? 'bg-teal-light/30' : 'hover:bg-light-gray/60'}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleMeeting(m.id)}
                      className="w-3.5 h-3.5 rounded border-border text-teal
                                 focus:ring-teal focus:ring-offset-0 accent-teal"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-dark truncate">{m.title}</p>
                      <p className="text-[10px] text-med-gray">
                        {formatDateShort(m.meetingDate)} · {typeLabel(m)}
                      </p>
                    </div>
                  </label>
                );
              })}
              {filteredMeetings.length === 0 && (
                <p className="text-xs text-med-gray px-3 py-4 text-center">
                  {meetingSearch.trim() ? 'No meetings match your search.' : 'No meetings available.'}
                </p>
              )}
            </div>
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
              <Plus className="w-4 h-4" />
            )}
            Add Document
          </button>
        </div>
      </div>
    </>
  );
}
