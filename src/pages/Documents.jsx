import { useState, useMemo, useCallback } from 'react';
import {
  Search,
  Filter,
  FileText,
  ExternalLink,
  Download,
  FolderOpen,
  Database,
  HardDrive,
  Plus,
  Trash2,
} from 'lucide-react';
import IconBox from '../components/ui/IconBox';
import AddDocumentForm from '../components/documents/AddDocumentForm';
import ConfirmModal from '../components/ui/ConfirmModal';
import { useDocuments } from '../hooks/useMeetingDocuments';
import { useDeleteDocument } from '../hooks/useDeleteDocument';
import { formatDateShort } from '../lib/formatters';

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

const categoryOptions = Object.entries(categoryLabels);

function DocumentCard({ doc, onRequestDelete, isDeleting }) {
  const isExternal = doc.storageType === 'external';
  const href = isExternal ? doc.externalUrl : doc.storagePath;

  return (
    <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-border
                    hover:shadow-sm hover:border-teal/30 transition-all group">
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
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] text-med-gray bg-light-gray px-1.5 py-0.5 rounded">
              {categoryLabels[doc.category] || doc.category}
            </span>
            {doc.fileName && (
              <span className="text-[10px] text-med-gray truncate">{doc.fileName}</span>
            )}
            {doc.createdAt && (
              <span className="text-[10px] text-med-gray">
                {formatDateShort(doc.createdAt.slice(0, 10))}
              </span>
            )}
          </div>
          {doc.description && (
            <p className="text-xs text-med-gray mt-1 truncate">{doc.description}</p>
          )}
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

export default function Documents() {
  const { documents, source, isLoading, refetch } = useDocuments();
  const { deleteDocument, isDeleting } = useDeleteDocument();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);

  async function confirmDelete() {
    const success = await deleteDocument(docToDelete);
    if (success) {
      setDocToDelete(null);
      refetch();
    }
  }

  const filtered = useMemo(() => {
    let list = [...documents];

    if (categoryFilter !== 'all') {
      list = list.filter(d => d.category === categoryFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(d =>
        d.title.toLowerCase().includes(q) ||
        (d.description || '').toLowerCase().includes(q) ||
        (d.fileName || '').toLowerCase().includes(q)
      );
    }

    return list;
  }, [documents, search, categoryFilter]);

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-5">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-dark">Document Library</h2>
          <p className="text-sm text-med-gray mt-0.5">
            {isLoading ? 'Loading...' : `${documents.length} documents`}
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-med-gray">
          {source === 'supabase'
            ? <><Database className="w-3 h-3" /> Live from database</>
            : <><HardDrive className="w-3 h-3" /> Local data</>
          }
        </div>
      </div>

      {/* Actions bar */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-white
                     bg-teal rounded-lg hover:bg-teal-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Document
        </button>
      </div>

      {/* Search + Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-med-gray" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-white
                       text-sm text-dark placeholder:text-med-gray
                       focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent
                       transition-all"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-med-gray pointer-events-none" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="pl-9 pr-8 py-2.5 rounded-lg border border-border bg-white
                       text-sm text-dark appearance-none cursor-pointer
                       focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent
                       transition-all"
          >
            <option value="all">All Categories</option>
            {categoryOptions.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Document list */}
      <div className="space-y-2">
        {filtered.length > 0 ? (
          filtered.map(doc => (
            <DocumentCard key={doc.id} doc={doc} onRequestDelete={setDocToDelete} isDeleting={isDeleting} />
          ))
        ) : (
          <div className="text-center py-12">
            <FolderOpen className="w-10 h-10 text-med-gray/40 mx-auto mb-3" />
            <p className="text-sm text-med-gray">
              {isLoading ? 'Loading documents...' : 'No documents found.'}
            </p>
          </div>
        )}
      </div>

      {/* Add Document slide-over */}
      {showAddForm && (
        <AddDocumentForm
          onClose={() => setShowAddForm(false)}
          onSuccess={refetch}
        />
      )}

      {/* Delete confirmation modal */}
      {docToDelete && (
        <ConfirmModal
          title={`Delete "${docToDelete.title}"?`}
          message="Are you sure you want to delete this? It will be unavailable for everyone, and an announcement will be made."
          confirmLabel="Delete Document"
          onConfirm={confirmDelete}
          onCancel={() => setDocToDelete(null)}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
}
