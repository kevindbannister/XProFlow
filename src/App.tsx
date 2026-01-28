import type { ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import { useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import EmailSetup from './pages/EmailSetup';
import Integrations from './pages/Integrations';
import Labels from './pages/Labels';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import UserProfile from './pages/UserProfile';
import Rules from './pages/Rules';
import Settings from './pages/Settings';
import SettingsDrafts from './pages/SettingsDrafts';
import Workflows from './pages/Workflows';

const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        element={
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="email-setup" element={<EmailSetup />} />
        <Route path="onboarding" element={<Onboarding />} />
        <Route path="labels" element={<Labels />} />
        <Route path="rules" element={<Rules />} />
        <Route path="integrations" element={<Integrations />} />
        <Route path="workflows" element={<Workflows />} />
        <Route path="settings" element={<Settings />} />
        <Route path="settings/drafts" element={<SettingsDrafts />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default App;
