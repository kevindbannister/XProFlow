import { useEffect, type ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import { useAuth } from './context/AuthContext';
import EmailSetup from './pages/EmailSetup';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AuthCallback from './pages/AuthCallback';
import Onboarding from './pages/Onboarding';
import ProfilePage from './pages/ProfilePage';
import ProfessionalContextOnboarding from './pages/onboarding/ProfessionalContextOnboarding';
import Inbox from './pages/Inbox';
import Billing from './pages/Billing';
import { applyThemeMode, getInitialThemeMode } from './lib/theme';
import { AppLoadingScreen, RequireAuth } from './components/auth/RequireAuth';
import DashboardPage from './pages/control-center/DashboardPage';
import CategorisationPage from './pages/control-center/CategorisationPage';
import RulesPage from './pages/control-center/RulesPage';
import DraftingPage from './pages/control-center/DraftingPage';
import WritingStylePage from './pages/control-center/WritingStylePage';
import SignaturePage from './pages/control-center/SignaturePage';
import SchedulingPage from './pages/control-center/SchedulingPage';
import IntegrationsPage from './pages/control-center/IntegrationsPage';
import ProfessionalContextPage from './pages/control-center/ProfessionalContextPage';
import AccountPage from './pages/control-center/AccountPage';

const AppBootGate = ({ children }: { children: ReactNode }) => {
  const { isBootstrapping } = useAuth();
  if (isBootstrapping) return <AppLoadingScreen />;
  return <>{children}</>;
};

const RequireProductAccess = ({ children }: { children: ReactNode }) => {
  const { hasAppAccess } = useAuth();
  if (!hasAppAccess) return <Navigate to="/billing" replace />;
  return <>{children}</>;
};

const App = () => {
  const { isAuthenticated, hasSession } = useAuth();

  useEffect(() => {
    applyThemeMode(isAuthenticated ? getInitialThemeMode() : 'light', false);
  }, [isAuthenticated]);

  return (
    <AppBootGate>
      <Routes>
        <Route path="login" element={hasSession ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="signup" element={hasSession ? <Navigate to="/dashboard" replace /> : <Signup />} />
        <Route path="auth/callback" element={<AuthCallback />} />
        <Route element={<RequireAuth><AppLayout /></RequireAuth>}>
          <Route path="billing" element={<Billing />} />
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<RequireProductAccess><DashboardPage /></RequireProductAccess>} />
          <Route path="categorisation" element={<RequireProductAccess><CategorisationPage /></RequireProductAccess>} />
          <Route path="rules" element={<RequireProductAccess><RulesPage /></RequireProductAccess>} />
          <Route path="drafting" element={<RequireProductAccess><DraftingPage /></RequireProductAccess>} />
          <Route path="writing-style" element={<RequireProductAccess><WritingStylePage /></RequireProductAccess>} />
          <Route path="signature" element={<RequireProductAccess><SignaturePage /></RequireProductAccess>} />
          <Route path="scheduling" element={<RequireProductAccess><SchedulingPage /></RequireProductAccess>} />
          <Route path="integrations" element={<RequireProductAccess><IntegrationsPage /></RequireProductAccess>} />
          <Route path="professional-context" element={<RequireProductAccess><ProfessionalContextPage /></RequireProductAccess>} />
          <Route path="account" element={<RequireProductAccess><AccountPage /></RequireProductAccess>} />

          <Route path="home" element={<Navigate to="/dashboard" replace />} />
          <Route path="inbox" element={<RequireProductAccess><Inbox /></RequireProductAccess>} />
          <Route path="email-setup" element={<RequireProductAccess><EmailSetup /></RequireProductAccess>} />
          <Route path="onboarding" element={<RequireProductAccess><Onboarding /></RequireProductAccess>} />
          <Route path="onboarding/professional-context" element={<RequireProductAccess><ProfessionalContextOnboarding /></RequireProductAccess>} />
          <Route path="profile" element={<RequireProductAccess><ProfilePage /></RequireProductAccess>} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </AppBootGate>
  );
};

export default App;
