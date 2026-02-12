import { useEffect, type ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import { useAuth } from './context/AuthContext';
import { supabase } from './lib/supabaseClient';
import EmailSetup from './pages/EmailSetup';
import Integrations from './pages/Integrations';
import Labels from './pages/Labels';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import ProfilePage from './pages/ProfilePage';
import Rules from './pages/Rules';
import Settings from './pages/Settings';
import SettingsDrafts from './pages/SettingsDrafts';
import Workflows from './pages/Workflows';
import Inbox from './pages/Inbox';

const AppLoadingScreen = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-center text-slate-100">
    <div>
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">XProFlow</p>
      <p className="mt-3 text-base text-slate-200">Preparing your workspace…</p>
    </div>
  </div>
);

const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return <AppLoadingScreen />;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App = () => {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        supabase.auth.setSession(data.session);
      }
    });
  }, []);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        supabase.auth.setSession(session);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <Routes>
      <Route
        path="login"
        element={
          isLoading ? (
            <AppLoadingScreen />
          ) : isAuthenticated ? (
            <Navigate to="/inbox" replace />
          ) : (
            <Login />
          )
        }
      />
      <Route path="auth/callback" element={<AuthCallback />} />
      <Route
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/inbox" replace />} />
        <Route path="inbox" element={<Inbox />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="email-setup" element={<EmailSetup />} />
        <Route path="onboarding" element={<Onboarding />} />
        <Route path="labels" element={<Labels />} />
        <Route path="rules" element={<Rules />} />
        <Route path="integrations" element={<Integrations />} />
        <Route path="workflows" element={<Workflows />} />
        <Route path="settings" element={<Settings />} />
        <Route path="settings/drafts" element={<SettingsDrafts />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/inbox" replace />} />
      </Route>
    </Routes>
  );
};

export default App;
