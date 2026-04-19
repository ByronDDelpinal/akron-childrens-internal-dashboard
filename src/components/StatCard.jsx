import IconBox from './ui/IconBox';

export default function StatCard({ icon, label, value, subtext, accent = 'teal' }) {
  return (
    <div className="bg-white rounded-xl border border-border p-4 flex items-start gap-3">
      <IconBox icon={icon} accent={accent} />
      <div className="min-w-0">
        <p className="text-xs text-med-gray font-medium uppercase tracking-wide">{label}</p>
        <p className="text-xl font-bold text-dark mt-0.5 truncate">{value}</p>
        {subtext && <p className="text-xs text-med-gray mt-0.5">{subtext}</p>}
      </div>
    </div>
  );
}
