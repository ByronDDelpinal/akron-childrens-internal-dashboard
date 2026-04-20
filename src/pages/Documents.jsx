import { useState, useMemo } from 'react';
import { Search, Filter, FolderOpen, Plus } from 'lucide-react';
import DocumentCard from '../components/documents/DocumentCard';
import AddDocumentForm from '../components/documents/AddDocumentForm';
import ConfirmModal from '../components/ui/ConfirmModal';
import { useDocuments } from '../hooks/useMeetingDocuments';
import { useDeleteDocument } from '../hooks/useDeleteDocument';
import { categoryOptions } from '../lib/constants';

export default function Documents() {
  const { documents, isLoading, refetch } = useDocuments();
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
