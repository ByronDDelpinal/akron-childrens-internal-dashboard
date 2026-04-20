import { useState } from 'react';
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
import UpdatesList from '../components/UpdatesList';
import AddAnnouncementForm from '../components/AddAnnouncementForm';
import { revenueExpenseData, netAssetsData, currentYear, fiscalYears } from '../data/financials';
import { useMeetings } from '../hooks/useMeetings';
import { useAnnouncements } from '../hooks/useAnnouncements';
import { useUpdates } from '../hooks/useUpdates';
import { upcomingMeetings, timeDisplay } from '../data/meetings';
import { formatDollarDetail, formatNumber } from '../lib/formatters';

export default function Dashboard() {
  const { meetings } = useMeetings();
  const { announcements, refetch: refetchAnnouncements } = useAnnouncements();
  const { updates } = useUpdates(5);
  const [showAddAnnouncement, setShowAddAnnouncement] = useState(false);

  const upcoming = upcomingMeetings(meetings).slice(0, 4);
  const enriched = upcoming.map(m => ({
    ...m,
    time: timeDisplay(m),
  }));

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
      {/* Page header */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-dark">Dashboard</h2>
        <p className="text-sm text-med-gray mt-0.5">
          Financial data sourced from IRS Form 990 filings
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatCard icon={DollarSign} label="Revenue" value={formatDollarDetail(currentYear.revenue)} subtext={currentYear.fyFull} />
        <StatCard icon={TrendingUp} label="Net Assets" value={formatDollarDetail(currentYear.netAssets)} subtext={`+${Math.round(((currentYear.netAssets - fiscalYears[0].netAssets) / fiscalYears[0].netAssets) * 100).toLocaleString()}% since ${fiscalYears[0].fy}`} accent="purple" />
        <StatCard icon={Building2} label="Total Assets" value={formatDollarDetail(currentYear.assets)} subtext={currentYear.fyFull} />
        <StatCard icon={Users} label="Employees" value={formatNumber(currentYear.employees)} subtext={currentYear.fyFull} />
        <StatCard icon={Heart} label="Volunteers" value={formatNumber(currentYear.volunteers)} subtext={currentYear.fyFull} accent="purple" />
        <StatCard icon={Ticket} label="Visitors" value={formatNumber(currentYear.visitors)} subtext={currentYear.fyFull} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RevenueChart
          data={revenueExpenseData}
          source="Source: IRS Form 990 filings, FY 2015–2024"
        />
        <NetAssetsChart
          data={netAssetsData}
          subtitle="$116K → $1.28M over 10 years"
        />
      </div>

      {/* Meetings + Announcements + Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <MeetingsList meetings={enriched} />
        <AnnouncementsList
          announcements={announcements}
          onAdd={() => setShowAddAnnouncement(true)}
        />
        <UpdatesList updates={updates} />
      </div>

      {/* Add Announcement slide-over */}
      {showAddAnnouncement && (
        <AddAnnouncementForm
          onClose={() => setShowAddAnnouncement(false)}
          onSuccess={refetchAnnouncements}
        />
      )}
    </div>
  );
}
