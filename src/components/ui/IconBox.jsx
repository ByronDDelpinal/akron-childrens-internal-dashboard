/**
 * Colored icon container used in stat cards, meeting items, etc.
 * Provides consistent sizing and accent color mapping.
 */

const accentClasses = {
  teal: 'bg-teal-light text-teal',
  purple: 'bg-purple-light text-purple',
  orange: 'bg-orange/10 text-orange',
};

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
};

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
};

export default function IconBox({ icon: Icon, accent = 'teal', size = 'md', className = '' }) {
  return (
    <div className={`shrink-0 rounded-lg flex items-center justify-center ${sizeClasses[size]} ${accentClasses[accent]} ${className}`}>
      <Icon className={iconSizes[size]} />
    </div>
  );
}
