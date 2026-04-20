import { RefreshCw, FileText, Vote, Calendar, Zap } from 'lucide-react';
import Card, { CardHeader } from './ui/Card';
import IconBox from './ui/IconBox';
import { formatDateShort } from '../lib/formatters';

const sourceConfig = {
  document: { icon: FileText, accent: 'teal' },
  proposal: { icon: Vote, accent: 'purple' },
  meeting:  { icon: Calendar, accent: 'blue' },
  system:   { icon: Zap, accent: 'orange' },
};

/**
 * List of recent auto-generated updates (document adds/deletes, proposal changes, etc.)
 * Receives updates array as a prop — no direct data imports.
 */
export default function UpdatesList({ updates }) {
  return (
    <Card>
      <CardHeader title="Recent Updates" />
      <div className="space-y-3 max-h-[320px] overflow-y-auto">
        {updates.length > 0 ? (
          updates.map((item) => {
            const cfg = sourceConfig[item.source] || sourceConfig.system;
            return (
              <div key={item.id} className="flex gap-3">
                <IconBox
                  icon={cfg.icon}
                  accent={cfg.accent}
                  size="sm"
                  className="mt-0.5"
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-dark leading-snug">{item.title}</p>
                  <p className="text-xs text-med-gray mt-0.5 line-clamp-2">{item.summary}</p>
                  {item.date && (
                    <p className="text-xs text-med-gray/70 mt-1">{formatDateShort(item.date)}</p>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-med-gray text-center py-4">No recent updates.</p>
        )}
      </div>
    </Card>
  );
}
