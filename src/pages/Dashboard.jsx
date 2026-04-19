import {
  DollarSign,
  TrendingUp,
  Users,
  Heart,
  Ticket,
  Building2,
} from 'lucide-react';
import StatCard from '../components/StatCard';
import RevenueChart from '../components/RevenueChart';
import NetAssetsChart from '../components/NetAssetsChart';
import MeetingsList from '../components/MeetingsList';
import AnnouncementsList from '../components/AnnouncementsList';
import { quickStats } from '../data/dashboard';

function fmt(n) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

function fmtNum(n) {
  return n.toLocaleString('en-US');
}

export default function Dashboard() {
  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
      {/* Page header */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-dark">Dashboard</h2>
        <p className="text-sm text-med-gray mt-0.5">
          Overview based on the most recent filing ({quickStats.fiscalYear})
        </p>
      </div>

      {/* Stat cards — 2 cols on mobile, 3 on tablet, 6 on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatCard icon={DollarSign} label="Revenue" value={fmt(quickStats.currentFYRevenue)} subtext={quickStats.fiscalYear} />
        <StatCard icon={TrendingUp} label="Net Assets" value={fmt(quickStats.netAssets)} subtext="+1,002% since FY15" accent="purple" />
        <StatCard icon={Building2} label="Total Assets" value={fmt(quickStats.totalAssets)} subtext={quickStats.fiscalYear} />
        <StatCard icon={Users} label="Employees" value={fmtNum(quickStats.employees)} subtext={quickStats.fiscalYear} />
        <StatCard icon={Heart} label="Volunteers" value={fmtNum(quickStats.volunteers)} subtext="4× prior year" accent="purple" />
        <StatCard icon={Ticket} label="Visitors" value={fmtNum(quickStats.visitors)} subtext={quickStats.fiscalYear} />
      </div>

      {/* Charts — stacked on mobile, side by side on larger screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RevenueChart />
        <NetAssetsChart />
      </div>

      {/* Meetings + Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MeetingsList />
        <AnnouncementsList />
      </div>
    </div>
  );
}
