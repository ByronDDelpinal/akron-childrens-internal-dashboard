import { displayName } from './boardMembers';

/**
 * Generate a vCard 3.0 string from a board member object.
 * Spec reference: https://datatracker.ietf.org/doc/html/rfc2426
 */
export function generateVCard(member) {
  const first = member.preferredName || member.firstName;
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${member.lastName};${first};;;`,
    `FN:${displayName(member)}`,
    `ORG:Akron Children's Museum${member.organization ? ' — ' + member.organization : ''}`,
  ];

  if (member.title) {
    lines.push(`TITLE:${member.title}`);
  }

  if (member.email) {
    lines.push(`EMAIL;TYPE=INTERNET:${member.email}`);
  }

  if (member.phone) {
    // Normalize phone: strip dots/dashes/parens/spaces for the TEL value
    const digits = member.phone.replace(/[^\d+]/g, '');
    lines.push(`TEL;TYPE=CELL:${digits}`);
  }

  if (member.committees.length > 0) {
    lines.push(`NOTE:Board committees: ${member.committees.join(', ')}`);
  }

  lines.push('END:VCARD');
  return lines.join('\r\n');
}

/**
 * Trigger a browser download of a vCard file for the given member.
 */
export function downloadVCard(member) {
  const vcf = generateVCard(member);
  const blob = new Blob([vcf], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const first = member.preferredName || member.firstName;
  const filename = `${first}_${member.lastName}.vcf`;

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
