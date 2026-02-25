import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const AppLoadingScreen = () => (
  <div className="flex min-h-screen w-full items-center justify-center bg-slate-950 text-sm font-medium text-slate-100">
    Preparing workspace…
  </div>
);

const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { loading, session, user } = useAppContext();

  if (loading) {
    return <AppLoadingScreen />;
  }

  if (!session || !user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export { AppLoadingScreen, RequireAuth };
