import { useState, useMemo } from 'react';
import { Search, Users, Filter } from 'lucide-react';
import MemberCard from '../components/directory/MemberCard';
import boardMembers, { sortedMembers, allCommittees, displayName } from '../data/boardMembers';

export default function Directory() {
  const [search, setSearch] = useState('');
  const [committeeFilter, setCommitteeFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const committees = useMemo(() => allCommittees(), []);

  const filteredMembers = useMemo(() => {
    let members = sortedMembers(boardMembers.filter(m => m.status === 'active'));

    // Committee filter
    if (committeeFilter !== 'all') {
      members = members.filter(m => m.committees.includes(committeeFilter));
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      members = members.filter(m =>
        displayName(m).toLowerCase().includes(q) ||
        m.organization.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.committees.some(c => c.toLowerCase().includes(q))
      );
    }

    return members;
  }, [search, committeeFilter]);

  const activeCount = boardMembers.filter(m => m.status === 'active').length;
  const officerCount = boardMembers.filter(m =>
    ['President', 'Vice President', 'Treasurer', 'Secretary'].includes(m.title) && m.status === 'active'
  ).length;

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-5">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-dark">Board Directory</h2>
          <p className="text-sm text-med-gray mt-0.5">
            {activeCount} active members · {officerCount} officers
          </p>
        </div>
      </div>

      {/* Search + Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-med-gray" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, organization, or committee..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-white
                       text-sm text-dark placeholder:text-med-gray
                       focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent
                       transition-all"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-med-gray pointer-events-none" />
          <select
            value={committeeFilter}
            onChange={(e) => setCommitteeFilter(e.target.value)}
            className="pl-9 pr-8 py-2.5 rounded-lg border border-border bg-white
                       text-sm text-dark appearance-none cursor-pointer
                       focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent
                       transition-all"
          >
            <option value="all">All Committees</option>
            {committees.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Member cards */}
      <div className="space-y-3">
        {filteredMembers.length > 0 ? (
          filteredMembers.map(member => (
            <MemberCard
              key={member.id}
              member={member}
              isExpanded={expandedId === member.id}
              onToggle={() => setExpandedId(expandedId === member.id ? null : member.id)}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <Users className="w-10 h-10 text-med-gray/40 mx-auto mb-3" />
            <p className="text-sm text-med-gray">No members match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
