import { useState, useMemo } from 'react';
import {
  FileText,
  ExternalLink,
  Plus,
  Clock,
  AlertTriangle,
  Vote,
  CheckCircle2,
  XCircle,
  Database,
  HardDrive,
  ChevronDown,
  Filter,
} from 'lucide-react';
import Card, { CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import IconBox from '../components/ui/IconBox';
import ConfirmModal from '../components/ui/ConfirmModal';
import SubmitProposalForm from '../components/proposals/SubmitProposalForm';
import { useProposals, useUpdateProposalStatus } from '../hooks/useProposals';
import { formatDateShort } from '../lib/formatters';

const statusConfig = {
  submitted: { label: 'Submitted', variant: 'info' },
  approved:  { label: 'Approved',  variant: 'success' },
  denied:    { label: 'Denied',    variant: 'important' },
};

const statusOptions = ['all', 'submitted', 'approved', 'denied'];

function ProposalCard({ proposal, onRequestStatusChange, isUpdating }) {
  const [showActions, setShowActions] = useState(false);
  const cfg = statusConfig[proposal.status] || statusConfig.submitted;

  return (
    <div className="p-4 bg-white rounded-xl border border-border hover:shadow-sm transition-all">
      {/* Top row */}
      <div className="flex items-start gap-3">
        <IconBox icon={FileText} accent="purple" size="sm" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-semibold text-dark">{proposal.title}</h4>
            <Badge variant={cfg.variant}>{cfg.label}</Badge>
            {proposal.timeSensitive && (
              <Badge variant="important">
                <AlertTriangle className="w-2.5 h-2.5 mr-0.5" />
                Urgent
              </Badge>
            )}
            {proposal.boardVote && (
              <Badge variant="info">
                <Vote className="w-2.5 h-2.5 mr-0.5" />
                Board Vote
              </Badge>
            )}
          </div>
          <p className="text-xs text-med-gray mt-1 line-clamp-2">{proposal.description}</p>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className="text-[10px] text-med-gray">
              by <span className="font-medium text-dark">{proposal.submitter}</span>
            </span>
            {proposal.submittedAt && (
              <span className="flex items-center gap-1 text-[10px] text-med-gray">
                <Clock className="w-2.5 h-2.5" />
                {formatDateShort(proposal.submittedAt.slice(0, 10))}
              </span>
            )}
            {proposal.proposalLink && (
              <a
                href={proposal.proposalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] text-purple hover:underline"
              >
                <ExternalLink className="w-2.5 h-2.5" />
                View Proposal
              </a>
            )}
          </div>
        </div>

        {/* Status change dropdown */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowActions(!showActions)}
            className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-med-gray
                       border border-border rounded-lg hover:bg-light-gray transition-colors"
          >
            {cfg.label}
            <ChevronDown className={`w-3 h-3 transition-transform ${showActions ? 'rotate-180' : ''}`} />
          </button>
          {showActions && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowActions(false)} />
              <div className="absolute right-0 top-full mt-1 bg-white border border-border rounded-lg shadow-lg z-20 py-1 min-w-[140px]">
                {proposal.status !== 'submitted' && (
                  <button
                    onClick={() => { onRequestStatusChange(proposal, 'submitted'); setShowActions(false); }}
                    disabled={isUpdating}
                    className="w-full text-left px-3 py-2 text-xs text-dark hover:bg-light-gray transition-colors flex items-center gap-2"
                  >
                    <FileText className="w-3 h-3 text-blue" />
                    Revert to Submitted
                  </button>
                )}
                {proposal.status !== 'approved' && (
                  <button
                    onClick={() => { onRequestStatusChange(proposal, 'approved'); setShowActions(false); }}
                    disabled={isUpdating}
                    className="w-full text-left px-3 py-2 text-xs text-dark hover:bg-light-gray transition-colors flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-3 h-3 text-green" />
                    Approve
                  </button>
                )}
                {proposal.status !== 'denied' && (
                  <button
                    onClick={() => { onRequestStatusChange(proposal, 'denied'); setShowActions(false); }}
                    disabled={isUpdating}
                    className="w-full text-left px-3 py-2 text-xs text-dark hover:bg-light-gray transition-colors flex items-center gap-2"
                  >
                    <XCircle className="w-3 h-3 text-red" />
                    Deny
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Proposals() {
  const { proposals, source, isLoading, refetch } = useProposals();
  const { updateStatus, isUpdating } = useUpdateProposalStatus();
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [pendingChange, setPendingChange] = useState(null); // { proposal, newStatus }

  function requestStatusChange(proposal, newStatus) {
    setPendingChange({ proposal, newStatus });
  }

  async function confirmStatusChange() {
    if (!pendingChange) return;
    const success = await updateStatus(pendingChange.proposal, pendingChange.newStatus);
    if (success) {
      setPendingChange(null);
      refetch();
    }
  }

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return proposals;
    return proposals.filter(p => p.status === statusFilter);
  }, [proposals, statusFilter]);

  const activeCount = proposals.filter(p => p.status === 'submitted').length;

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-5">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-dark">Board Proposals</h2>
          <p className="text-sm text-med-gray mt-0.5">
            {isLoading ? 'Loading...' : `${activeCount} active proposal${activeCount !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-med-gray">
          {source === 'supabase'
            ? <><Database className="w-3 h-3" /> Live from database</>
            : <><HardDrive className="w-3 h-3" /> Local data</>
          }
        </div>
      </div>

      {/* Process info card */}
      <Card>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-9 h-9 rounded-lg bg-purple-light flex items-center justify-center">
              <FileText className="w-4.5 h-4.5 text-purple" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-dark">How to Submit a Proposal</h3>
              <p className="text-xs text-med-gray mt-1 leading-relaxed">
                Board action proposals can be submitted by any board member, committee, or staff member.
                To submit a proposal, start by making a copy of the{' '}
                <a
                  href="https://docs.google.com/document/d/1bh40aMc_U0_ywgU4EjeONsWQf0a3ehjmt0WcyA7gD7U/edit?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple font-medium hover:underline"
                >
                  Proposal Template
                </a>
                {' '}in Google Docs. The template is just a starting point — feel free to modify it
                to fit your proposal as you see fit. Fill out the relevant sections, then use the form
                below to submit your proposal with a link to the completed document. The board will be
                notified automatically.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 pl-12">
            <span className="text-[10px] text-med-gray bg-light-gray px-2 py-1 rounded">
              Draft → Submitted → Approved / Denied
            </span>
          </div>
        </div>
      </Card>

      {/* Actions bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-med-gray pointer-events-none" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-9 pr-8 py-2.5 rounded-lg border border-border bg-white
                       text-sm text-dark appearance-none cursor-pointer
                       focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent
                       transition-all"
          >
            <option value="all">All Proposals</option>
            {statusOptions.slice(1).map(s => (
              <option key={s} value={s}>{statusConfig[s].label}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setShowSubmitForm(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-white
                     bg-purple rounded-lg hover:bg-purple-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Submit Proposal
        </button>
      </div>

      {/* Proposal list */}
      <div className="space-y-2">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-sm text-med-gray">Loading proposals...</p>
          </div>
        ) : filtered.length > 0 ? (
          filtered.map(p => (
            <ProposalCard
              key={p.id}
              proposal={p}
              onRequestStatusChange={requestStatusChange}
              isUpdating={isUpdating}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <FileText className="w-10 h-10 text-med-gray/40 mx-auto mb-3" />
            <p className="text-sm text-med-gray">
              {statusFilter !== 'all'
                ? `No ${statusConfig[statusFilter]?.label.toLowerCase()} proposals.`
                : 'No proposals yet. Be the first to submit one!'}
            </p>
          </div>
        )}
      </div>

      {/* Submit Proposal slide-over */}
      {showSubmitForm && (
        <SubmitProposalForm
          onClose={() => setShowSubmitForm(false)}
          onSuccess={refetch}
        />
      )}

      {/* Status change confirmation modal */}
      {pendingChange && (
        <ConfirmModal
          title={`${statusConfig[pendingChange.newStatus]?.label} this proposal?`}
          message={`Are you sure you want to mark "${pendingChange.proposal.title}" as ${pendingChange.newStatus}? An announcement will be made to notify the board.`}
          confirmLabel={statusConfig[pendingChange.newStatus]?.label}
          onConfirm={confirmStatusChange}
          onCancel={() => setPendingChange(null)}
          isLoading={isUpdating}
        />
      )}
    </div>
  );
}
