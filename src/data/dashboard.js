// Mock dashboard data — will be replaced by Supabase queries

export const upcomingMeetings = [
  {
    id: 1,
    title: "Full Board Meeting",
    date: "2026-05-14",
    time: "11:30 AM – 1:00 PM",
    location: "Akron Children's Museum – Community Room",
    type: "board",
  },
  {
    id: 2,
    title: "Finance Committee",
    date: "2026-05-07",
    time: "12:00 PM – 1:00 PM",
    location: "Virtual (Zoom)",
    type: "committee",
  },
  {
    id: 3,
    title: "Fundraising Committee",
    date: "2026-05-20",
    time: "10:00 AM – 11:00 AM",
    location: "Virtual (Zoom)",
    type: "committee",
  },
  {
    id: 4,
    title: "Full Board Meeting",
    date: "2026-07-09",
    time: "11:30 AM – 1:00 PM",
    location: "Akron Children's Museum – Community Room",
    type: "board",
  },
];

export const announcements = [
  {
    id: 1,
    title: "Expansion Phase 2 Feasibility Study",
    summary: "The Executive Committee has approved a feasibility study for a potential second-floor buildout. More details at the May board meeting.",
    date: "2026-04-15",
    priority: "high",
  },
  {
    id: 2,
    title: "Annual Report Draft Ready for Review",
    summary: "The FY 2025 annual report draft is available in the document library. Board feedback is requested by May 1.",
    date: "2026-04-10",
    priority: "normal",
  },
  {
    id: 3,
    title: "InventHers Program Renewed with Goodyear",
    summary: "Goodyear has confirmed sponsorship renewal for the InventHers STEM program through FY 2027.",
    date: "2026-04-02",
    priority: "normal",
  },
];

export const quickStats = {
  currentFYRevenue: 853238,
  currentFYExpenses: 829191,
  totalAssets: 1379698,
  netAssets: 1279145,
  employees: 26,
  volunteers: 622,
  visitors: 44179,
  boardMembers: 10,
  fiscalYear: "FY 2024",
};
