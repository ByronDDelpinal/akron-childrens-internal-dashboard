import { formatDollarCompact } from '../../lib/formatters';

/**
 * Shared Recharts tooltip component.
 *
 * Renders a styled tooltip box with the label and one or more payload entries.
 * Accepts an optional `formatter` prop to override the default dollar formatter.
 */
export default function ChartTooltip({ active, payload, label, formatter = formatDollarCompact }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white border border-border rounded-lg shadow-lg p-3 text-xs">
      <p className="font-semibold text-dark mb-1.5">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="flex items-center gap-1.5" style={{ color: entry.color }}>
          <span
            className="w-2 h-2 rounded-full inline-block shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          {entry.name}: {formatter(entry.value)}
        </p>
      ))}
    </div>
  );
}
