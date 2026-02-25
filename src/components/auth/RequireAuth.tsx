import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AppLoadingScreen = () => (
  <div className="flex min-h-screen w-full items-center justify-center bg-slate-950 text-sm font-medium text-slate-100">
    Preparing workspace…
  </div>
);

const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { hasSession, isBootstrapping, profileReady } = useAuth();

  if (isBootstrapping || (hasSession && !profileReady)) {
    return <AppLoadingScreen />;
  }

  if (!hasSession) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export { AppLoadingScreen, RequireAuth };
