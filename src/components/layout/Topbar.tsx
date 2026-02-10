import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { TopStatsPills } from '../ui/TopStatsPills';

type TopbarProps = {
  title?: string;
};

const Topbar = ({ title }: TopbarProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const topStats = {
    emailsProcessed: '1,284',
    timeSaved: '14h 32m',
    costSaved: '£1,284',
  };

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/login', { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="topbar-surface flex items-center justify-between border-b px-8 py-4">
      <div className="theme-text-primary text-lg font-semibold">{title}</div>
      <div className="flex items-center gap-3">
        <TopStatsPills stats={topStats} />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => void handleLogout()}
          disabled={isLoggingOut}
          aria-label="Log out"
        >
          {isLoggingOut ? 'Logging out…' : 'Logout'}
        </Button>
      </div>
    </header>
  );
};

export default Topbar;
