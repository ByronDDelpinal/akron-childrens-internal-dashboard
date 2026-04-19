/**
 * Base card wrapper used by every dashboard panel.
 * Centralizes the shared visual pattern so it can be updated in one place.
 */
export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl border border-border p-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ title, children }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-semibold text-dark">{title}</h3>
      {children}
    </div>
  );
}
