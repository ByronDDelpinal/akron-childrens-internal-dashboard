import { useState } from 'react';
import { FileText, Plus, Loader2 } from 'lucide-react';
import SlideOver from '../ui/SlideOver';
import { useAddProposal } from '../../hooks/useProposals';

/**
 * Slide-over form for submitting a new board action proposal.
 */
export default function SubmitProposalForm({ onClose, onSuccess }) {
  const { addProposal, isSubmitting, error } = useAddProposal();

  const [submitter, setSubmitter] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [proposalLink, setProposalLink] = useState('');
  const [timeSensitive, setTimeSensitive] = useState(false);
  const [boardVote, setBoardVote] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    const result = await addProposal({
      title,
      description,
      submitter,
      proposalLink,
      timeSensitive,
      boardVote,
    });

    if (result) {
      onSuccess?.();
      onClose();
    }
  }

  const isValid = submitter.trim() && title.trim() && description.trim();

  return (
    <SlideOver onClose={onClose} icon={FileText} iconColor="text-purple" title="Submit Proposal">
      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* Submitter */}
        <div>
          <label className="block text-xs font-medium text-dark mb-1">
            Name, Group, or Committee <span className="text-orange">*</span>
          </label>
          <input
            type="text"
            value={submitter}
            onChange={(e) => setSubmitter(e.target.value)}
            placeholder="e.g., Finance Committee, Jane Smith"
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-white
                       text-sm text-dark placeholder:text-med-gray
                       focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
          />
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-medium text-dark mb-1">
            Proposal Title <span className="text-orange">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Approve FY2026 Operating Budget"
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-white
                       text-sm text-dark placeholder:text-med-gray
                       focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-dark mb-1">
            Description <span className="text-orange">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief summary of the proposal and what action is being requested..."
            rows={3}
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-white
                       text-sm text-dark placeholder:text-med-gray resize-none
                       focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
          />
        </div>

        {/* Proposal Link */}
        <div>
          <label className="block text-xs font-medium text-dark mb-1">
            Proposal Document Link
          </label>
          <input
            type="url"
            value={proposalLink}
            onChange={(e) => setProposalLink(e.target.value)}
            placeholder="https://docs.google.com/..."
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-white
                       text-sm text-dark placeholder:text-med-gray
                       focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
          />
          <p className="text-[10px] text-med-gray mt-1">
            Use the{' '}
            <a
              href="https://docs.google.com/document/d/1bh40aMc_U0_ywgU4EjeONsWQf0a3ehjmt0WcyA7gD7U/edit?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple hover:underline"
            >
              proposal template
            </a>
            {' '}to create your full proposal document.
          </p>
        </div>

        {/* Toggles */}
        <div className="space-y-3">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={timeSensitive}
              onChange={(e) => setTimeSensitive(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-border text-orange
                         focus:ring-orange focus:ring-offset-0 accent-orange"
            />
            <div>
              <span className="text-xs font-medium text-dark">Time Sensitive</span>
              <p className="text-[10px] text-med-gray">This proposal requires urgent attention.</p>
            </div>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={boardVote}
              onChange={(e) => setBoardVote(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-border text-purple
                         focus:ring-purple focus:ring-offset-0 accent-purple"
            />
            <div>
              <span className="text-xs font-medium text-dark">Board Vote Required</span>
              <p className="text-[10px] text-med-gray">This proposal needs a formal board vote to proceed.</p>
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
                     bg-purple rounded-lg hover:bg-purple-dark transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          Submit Proposal
        </button>
      </div>
    </SlideOver>
  );
}
