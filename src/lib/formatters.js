/**
 * Shared formatting utilities.
 * Every component that displays money, numbers, or dates should use these.
 */

/** Compact dollar display: $128K, $1.3M */
export function formatDollarCompact(value) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
}

/** Detailed dollar display: $853K or $1.28M (more precision for stat cards) */
export function formatDollarDetail(value) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
}

/** Locale-aware number: 44,179 */
export function formatNumber(value) {
  return value.toLocaleString('en-US');
}

/** Short date: "Apr 15" */
export function formatDateShort(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** Medium date: "Wed, May 14" */
export function formatDateMedium(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

/** Relative days: "Today", "Tomorrow", "12 days", "Past" */
export function daysUntil(dateStr) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + 'T12:00:00');
  target.setHours(0, 0, 0, 0);
  const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff < 0) return 'Past';
  return `${diff} days`;
}
