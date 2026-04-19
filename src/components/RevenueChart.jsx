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
import Card from './ui/Card';
import ChartTooltip from './ui/ChartTooltip';
import { formatDollarCompact } from '../lib/formatters';
import { colors, neutrals, chartTheme } from '../lib/tokens';

/**
 * Bar chart comparing revenue and expenses over time.
 * Receives data as a prop — no direct data imports.
 */
export default function RevenueChart({ data, title = 'Revenue vs. Expenses', source }) {
  return (
    <Card>
      <h3 className="text-sm font-semibold text-dark mb-4">{title}</h3>
      <div className="h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={chartTheme.axisPadding}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridStroke} vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: chartTheme.tickSize, fill: chartTheme.tickFill }} />
            <YAxis tickFormatter={formatDollarCompact} tick={{ fontSize: chartTheme.tickSize, fill: chartTheme.tickFill }} width={chartTheme.yAxisWidth} />
            <Tooltip content={<ChartTooltip />} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
            />
            <Bar dataKey="revenue" name="Revenue" fill={chartTheme.primary} radius={chartTheme.barRadius} />
            <Bar dataKey="expenses" name="Expenses" fill={chartTheme.secondary} radius={chartTheme.barRadius} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {source && <p className="text-xs text-med-gray mt-2">{source}</p>}
    </Card>
  );
}
