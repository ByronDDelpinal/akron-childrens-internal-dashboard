import { useState } from 'react';
import { X, Bell, Plus, Loader2 } from 'lucide-react';
import { useAddAnnouncement } from '../hooks/useAnnouncements';

/**
 * Slide-over form for posting a new announcement.
 */
export default function AddAnnouncementForm({ onClose, onSuccess }) {
  const { addAnnouncement, isSubmitting, error } = useAddAnnouncement();

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [priority, setPriority] = useState('normal');
  const [hasExpiry, setHasExpiry] = useState(false);
  const [expiresAt, setExpiresAt] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    const result = await addAnnouncement({
      title,
      summary,
      priority,
      expiresAt: hasExpiry && expiresAt ? new Date(expiresAt).toISOString() : null,
    });

    if (result) {
      onSuccess?.();
      onClose();
    }
  }

  const isValid = title.trim() && summary.trim();

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-50" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-teal" />
            <h3 className="text-sm font-semibold text-dark">Post Announcement</h3>
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
              placeholder="e.g., Annual Report Draft Ready"
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-white
                         text-sm text-dark placeholder:text-med-gray
                         focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
            />
          </div>

          {/* Summary */}
          <div>
            <label className="block text-xs font-medium text-dark mb-1">
              Summary <span className="text-orange">*</span>
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Brief description of the announcement..."
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-white
                         text-sm text-dark placeholder:text-med-gray resize-none
                         focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-medium text-dark mb-1.5">Priority</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPriority('normal')}
                className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-colors
                  ${priority === 'normal'
                    ? 'border-teal bg-teal-light/30 text-teal'
                    : 'border-border text-med-gray hover:bg-light-gray'
                  }`}
              >
                Normal
              </button>
              <button
                type="button"
                onClick={() => setPriority('high')}
                className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-colors
                  ${priority === 'high'
                    ? 'border-orange bg-orange/10 text-orange'
                    : 'border-border text-med-gray hover:bg-light-gray'
                  }`}
              >
                Important
              </button>
            </div>
          </div>

          {/* Expiration */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasExpiry}
                onChange={(e) => setHasExpiry(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-border text-teal
                           focus:ring-teal focus:ring-offset-0 accent-teal"
              />
              <span className="text-xs font-medium text-dark">Set expiration date</span>
            </label>
            {hasExpiry && (
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="mt-2 w-full px-3 py-2.5 rounded-lg border border-border bg-white
                           text-sm text-dark
                           focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
              />
            )}
            <p className="text-[10px] text-med-gray mt-1">
              {hasExpiry
                ? 'The announcement will automatically hide after this date.'
                : 'Without an expiration, the announcement stays visible until archived.'}
            </p>
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
            Post
          </button>
        </div>
      </div>
    </>
  );
}
