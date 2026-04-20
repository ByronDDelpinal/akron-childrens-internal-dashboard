import { FileText, ExternalLink, Download, Trash2 } from 'lucide-react';
import IconBox from '../ui/IconBox';
import { categoryLabels } from '../../lib/constants';
import { formatDateShort } from '../../lib/formatters';

/**
 * Shared document row/card used in both the Document Library and
 * MeetingDetail pages. Renders a clickable link with category badge,
 * optional metadata, and a delete button.
 *
 * @param {object}   doc              - Document object (title, category, storageType, externalUrl, etc.)
 * @param {function} onRequestDelete  - Called with `doc` when the trash button is clicked
 * @param {boolean}  isDeleting       - Disables the delete button when true
 * @param {'card'|'compact'} variant  - "card" for the library page, "compact" for meeting detail rows
 */
export default function DocumentCard({ doc, onRequestDelete, isDeleting, variant = 'card' }) {
  const isExternal = doc.storageType === 'external';
  const href = isExternal ? doc.externalUrl : doc.storagePath;

  const isCompact = variant === 'compact';

  const wrapperClass = isCompact
    ? 'flex items-center gap-3 p-3 rounded-lg bg-light-gray/60 border border-border/50 group'
    : 'flex items-center gap-3 p-4 bg-white rounded-xl border border-border hover:shadow-sm hover:border-teal/30 transition-all group';

  return (
    <div className={wrapperClass}>
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
            {!isCompact && doc.createdAt && (
              <span className="text-[10px] text-med-gray">
                {formatDateShort(doc.createdAt.slice(0, 10))}
              </span>
            )}
          </div>
          {!isCompact && doc.description && (
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
        title="Remove document"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
