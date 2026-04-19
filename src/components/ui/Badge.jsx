/**
 * Small inline label used for status indicators, tags, and priority markers.
 */

const variants = {
  default: 'bg-light-gray text-med-gray',
  important: 'bg-orange/10 text-orange',
  success: 'bg-teal-light text-teal',
  info: 'bg-purple-light text-purple',
};

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span className={`inline-flex items-center text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
