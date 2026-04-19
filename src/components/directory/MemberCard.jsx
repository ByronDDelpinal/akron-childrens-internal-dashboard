import { Mail, Phone, Building2, Clock } from 'lucide-react';
import MemberAvatar from './MemberAvatar';
import Badge from '../ui/Badge';
import { displayName, termDisplay, isTermExpiringSoon, committeeRole } from '../../data/boardMembers';

/**
 * Expandable board member card.
 * Shows summary by default, expands to show full contact and term info.
 */
export default function MemberCard({ member, isExpanded, onToggle }) {
  const name = displayName(member);
  const isOfficer = ['President', 'Vice President', 'Treasurer', 'Secretary'].includes(member.title);
  const isLifetime = !member.termEnd;
  const expiringSoon = isTermExpiringSoon(member);

  return (
    <div
      className="bg-white rounded-xl border border-border overflow-hidden transition-shadow hover:shadow-sm"
    >
      {/* Summary row — always visible */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 text-left"
      >
        <MemberAvatar member={member} size="md" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-dark">{name}</p>
            {isOfficer && <Badge variant="info">{member.title}</Badge>}
            {isLifetime && !isOfficer && <Badge variant="success">Lifetime</Badge>}
            {expiringSoon && <Badge variant="important">Term ending</Badge>}
          </div>
          <p className="text-xs text-med-gray mt-0.5 truncate">{member.organization}</p>
          {member.committees.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {member.committees.map(c => {
                const role = committeeRole(member, c);
                return (
                  <span key={c} className="text-[10px] text-med-gray bg-light-gray px-1.5 py-0.5 rounded">
                    {c}{role ? ` (${role})` : ''}
                  </span>
                );
              })}
            </div>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-med-gray shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded detail */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-0 border-t border-border/50 space-y-2.5">
          {member.bio && (
            <p className="text-xs text-med-gray leading-relaxed pt-3">{member.bio}</p>
          )}
          <div className="flex flex-col gap-2 pt-2">
            <a
              href={`mailto:${member.email}`}
              className="flex items-center gap-2 text-xs text-teal hover:text-teal-dark transition-colors"
            >
              <Mail className="w-3.5 h-3.5 shrink-0" />
              {member.email}
            </a>
            <a
              href={`tel:${member.phone.replace(/\./g, '')}`}
              className="flex items-center gap-2 text-xs text-teal hover:text-teal-dark transition-colors"
            >
              <Phone className="w-3.5 h-3.5 shrink-0" />
              {member.phone}
            </a>
            <span className="flex items-center gap-2 text-xs text-med-gray">
              <Building2 className="w-3.5 h-3.5 shrink-0" />
              {member.organization}
            </span>
            <span className="flex items-center gap-2 text-xs text-med-gray">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              Term: {termDisplay(member)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
