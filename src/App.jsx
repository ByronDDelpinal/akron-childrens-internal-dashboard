import { Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import PasswordGate from './components/PasswordGate';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Directory from './pages/Directory';
import Documents from './pages/Documents';
import Meetings from './pages/Meetings';
import MeetingDetail from './pages/MeetingDetail';
import Proposals from './pages/Proposals';
import ComingSoon from './pages/ComingSoon';

export default function App() {
  const { isAuthenticated, isLoading, error, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <PasswordGate onLogin={login} isLoading={isLoading} error={error} />;
  }

  return (
    <Routes>
      <Route element={<Layout onLogout={logout} />}>
        <Route index element={<Dashboard />} />
        <Route path="documents" element={<Documents />} />
        <Route path="meetings/:slug" element={<MeetingDetail />} />
        <Route path="meetings" element={<Meetings />} />
        <Route path="directory" element={<Directory />} />
        <Route path="proposals" element={<Proposals />} />
        <Route path="financials" element={<ComingSoon title="Financial Reports" />} />
        <Route path="*" element={<ComingSoon title="Page Not Found" />} />
      </Route>
    </Routes>
  );
}
