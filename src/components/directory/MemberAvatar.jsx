import { initials } from '../../data/boardMembers';
import { colors } from '../../lib/tokens';

/**
 * Board member avatar. Shows photo if available, otherwise colored initials.
 * Color is deterministic based on the member's name so it's stable across renders.
 */

const accentPairs = [
  { bg: 'bg-teal-light', text: 'text-teal' },
  { bg: 'bg-purple-light', text: 'text-purple' },
  { bg: 'bg-orange/10', text: 'text-orange' },
  { bg: 'bg-blue/10', text: 'text-blue' },
  { bg: 'bg-pink/10', text: 'text-pink' },
  { bg: 'bg-green/10', text: 'text-green' },
];

function hashName(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

const sizeClasses = {
  sm: 'w-10 h-10 text-sm',
  md: 'w-14 h-14 text-lg',
  lg: 'w-20 h-20 text-2xl',
};

export default function MemberAvatar({ member, size = 'md' }) {
  const i = initials(member);
  const pair = accentPairs[hashName(member.lastName) % accentPairs.length];

  if (member.photoUrl) {
    return (
      <img
        src={member.photoUrl}
        alt={`${member.firstName} ${member.lastName}`}
        className={`${sizeClasses[size]} rounded-full object-cover`}
      />
    );
  }

  return (
    <div className={`${sizeClasses[size]} ${pair.bg} ${pair.text} rounded-full flex items-center justify-center font-bold shrink-0`}>
      {i}
    </div>
  );
}
