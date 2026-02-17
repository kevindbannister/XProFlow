import { useEffect, type ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import { useAuth } from './context/AuthContext';
import { supabase } from './lib/supabaseClient';
import EmailSetup from './pages/EmailSetup';
import Integrations from './pages/Integrations';
import Labels from './pages/Labels';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AuthCallback from './pages/AuthCallback';
import Onboarding from './pages/Onboarding';
import ProfilePage from './pages/ProfilePage';
import Rules from './pages/Rules';
import Settings from './pages/Settings';
import SettingsDrafts from './pages/SettingsDrafts';
import Workflows from './pages/Workflows';
import Inbox from './pages/Inbox';
import Dashboard from './pages/Dashboard';
import Billing from './pages/Billing';
import { applyThemeMode, getInitialThemeMode } from './lib/theme';

const AppLoadingScreen = () => <div className="flex min-h-screen items-center justify-center">Preparing workspace…</div>;

const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <AppLoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const RequireProductAccess = ({ children }: { children: ReactNode }) => {
  const { hasAppAccess } = useAuth();
  if (!hasAppAccess) return <Navigate to="/billing" replace />;
  return <>{children}</>;
};

const App = () => {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    applyThemeMode(isAuthenticated ? getInitialThemeMode() : 'light', false);
  }, [isAuthenticated]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) supabase.auth.setSession(data.session);
    });
  }, []);

  return (
    <Routes>
      <Route path="login" element={isLoading ? <AppLoadingScreen /> : isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="signup" element={isLoading ? <AppLoadingScreen /> : isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup />} />
      <Route path="auth/callback" element={<AuthCallback />} />
      <Route element={<RequireAuth><AppLayout /></RequireAuth>}>
        <Route path="billing" element={<Billing />} />
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="inbox" element={<RequireProductAccess><Inbox /></RequireProductAccess>} />
        <Route path="dashboard" element={<RequireProductAccess><Dashboard /></RequireProductAccess>} />
        <Route path="email-setup" element={<RequireProductAccess><EmailSetup /></RequireProductAccess>} />
        <Route path="onboarding" element={<RequireProductAccess><Onboarding /></RequireProductAccess>} />
        <Route path="labels" element={<RequireProductAccess><Labels /></RequireProductAccess>} />
        <Route path="rules" element={<RequireProductAccess><Rules /></RequireProductAccess>} />
        <Route path="integrations" element={<RequireProductAccess><Integrations /></RequireProductAccess>} />
        <Route path="workflows" element={<RequireProductAccess><Workflows /></RequireProductAccess>} />
        <Route path="settings" element={<RequireProductAccess><Settings /></RequireProductAccess>} />
        <Route path="settings/drafts" element={<RequireProductAccess><SettingsDrafts /></RequireProductAccess>} />
        <Route path="profile" element={<RequireProductAccess><ProfilePage /></RequireProductAccess>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default App;
