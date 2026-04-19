import { Bell, AlertTriangle } from 'lucide-react';
import { announcements } from '../data/dashboard';

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function AnnouncementsList() {
  return (
    <div className="bg-white rounded-xl border border-border p-4">
      <h3 className="text-sm font-semibold text-dark mb-3">Announcements</h3>
      <div className="space-y-3">
        {announcements.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5 ${
              item.priority === 'high' ? 'bg-orange/10 text-orange' : 'bg-teal-light text-teal'
            }`}>
              {item.priority === 'high'
                ? <AlertTriangle className="w-4 h-4" />
                : <Bell className="w-4 h-4" />
              }
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-dark leading-snug">{item.title}</p>
                {item.priority === 'high' && (
                  <span className="shrink-0 text-[10px] font-semibold uppercase text-orange bg-orange/10 px-1.5 py-0.5 rounded-full">
                    Important
                  </span>
                )}
              </div>
              <p className="text-xs text-med-gray mt-0.5 line-clamp-2">{item.summary}</p>
              <p className="text-xs text-med-gray/70 mt-1">{formatDate(item.date)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
