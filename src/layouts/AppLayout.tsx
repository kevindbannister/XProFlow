import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import MainPanel from '../components/layout/MainPanel';

const AppLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div
      className="app-shell-surface flex h-screen overflow-hidden"
      style={{ fontFamily: 'system-ui, sans-serif' }}
    >
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapsed={() => setSidebarCollapsed((current) => !current)}
      />
      <MainPanel sidebarCollapsed={sidebarCollapsed}>
        <Outlet />
      </MainPanel>
    </div>
  );
};

export default AppLayout;
