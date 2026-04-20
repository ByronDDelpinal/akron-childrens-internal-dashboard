import { Bell, AlertTriangle, Plus } from 'lucide-react';
import Card, { CardHeader } from './ui/Card';
import ScrollFade from './ui/ScrollFade';
import IconBox from './ui/IconBox';
import Badge from './ui/Badge';
import { formatDateShort } from '../lib/formatters';

/**
 * List of recent announcements.
 * Receives announcements array as a prop — no direct data imports.
 */
export default function AnnouncementsList({ announcements, onAdd }) {
  return (
    <Card>
      <CardHeader title="Announcements">
        {onAdd && (
          <button
            onClick={onAdd}
            className="flex items-center gap-1 text-xs font-medium text-teal hover:text-teal-dark transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        )}
      </CardHeader>
      <ScrollFade>
        {announcements.length > 0 ? (
          announcements.map((item) => (
            <div key={item.id} className="flex gap-3">
              <IconBox
                icon={item.priority === 'high' ? AlertTriangle : Bell}
                accent={item.priority === 'high' ? 'orange' : 'teal'}
                size="sm"
                className="mt-0.5"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-dark leading-snug">{item.title}</p>
                  {item.priority === 'high' && (
                    <Badge variant="important">Important</Badge>
                  )}
                </div>
                <p className="text-xs text-med-gray mt-0.5 line-clamp-2">{item.summary}</p>
                <p className="text-xs text-med-gray/70 mt-1">{formatDateShort(item.date)}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-med-gray text-center py-4">No announcements.</p>
        )}
      </ScrollFade>
    </Card>
  );
}
