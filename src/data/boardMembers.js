/**
 * Board of Directors roster.
 *
 * SOURCE OF TRUTH: ACM Board of Directors Handbook (2025–2026)
 *   - Directory pages (member info, contact details)
 *   - Board & Committee Meetings page (committee assignments and roles)
 *
 * Schema notes for future Supabase migration:
 * - `id` will become a UUID primary key
 * - `status` enables soft-delete: "active" | "emeritus" | "former"
 * - `termEnd` of null = lifetime trustee
 * - `photoUrl` will point to Supabase Storage; for now, null = show initials
 * - `committeeRoles` maps committee name → role (Chair, Lead, etc.)
 * - Add `archivedAt` and `archivedReason` columns for historical tracking
 */

const boardMembers = [
  // ── Officers ──
  {
    id: 'angie-rogers',
    firstName: 'Angelique',
    preferredName: 'Angie',
    lastName: 'Rogers',
    title: 'President',
    organization: '415 Group',
    phone: '330.697.1306',
    email: 'angie.rogers.cpa@gmail.com',
    committees: ['Executive', 'Finance'],
    committeeRoles: { Executive: 'Current President' },
    termStart: '2021-01',
    termEnd: '2027-01',
    status: 'active',
    bio: null,
    photoUrl: null,
  },
  {
    id: 'allyson-boyd',
    firstName: 'Allyson',
    preferredName: null,
    lastName: 'Boyd',
    title: 'Vice President',
    organization: 'Akron Zoo',
    phone: '330.715.7646',
    email: 'allysonlboyd@gmail.com',
    committees: ['Executive', 'Donor Relations'],
    committeeRoles: { Executive: 'Incoming President', 'Donor Relations': 'Lead' },
    termStart: '2022-04',
    termEnd: '2028-04',
    status: 'active',
    bio: null,
    photoUrl: null,
  },
  {
    id: 'susan-burnoski',
    firstName: 'Susan',
    preferredName: null,
    lastName: 'Burnoski',
    title: 'Treasurer',
    organization: 'Eide Bailly LLP',
    phone: '216.650.6538',
    email: 'sburnoski@eidebailly.com',
    committees: ['Executive', 'Finance'],
    committeeRoles: { Executive: 'Treasurer', Finance: 'Chair' },
    termStart: '2021-01',
    termEnd: '2027-01',
    status: 'active',
    bio: null,
    photoUrl: null,
  },
  {
    id: 'ciera-preer',
    firstName: 'Ciera',
    preferredName: null,
    lastName: 'Preer',
    title: 'Secretary',
    organization: 'Vapotherm',
    phone: '330.620.6247',
    email: 'cpreer@vtherm.com',
    committees: ['Executive', 'Donor Relations'],
    committeeRoles: { Executive: 'Secretary' },
    termStart: '2022-04',
    termEnd: '2028-04',
    status: 'active',
    bio: null,
    photoUrl: null,
  },

  // ── Lifetime Trustees ──
  {
    id: 'betsy-hartschuh',
    firstName: 'Betsy',
    preferredName: null,
    lastName: 'Hartschuh',
    title: 'Lifetime Trustee',
    organization: 'Witschey, Witschey & Firestone',
    phone: '330.329.3942',
    email: 'betsylbh@gmail.com',
    committees: ['Executive', 'Governance', 'Signature Fundraiser'],
    committeeRoles: { Governance: 'Chair', 'Signature Fundraiser': 'Lead' },
    termStart: '2012-01',
    termEnd: null,
    status: 'active',
    bio: null,
    photoUrl: null,
  },
  {
    id: 'ryan-hartschuh',
    firstName: 'Ryan',
    preferredName: null,
    lastName: 'Hartschuh',
    title: 'Lifetime Trustee',
    organization: 'Goodyear',
    phone: '330.714.1636',
    email: 'schuh32@gmail.com',
    committees: [],
    committeeRoles: {},
    termStart: '2012-01',
    termEnd: null,
    status: 'active',
    bio: null,
    photoUrl: null,
  },
  {
    id: 'benjamin-tegel',
    firstName: 'Benjamin',
    preferredName: null,
    lastName: 'Tegel',
    title: 'Lifetime Trustee',
    organization: 'Auxin Group \u2013 Wealth Mgmt',
    phone: '312.498.7084',
    email: 'benjamin.tegel@farther.com',
    committees: [],
    committeeRoles: {},
    termStart: '2012-01',
    termEnd: null,
    status: 'active',
    bio: null,
    photoUrl: null,
  },

  // ── Board Members (alphabetical) ──
  {
    id: 'amber-barkoukis',
    firstName: 'Amber',
    preferredName: null,
    lastName: 'Barkoukis',
    title: null,
    organization: 'Embracing Futures',
    phone: '330.620.6964',
    email: 'AmberGenet@gmail.com',
    committees: ['Governance', 'Signature Fundraiser'],
    committeeRoles: {},
    termStart: '2023-12',
    termEnd: '2026-12',
    status: 'active',
    bio: null,
    photoUrl: null,
  },
  {
    id: 'stephanie-bencin',
    firstName: 'Stephanie',
    preferredName: null,
    lastName: 'Bencin',
    title: null,
    organization: 'FirstEnergy Corp',
    phone: '330.730.4148',
    email: 'Sjbencin@yahoo.com',
    committees: ['Governance', 'Signature Fundraiser'],
    committeeRoles: {},
    termStart: '2024-07',
    termEnd: '2027-07',
    status: 'active',
    bio: null,
    photoUrl: null,
  },
  {
    id: 'zachary-berger',
    firstName: 'Zachary',
    preferredName: 'Zach',
    lastName: 'Berger',
    title: null,
    organization: 'SeibertKeck Insurance Partners',
    phone: '330.606.3824',
    email: 'zberger@seibertkeck.com',
    committees: [],
    committeeRoles: {},
    termStart: '2025-04',
    termEnd: '2028-04',
    status: 'active',
    bio: null,
    photoUrl: null,
  },
  {
    id: 'sean-blasko',
    firstName: 'Sean',
    preferredName: null,
    lastName: 'Blasko',
    title: null,
    organization: 'Oatey Co.',
    phone: '330.958.4868',
    email: 'sblasko4868@gmail.com',
    committees: ['Finance', 'Strategy & Tracking'],
    committeeRoles: {},
    termStart: '2025-04',
    termEnd: '2028-04',
    status: 'active',
    bio: null,
    photoUrl: null,
  },
  {
    id: 'sarah-dave',
    firstName: 'Sarah',
    preferredName: null,
    lastName: 'Dave',
    title: null,
    organization: 'Parisleaf',
    phone: '417.343.3775',
    email: 'sarahnicoledave@gmail.com',
    committees: [],
    committeeRoles: {},
    termStart: '2025-04',
    termEnd: '2028-04',
    status: 'active',
    bio: null,
    photoUrl: null,
  },
  {
    id: 'byron-delpinal',
    firstName: 'Byron',
    preferredName: null,
    lastName: 'Delpinal',
    title: null,
    organization: 'Branding Brand',
    phone: '330.993.9543',
    email: 'byronddelpinal@gmail.com',
    committees: ['Governance', 'Web Planning'],
    committeeRoles: {},
    termStart: '2025-04',
    termEnd: '2028-04',
    status: 'active',
    bio: null,
    photoUrl: null,
  },
  {
    id: 'april-marx',
    firstName: 'April',
    preferredName: null,
    lastName: 'Marx',
    title: null,
    organization: 'FirstEnergy Service Company',
    phone: '440.478.0699',
    email: 'marxa@firstenergycorp.com',
    committees: ['Finance'],
    committeeRoles: {},
    termStart: '2024-04',
    termEnd: '2027-04',
    status: 'active',
    bio: null,
    photoUrl: null,
  },
  {
    id: 'travis-monty-bromer',
    firstName: 'Travis',
    preferredName: null,
    lastName: 'Monty-Bromer',
    title: null,
    organization: 'Stan Hywet Hall & Gardens',
    phone: '330.701.7510',
    email: 'bromertravis@gmail.com',
    committees: ['Signature Fundraiser', 'Donor Relations'],
    committeeRoles: {},
    termStart: '2025-04',
    termEnd: '2028-04',
    status: 'active',
    bio: null,
    photoUrl: null,
  },
  {
    id: 'trista-powers',
    firstName: 'Trista',
    preferredName: null,
    lastName: 'Powers',
    title: null,
    organization: 'Cuyahoga Community College',
    phone: '330.310.7153',
    email: 'tristalpowers@gmail.com',
    committees: ['Strategy & Tracking'],
    committeeRoles: {},
    termStart: '2022-04',
    termEnd: '2028-04',
    status: 'active',
    bio: null,
    photoUrl: null,
  },
  {
    id: 'diontae-smith',
    firstName: 'Diontae',
    preferredName: null,
    lastName: 'Smith',
    title: null,
    organization: 'PNC Bank',
    phone: '313.693.5138',
    email: 'diontae101@gmail.com',
    committees: ['Strategy & Tracking', 'Web Planning'],
    committeeRoles: {},
    termStart: '2025-04',
    termEnd: '2028-04',
    status: 'active',
    bio: null,
    photoUrl: null,
  },
  {
    id: 'kerri-stephen',
    firstName: 'Kerri',
    preferredName: null,
    lastName: 'Stephen',
    title: null,
    organization: 'Cleveland Clinic Foundation',
    phone: '440.571.0985',
    email: 'kerriastephen@gmail.com',
    committees: ['Strategy & Tracking'],
    committeeRoles: { 'Strategy & Tracking': 'Lead' },
    termStart: '2024-04',
    termEnd: '2027-04',
    status: 'active',
    bio: null,
    photoUrl: null,
  },
];

export default boardMembers;

// ── Derived helpers ──

/** Get display name: preferred name or first name */
export function displayName(member) {
  const first = member.preferredName || member.firstName;
  return `${first} ${member.lastName}`;
}

/** Get initials for avatar placeholder */
export function initials(member) {
  const first = member.preferredName || member.firstName;
  return `${first[0]}${member.lastName[0]}`.toUpperCase();
}

/** All unique committees across active members */
export function allCommittees(members = boardMembers) {
  const set = new Set();
  members.forEach(m => m.committees.forEach(c => set.add(c)));
  return [...set].sort();
}

/** Format term display */
export function termDisplay(member) {
  if (!member.termEnd) return 'Lifetime';
  const start = new Date(member.termStart + '-01');
  const end = new Date(member.termEnd + '-01');
  const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  return `${fmt(start)} \u2013 ${fmt(end)}`;
}

/** Check if term is expiring within N months */
export function isTermExpiringSoon(member, monthsAhead = 6) {
  if (!member.termEnd) return false;
  const end = new Date(member.termEnd + '-01');
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() + monthsAhead);
  return end <= cutoff;
}

/** Get committee role label if one exists */
export function committeeRole(member, committeeName) {
  return member.committeeRoles?.[committeeName] || null;
}

/** Officers first, then lifetime trustees, then alphabetical */
export function sortedMembers(members = boardMembers) {
  const officerOrder = ['President', 'Vice President', 'Treasurer', 'Secretary'];
  return [...members].sort((a, b) => {
    const aOfficer = officerOrder.indexOf(a.title);
    const bOfficer = officerOrder.indexOf(b.title);
    if (aOfficer !== -1 && bOfficer !== -1) return aOfficer - bOfficer;
    if (aOfficer !== -1) return -1;
    if (bOfficer !== -1) return 1;
    const aLifetime = !a.termEnd;
    const bLifetime = !b.termEnd;
    if (aLifetime && !bLifetime) return -1;
    if (!aLifetime && bLifetime) return 1;
    return a.lastName.localeCompare(b.lastName);
  });
}
