import { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { revenueExpenseData } from '../data/financials';

function formatDollar(value) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-border rounded-lg shadow-lg p-3 text-xs">
      <p className="font-semibold text-dark mb-1.5">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="flex items-center gap-1.5" style={{ color: entry.color }}>
          <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: entry.color }} />
          {entry.name}: {formatDollar(entry.value)}
        </p>
      ))}
    </div>
  );
}

export default function RevenueChart() {
  const data = useMemo(() => revenueExpenseData, []);

  return (
    <div className="bg-white rounded-xl border border-border p-4">
      <h3 className="text-sm font-semibold text-dark mb-4">Revenue vs. Expenses</h3>
      <div className="h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#666' }} />
            <YAxis tickFormatter={formatDollar} tick={{ fontSize: 11, fill: '#666' }} width={50} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
            />
            <Bar dataKey="revenue" name="Revenue" fill="#00A89D" radius={[3, 3, 0, 0]} />
            <Bar dataKey="expenses" name="Expenses" fill="#5B2D8E" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-med-gray mt-2">Source: IRS Form 990 filings, FY 2015–2024</p>
    </div>
  );
}
