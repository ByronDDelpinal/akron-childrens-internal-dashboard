import { useParams, Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import {
  Calendar,
  CalendarPlus,
  Clock,
  MapPin,
  ArrowLeft,
  FileText,
  ExternalLink,
  Download,
  FolderOpen,
  FolderRoot,
  Plus,
  Pencil,
  Trash2,
} from 'lucide-react';
import Card, { CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import IconBox from '../components/ui/IconBox';
import AddDocumentForm from '../components/documents/AddDocumentForm';
import EditMeetingForm from '../components/meetings/EditMeetingForm';
import ConfirmModal from '../components/ui/ConfirmModal';
import { useMeetings } from '../hooks/useMeetings';
import { useMeetingDocuments } from '../hooks/useMeetingDocuments';
import { useDeleteDocument } from '../hooks/useDeleteDocument';
import { formatDateMedium } from '../lib/formatters';
import { categoryLabels, getMeetingAccent } from '../lib/constants';
import { googleCalendarUrl } from '../lib/calendar';
import { timeDisplay, typeLabel } from '../data/meetings';

function DocumentRow({ doc, onRequestDelete, isDeleting }) {
  const isExternal = doc.storageType === 'external';
  const href = isExternal ? doc.externalUrl : doc.storagePath;

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
        onClick={() => onRequestDelete(doc)}
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
  const { meetings, refetch: refetchMeetings } = useMeetings();
  const { documents, isLoading: docsLoading, refetch } = useMeetingDocuments(slug);
  const { deleteDocument, isDeleting } = useDeleteDocument();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);

  async function confirmDelete() {
    const success = await deleteDocument(docToDelete);
    if (success) {
      setDocToDelete(null);
      refetch();
    }
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
          accent={getMeetingAccent(meeting.meetingType)}
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
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {!isPast && (
              <a
                href={googleCalendarUrl(meeting)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium
                           text-teal border border-teal/30 rounded-lg
                           hover:bg-teal-light/30 transition-colors"
              >
                <CalendarPlus className="w-3.5 h-3.5" />
                Add to Google Calendar
              </a>
            )}
            {meeting.driveRootFolderUrl && (
              <a
                href={meeting.driveRootFolderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium
                           text-med-gray border border-border rounded-lg
                           hover:text-teal hover:border-teal/30 hover:bg-teal-light/30 transition-colors"
              >
                <FolderRoot className="w-3.5 h-3.5" />
                All Meeting Materials
              </a>
            )}
            {meeting.driveParentFolderUrl && (
              <a
                href={meeting.driveParentFolderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium
                           text-med-gray border border-border rounded-lg
                           hover:text-teal hover:border-teal/30 hover:bg-teal-light/30 transition-colors"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                {meeting.meetingType === 'full_board' ? 'Board Meetings' :
                 meeting.committee ? `${meeting.committee} Committee` : 'Meeting Folder'}
              </a>
            )}
            <button
              onClick={() => setShowEditForm(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium
                         text-med-gray border border-border rounded-lg
                         hover:text-teal hover:border-teal/30 hover:bg-teal-light/30 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit Meeting
            </button>
          </div>
        </div>
      </div>

      {/* Documents section */}
      <Card>
        <CardHeader title="Meeting Documents">
          <div className="flex items-center gap-3">
            {meeting.driveFolderUrl && (
              <a
                href={meeting.driveFolderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs font-medium text-med-gray hover:text-teal transition-colors"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                Open in Drive
              </a>
            )}
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-1 text-xs font-medium text-teal hover:text-teal-dark transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          </div>
        </CardHeader>
        {docsLoading ? (
          <p className="text-sm text-med-gray py-4 text-center">Loading documents...</p>
        ) : documents.length > 0 ? (
          <div className="space-y-2">
            {documents.map(doc => (
              <DocumentRow key={doc.id} doc={doc} onRequestDelete={setDocToDelete} isDeleting={isDeleting} />
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

      {/* Edit Meeting slide-over */}
      {showEditForm && (
        <EditMeetingForm
          meeting={meeting}
          onClose={() => setShowEditForm(false)}
          onSuccess={refetchMeetings}
        />
      )}

      {/* Delete confirmation modal */}
      {docToDelete && (
        <ConfirmModal
          title={`Remove "${docToDelete.title}"?`}
          message="This only removes the document from the portal — the original file in Google Drive (or wherever it's hosted) will not be deleted. An announcement will be posted to let the board know."
          confirmLabel="Remove from Portal"
          onConfirm={confirmDelete}
          onCancel={() => setDocToDelete(null)}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
}
