import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import { useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import EmailSetup from './pages/EmailSetup';
import Login from './pages/Login';
import Settings from './pages/Settings';
import SettingsDrafts from './pages/SettingsDrafts';
import UserProfile from './pages/UserProfile';

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
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
        <Route path="settings" element={<Settings />} />
        <Route path="settings/drafts" element={<SettingsDrafts />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default App;
