// Board member helper functions used by Directory and MemberCard.
// Actual member data is fetched from Supabase; seed data lives in
// supabase/migrations/002_seed_board_members.sql.

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

/** All unique committees across provided members */
export function allCommittees(members) {
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
export function sortedMembers(members) {
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
