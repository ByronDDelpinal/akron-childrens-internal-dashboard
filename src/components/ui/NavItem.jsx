import { NavLink } from 'react-router-dom';
import Badge from './Badge';

/**
 * Single navigation item used in both desktop sidebar and mobile drawer.
 * Renders as a NavLink with active state styling and optional "coming soon" badge.
 */
export default function NavItem({ to, icon: Icon, label, comingSoon, onClick }) {
  return (
    <NavLink
      to={comingSoon ? '#' : to}
      onClick={(e) => {
        if (comingSoon) {
          e.preventDefault();
        } else if (onClick) {
          onClick();
        }
      }}
      className={({ isActive }) =>
        `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
          !comingSoon && isActive
            ? 'bg-teal-light text-teal font-medium'
            : comingSoon
              ? 'text-med-gray/50 cursor-default'
              : 'text-med-gray hover:bg-light-gray hover:text-dark'
        }`
      }
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span>{label}</span>
      {comingSoon && <Badge className="ml-auto">Soon</Badge>}
    </NavLink>
  );
}
