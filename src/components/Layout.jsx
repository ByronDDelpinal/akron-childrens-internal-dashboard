import { Outlet } from 'react-router-dom';
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
import NavItem from './ui/NavItem';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/documents', icon: FolderOpen, label: 'Documents', comingSoon: true },
  { to: '/meetings', icon: Calendar, label: 'Meetings', comingSoon: true },
  { to: '/directory', icon: Users, label: 'Directory', comingSoon: true },
  { to: '/financials', icon: BarChart3, label: 'Financials', comingSoon: true },
  { to: '/proposals', icon: FileText, label: 'Proposals', comingSoon: true },
];

function BrandMark() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-lg bg-purple flex items-center justify-center">
        <span className="text-white font-bold text-xs">ACM</span>
      </div>
    </div>
  );
}

function NavList({ onNavigate }) {
  return (
    <nav className="flex-1 flex flex-col gap-0.5">
      {navItems.map((item) => (
        <NavItem key={item.to} {...item} onClick={onNavigate} />
      ))}
    </nav>
  );
}

export default function Layout({ onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-svh flex flex-col">
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
          <BrandMark />
          <div className="hidden sm:block">
            <h1 className="text-sm font-semibold text-dark leading-tight">Board Portal</h1>
            <p className="text-xs text-med-gray leading-tight">Akron Children's Museum</p>
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
          <NavList />
        </aside>

        {/* Mobile drawer */}
        {mobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/30 z-30 lg:hidden"
              onClick={closeMobile}
            />
            <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white z-40 shadow-lg lg:hidden flex flex-col">
              <div className="rainbow-bar-thick" />
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <BrandMark />
                  <span className="font-semibold text-sm text-dark">Board Portal</span>
                </div>
                <button onClick={closeMobile} className="p-1.5 rounded-lg hover:bg-light-gray">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 p-3">
                <NavList onNavigate={closeMobile} />
              </div>
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
