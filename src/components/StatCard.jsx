export default function StatCard({ icon: Icon, label, value, subtext, accent = 'teal' }) {
  const accentClasses = {
    teal: 'bg-teal-light text-teal',
    purple: 'bg-purple-light text-purple',
  };

  return (
    <div className="bg-white rounded-xl border border-border p-4 flex items-start gap-3">
      <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${accentClasses[accent]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-med-gray font-medium uppercase tracking-wide">{label}</p>
        <p className="text-xl font-bold text-dark mt-0.5 truncate">{value}</p>
        {subtext && <p className="text-xs text-med-gray mt-0.5">{subtext}</p>}
      </div>
    </div>
  );
}
