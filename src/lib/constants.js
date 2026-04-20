/**
 * Shared constants used across multiple components.
 * Single source of truth for labels, options, and mapping helpers.
 */

// ── Organization ──

export const ORG_NAME = "Akron Children's Museum";
export const ORG_SHORT = 'ACM';

// ── Document Categories ──

export const categoryLabels = {
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

export const categoryOptions = Object.entries(categoryLabels);

// ── Meeting Types ──

export const meetingTypeLabels = {
  full_board: 'Full Board',
  committee: 'Committee',
  special: 'Special',
  social: 'Social',
};

export const meetingTypeOptions = Object.entries(meetingTypeLabels);

/**
 * Returns the accent color token for a given meeting type.
 */
export function getMeetingAccent(meetingType) {
  return meetingType === 'full_board' ? 'purple' : 'teal';
}

// ── Proposal Statuses ──

export const proposalStatusConfig = {
  submitted: { label: 'Submitted', variant: 'info' },
  approved:  { label: 'Approved',  variant: 'success' },
  denied:    { label: 'Denied',    variant: 'important' },
};

export const proposalStatusOptions = Object.keys(proposalStatusConfig);

// ── Update Sources ──

export const updateSourceLabels = {
  document: 'Document',
  proposal: 'Proposal',
  meeting: 'Meeting',
  system: 'System',
};
