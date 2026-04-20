import { useState } from 'react';
import { Zap, Plus, Loader2 } from 'lucide-react';
import SlideOver from './ui/SlideOver';
import { createUpdate } from '../hooks/useUpdates';

/**
 * Slide-over form for posting a manual update.
 * Lighter-weight than announcements — just a quick title + summary.
 */
export default function AddUpdateForm({ onClose, onSuccess }) {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    setIsSubmitting(true);
    setError(null);

    try {
      await createUpdate({
        title: title.trim(),
        summary: summary.trim(),
        source: 'system',
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to post update.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const isValid = title.trim() && summary.trim();

  return (
    <SlideOver onClose={onClose} icon={Zap} title="Post Update">
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
            placeholder="e.g., Committee chairs confirmed for Q3"
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
            placeholder="Brief description of the update..."
            rows={3}
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-white
                       text-sm text-dark placeholder:text-med-gray resize-none
                       focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
          />
        </div>

        <p className="text-[10px] text-med-gray">
          Updates appear in the Recent Updates feed on the dashboard.
          For important or time-sensitive items, consider posting an Announcement instead.
        </p>

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
    </SlideOver>
  );
}
