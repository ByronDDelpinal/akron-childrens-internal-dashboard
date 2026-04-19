// All data sourced from IRS Form 990 / 990-EZ filings, FY 2015–2024
// Tax years ending June 30 of each year

export const fiscalYears = [
  { fy: "FY15", fyFull: "FY 2015", form: "990-EZ", revenue: 128392, expenses: 28844,  assets: 117445, liabilities: 1417,    netAssets: 116028,  employees: 0,  volunteers: null, board: null, salaries: 0,      programExp: null,   visitors: 10000 },
  { fy: "FY16", fyFull: "FY 2016", form: "990",    revenue: 291368, expenses: 152678, assets: 411451, liabilities: 157733,  netAssets: 253718,  employees: 6,  volunteers: 18,   board: 12, salaries: 54568,   programExp: 116432, visitors: null },
  { fy: "FY17", fyFull: "FY 2017", form: "990",    revenue: 583215, expenses: 239296, assets: 656982, liabilities: 59345,   netAssets: 597637,  employees: 18, volunteers: 18,   board: 14, salaries: 166950,  programExp: 210017, visitors: null },
  { fy: "FY18", fyFull: "FY 2018", form: "990",    revenue: 529250, expenses: 427308, assets: 722644, liabilities: 23026,   netAssets: 699618,  employees: 27, volunteers: 100,  board: 15, salaries: 296883,  programExp: 262042, visitors: 124400 },
  { fy: "FY19", fyFull: "FY 2019", form: "990",    revenue: 510254, expenses: 491607, assets: 727341, liabilities: 8876,    netAssets: 718465,  employees: 18, volunteers: 100,  board: 19, salaries: 311450,  programExp: 338852, visitors: 143000 },
  { fy: "FY20", fyFull: "FY 2020", form: "990",    revenue: 494250, expenses: 392843, assets: 912077, liabilities: 91995,   netAssets: 820082,  employees: 14, volunteers: 84,   board: 18, salaries: 164202,  programExp: 286452, visitors: null },
  { fy: "FY21", fyFull: "FY 2021", form: "990",    revenue: 547024, expenses: 361299, assets: 1106275, liabilities: 100468, netAssets: 1005807, employees: 15, volunteers: 85,   board: 13, salaries: 176802,  programExp: 224754, visitors: null },
  { fy: "FY22", fyFull: "FY 2022", form: "990",    revenue: 741593, expenses: 545357, assets: 1306600, liabilities: 104557, netAssets: 1202043, employees: 19, volunteers: 166,  board: 15, salaries: 310648,  programExp: 400003, visitors: null },
  { fy: "FY23", fyFull: "FY 2023", form: "990",    revenue: 764282, expenses: 712526, assets: 1345445, liabilities: 91276,  netAssets: 1254169, employees: 25, volunteers: 166,  board: 16, salaries: 355515,  programExp: 535000, visitors: 45334 },
  { fy: "FY24", fyFull: "FY 2024", form: "990",    revenue: 853238, expenses: 829191, assets: 1379698, liabilities: 100553, netAssets: 1279145, employees: 26, volunteers: 622,  board: 10, salaries: 447790,  programExp: 629332, visitors: 44179 },
];

// Derived: current year (latest filing)
export const currentYear = fiscalYears[fiscalYears.length - 1];

// Derived: chart-ready data for revenue vs expenses
export const revenueExpenseData = fiscalYears.map(y => ({
  name: y.fy,
  revenue: y.revenue,
  expenses: y.expenses,
  net: y.revenue - y.expenses,
}));

// Derived: net assets over time
export const netAssetsData = fiscalYears.map(y => ({
  name: y.fy,
  netAssets: y.netAssets,
}));

// Derived: staffing over time
export const staffingData = fiscalYears.filter(y => y.employees !== null).map(y => ({
  name: y.fy,
  employees: y.employees,
  volunteers: y.volunteers || 0,
}));
