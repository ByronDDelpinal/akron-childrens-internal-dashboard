import { NavLink, Outlet } from 'react-router-dom';
import { useState } from 'react';
import {
  LayoutDashboard,
  FolderOpen,
  Calendar,
  Users,
  BarChart3,
  FileText,
  Menu,
  X,
  LogOut,
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/documents', icon: FolderOpen, label: 'Documents', comingSoon: true },
  { to: '/meetings', icon: Calendar, label: 'Meetings', comingSoon: true },
  { to: '/directory', icon: Users, label: 'Directory', comingSoon: true },
  { to: '/financials', icon: BarChart3, label: 'Financials', comingSoon: true },
  { to: '/proposals', icon: FileText, label: 'Proposals', comingSoon: true },
];

export default function Layout({ onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-svh flex flex-col">
      {/* Top rainbow bar */}
      <div className="rainbow-bar" />

      {/* Header */}
      <header className="bg-white border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 -ml-1.5 rounded-lg hover:bg-light-gray transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple flex items-center justify-center">
              <span className="text-white font-bold text-xs">ACM</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-semibold text-dark leading-tight">Board Portal</h1>
              <p className="text-xs text-med-gray leading-tight">Akron Children's Museum</p>
            </div>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 text-xs text-med-gray hover:text-dark
                     px-2.5 py-1.5 rounded-lg hover:bg-light-gray transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </header>

      <div className="flex-1 flex">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex flex-col w-56 bg-white border-r border-border p-3 gap-1">
          <nav className="flex-1 flex flex-col gap-0.5">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.comingSoon ? '#' : item.to}
                onClick={(e) => item.comingSoon && e.preventDefault()}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                    !item.comingSoon && isActive
                      ? 'bg-teal-light text-teal font-medium'
                      : item.comingSoon
                        ? 'text-med-gray/50 cursor-default'
                        : 'text-med-gray hover:bg-light-gray hover:text-dark'
                  }`
                }
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
                {item.comingSoon && (
                  <span className="ml-auto text-[10px] bg-light-gray text-med-gray px-1.5 py-0.5 rounded-full">
                    Soon
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/30 z-30 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white z-40 shadow-lg lg:hidden flex flex-col">
              <div className="rainbow-bar-thick" />
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple flex items-center justify-center">
                    <span className="text-white font-bold text-xs">ACM</span>
                  </div>
                  <span className="font-semibold text-sm text-dark">Board Portal</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-light-gray"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 p-3 flex flex-col gap-0.5">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.comingSoon ? '#' : item.to}
                    onClick={(e) => {
                      if (item.comingSoon) {
                        e.preventDefault();
                      } else {
                        setMobileMenuOpen(false);
                      }
                    }}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        !item.comingSoon && isActive
                          ? 'bg-teal-light text-teal font-medium'
                          : item.comingSoon
                            ? 'text-med-gray/50 cursor-default'
                            : 'text-med-gray hover:bg-light-gray hover:text-dark'
                      }`
                    }
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                    {item.comingSoon && (
                      <span className="ml-auto text-[10px] bg-light-gray text-med-gray px-1.5 py-0.5 rounded-full">
                        Soon
                      </span>
                    )}
                  </NavLink>
                ))}
              </nav>
            </aside>
          </>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
