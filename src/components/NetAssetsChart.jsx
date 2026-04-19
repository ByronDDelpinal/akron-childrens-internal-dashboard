import { useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { netAssetsData } from '../data/financials';

function formatDollar(value) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-border rounded-lg shadow-lg p-3 text-xs">
      <p className="font-semibold text-dark mb-1">{label}</p>
      <p className="text-teal">Net Assets: {formatDollar(payload[0].value)}</p>
    </div>
  );
}

export default function NetAssetsChart() {
  const data = useMemo(() => netAssetsData, []);

  return (
    <div className="bg-white rounded-xl border border-border p-4">
      <h3 className="text-sm font-semibold text-dark mb-4">Net Assets Growth</h3>
      <div className="h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
            <defs>
              <linearGradient id="netAssetsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00A89D" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#00A89D" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#666' }} />
            <YAxis tickFormatter={formatDollar} tick={{ fontSize: 11, fill: '#666' }} width={50} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="netAssets"
              stroke="#00A89D"
              strokeWidth={2}
              fill="url(#netAssetsGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-med-gray mt-2">$116K → $1.28M over 10 years</p>
    </div>
  );
}
