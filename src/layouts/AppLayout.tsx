import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Mail, Mic, PenTool } from 'lucide-react';
import AppLogo from '../components/branding/AppLogo';
import EmailSidebar from '../components/layout/EmailSidebar';
import LetterSidebar from '../components/layout/LetterSidebar';
import MainPanel from '../components/layout/MainPanel';
import VoiceSidebar from '../components/layout/VoiceSidebar';
import { classNames } from '../lib/utils';

type WorkspaceMode = 'email' | 'letter' | 'voice';

const workspaceModes: Array<{ id: WorkspaceMode; label: string; icon: typeof Mail }> = [
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'letter', label: 'Letter', icon: PenTool },
  { id: 'voice', label: 'Voice', icon: Mic }
];

const AppLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [workspaceMode, setWorkspaceMode] = useState<WorkspaceMode>('email');

  const renderSidebar = () => {
    if (workspaceMode === 'letter') {
      return (
        <LetterSidebar
          isCollapsed={sidebarCollapsed}
          onToggleCollapsed={() => setSidebarCollapsed((current) => !current)}
        />
      );
    }

    if (workspaceMode === 'voice') {
      return (
        <VoiceSidebar
          isCollapsed={sidebarCollapsed}
          onToggleCollapsed={() => setSidebarCollapsed((current) => !current)}
        />
      );
    }

    return (
      <EmailSidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapsed={() => setSidebarCollapsed((current) => !current)}
      />
    );
  };

  return (
    <div
      className="app-shell-surface flex h-screen overflow-hidden"
      style={{ fontFamily: 'system-ui, sans-serif' }}
    >
      <div
        className={classNames(
          'flex h-full flex-col pb-4 pl-2 pr-3 pt-4 transition-[width] duration-200',
          sidebarCollapsed ? 'w-[70px] min-w-[70px]' : 'w-[214px] min-w-[214px]'
        )}
      >
        <div className={classNames('mb-4', sidebarCollapsed ? 'flex justify-center px-0' : 'px-2')}>
          <AppLogo className="h-8 w-auto" />
        </div>

        <div
          className={classNames(
            'mb-3 grid gap-0',
            sidebarCollapsed ? 'grid-cols-1' : 'grid-cols-1'
          )}
        >
          {workspaceModes.map((mode) => {
            const Icon = mode.icon;
            const isActive = mode.id === workspaceMode;

            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setWorkspaceMode(mode.id)}
                className={classNames(
                  'flex h-9 items-center rounded-[12px] px-3 text-sm font-semibold transition',
                  sidebarCollapsed ? 'justify-center px-0' : 'justify-start gap-2',
                  isActive
                    ? 'bg-[#0F1724] text-white dark:bg-white dark:text-[#0F1724]'
                    : 'bg-white/70 text-content-secondary hover:bg-white dark:bg-[#111926] dark:text-[#B8C4D6] dark:hover:bg-[#1B2636]'
                )}
                aria-label={mode.label}
                title={sidebarCollapsed ? mode.label : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={1.8} />
                {!sidebarCollapsed ? <span>{mode.label}</span> : null}
              </button>
            );
          })}
        </div>

        <div className="min-h-0 flex-1">
          {renderSidebar()}
        </div>
      </div>
      <MainPanel sidebarCollapsed={sidebarCollapsed}>
        <Outlet />
      </MainPanel>
    </div>
  );
};

export default AppLayout;
