import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import MainPanel from '../components/layout/MainPanel';
import { SettingsModal } from '../components/settings/SettingsModal';

const AppLayout = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <div
        className="flex h-screen bg-surface-page"
        style={{ fontFamily: 'system-ui, sans-serif' }}
      >
        <Sidebar onOpenSettings={() => setSettingsOpen(true)} />
        <MainPanel>
          <Outlet />
        </MainPanel>
      </div>

      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
};

export default AppLayout;
