import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import Card from './ui/Card';
import ChartTooltip from './ui/ChartTooltip';
import { formatDollarCompact } from '../lib/formatters';
import { chartTheme } from '../lib/tokens';

/**
 * Area chart showing net assets growth over time.
 * Receives data as a prop — no direct data imports.
 */
export default function NetAssetsChart({ data, title = 'Net Assets Growth', subtitle }) {
  return (
    <Card>
      <h3 className="text-sm font-semibold text-dark mb-4">{title}</h3>
      <div className="h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={chartTheme.axisPadding}>
            <defs>
              <linearGradient id="netAssetsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartTheme.primary} stopOpacity={0.2} />
                <stop offset="95%" stopColor={chartTheme.primary} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridStroke} vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: chartTheme.tickSize, fill: chartTheme.tickFill }} />
            <YAxis tickFormatter={formatDollarCompact} tick={{ fontSize: chartTheme.tickSize, fill: chartTheme.tickFill }} width={chartTheme.yAxisWidth} />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="monotone"
              dataKey="netAssets"
              name="Net Assets"
              stroke={chartTheme.primary}
              strokeWidth={2}
              fill="url(#netAssetsGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {subtitle && <p className="text-xs text-med-gray mt-2">{subtitle}</p>}
    </Card>
  );
}
