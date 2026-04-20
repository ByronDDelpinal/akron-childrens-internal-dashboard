import { useParams, Link } from 'react-router-dom';
import { useMemo, useState, useCallback } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  FileText,
  ExternalLink,
  Download,
  FolderOpen,
  Plus,
  Trash2,
} from 'lucide-react';
import Card, { CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import IconBox from '../components/ui/IconBox';
import AddDocumentForm from '../components/documents/AddDocumentForm';
import { useMeetings } from '../hooks/useMeetings';
import { useMeetingDocuments } from '../hooks/useMeetingDocuments';
import { useDeleteDocument } from '../hooks/useDeleteDocument';
import { formatDateMedium } from '../lib/formatters';
import { timeDisplay, typeLabel } from '../data/meetings';

const categoryLabels = {
  board_packet: 'Board Packet',
  agenda: 'Agenda',
  minutes: 'Minutes',
  financial_report: 'Financial Report',
  governance: 'Governance',
  policy: 'Policy',
  strategic_plan: 'Strategic Plan',
  bylaw: 'Bylaw',
  presentation: 'Presentation',
  other: 'Other',
};

function DocumentRow({ doc, onDelete, isDeleting }) {
  const isExternal = doc.storageType === 'external';
  const href = isExternal ? doc.externalUrl : doc.storagePath;

  function handleDelete(e) {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Delete "${doc.title}"? This cannot be undone.`)) {
      onDelete(doc);
    }
  }

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-light-gray/60 border border-border/50 group">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 min-w-0 flex-1 hover:opacity-80 transition-opacity"
      >
        <IconBox icon={FileText} accent="teal" size="sm" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-dark group-hover:text-teal transition-colors truncate">
            {doc.title}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] text-med-gray bg-white px-1.5 py-0.5 rounded">
              {categoryLabels[doc.category] || doc.category}
            </span>
            {doc.fileName && (
              <span className="text-[10px] text-med-gray truncate">{doc.fileName}</span>
            )}
          </div>
        </div>
        {isExternal ? (
          <ExternalLink className="w-4 h-4 text-med-gray shrink-0" />
        ) : (
          <Download className="w-4 h-4 text-med-gray shrink-0" />
        )}
      </a>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="p-1.5 rounded-lg text-med-gray hover:text-orange hover:bg-orange/10
                   transition-colors opacity-0 group-hover:opacity-100 shrink-0
                   disabled:opacity-50"
        title="Delete document"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default function MeetingDetail() {
  const { slug } = useParams();
  const { meetings } = useMeetings();
  const { documents, isLoading: docsLoading, refetch } = useMeetingDocuments(slug);
  const { deleteDocument, isDeleting } = useDeleteDocument();
  const [showAddForm, setShowAddForm] = useState(false);

  async function handleDelete(doc) {
    const success = await deleteDocument(doc);
    if (success) refetch();
  }

  const meeting = useMemo(
    () => meetings.find(m => m.id === slug),
    [meetings, slug]
  );

  if (!meeting) {
    return (
      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        <Link to="/" className="flex items-center gap-1.5 text-sm text-teal hover:text-teal-dark transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <div className="text-center py-12">
          <Calendar className="w-10 h-10 text-med-gray/40 mx-auto mb-3" />
          <p className="text-sm text-med-gray">Meeting not found.</p>
        </div>
      </div>
    );
  }

  const time = timeDisplay(meeting);
  const isPast = new Date(meeting.meetingDate + 'T23:59:59') < new Date();

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-5">
      {/* Back link */}
      <Link to="/" className="flex items-center gap-1.5 text-sm text-teal hover:text-teal-dark transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Meeting header */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
        <IconBox
          icon={Calendar}
          accent={meeting.meetingType === 'full_board' ? 'purple' : 'teal'}
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg sm:text-xl font-bold text-dark">{meeting.title}</h2>
            <Badge variant={meeting.meetingType === 'full_board' ? 'info' : 'default'}>
              {typeLabel(meeting)}
            </Badge>
            {isPast && <Badge variant="default">Past</Badge>}
            {meeting.isCancelled && <Badge variant="important">Cancelled</Badge>}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
            <span className="flex items-center gap-1.5 text-sm text-med-gray">
              <Clock className="w-4 h-4 shrink-0" />
              {formatDateMedium(meeting.meetingDate)}{time ? ` · ${time}` : ''}
            </span>
            {meeting.location && (
              <span className="flex items-center gap-1.5 text-sm text-med-gray">
                <MapPin className="w-4 h-4 shrink-0" />
                {meeting.location}
              </span>
            )}
          </div>
          {meeting.description && (
            <p className="text-sm text-med-gray mt-3 leading-relaxed">{meeting.description}</p>
          )}
        </div>
      </div>

      {/* Documents section */}
      <Card>
        <CardHeader title="Meeting Documents">
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1 text-xs font-medium text-teal hover:text-teal-dark transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        </CardHeader>
        {docsLoading ? (
          <p className="text-sm text-med-gray py-4 text-center">Loading documents...</p>
        ) : documents.length > 0 ? (
          <div className="space-y-2">
            {documents.map(doc => (
              <DocumentRow key={doc.id} doc={doc} onDelete={handleDelete} isDeleting={isDeleting} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FolderOpen className="w-8 h-8 text-med-gray/40 mx-auto mb-2" />
            <p className="text-sm text-med-gray">No documents attached to this meeting yet.</p>
          </div>
        )}
      </Card>

      {/* Add Document slide-over */}
      {showAddForm && (
        <AddDocumentForm
          onClose={() => setShowAddForm(false)}
          onSuccess={refetch}
          preselectedMeetingSlug={slug}
        />
      )}
    </div>
  );
}
