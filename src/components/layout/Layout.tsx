import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AppLogo from '../branding/AppLogo';
import PrimaryNav, { type SelectedModule } from './PrimaryNav';
import SecondaryNav from './SecondaryNav';

const Layout = () => {
  const [selectedModule, setSelectedModule] = useState<SelectedModule>('email');
  const [selectedItems, setSelectedItems] = useState<Record<SelectedModule, string>>({
    email: 'dashboard',
    voice: 'overview',
    letters: 'overview'
  });

  const handleSelectItem = (module: SelectedModule, itemId: string) => {
    setSelectedItems((current) => ({
      ...current,
      [module]: itemId
    }));
  };

  return (
    <div className="app-shell-surface relative flex h-screen overflow-hidden">
      <div
        className="pointer-events-none absolute left-0 top-0 z-10 flex h-16 items-center border-b border-slate-200/70 bg-white/90 px-4 dark:border-slate-800 dark:bg-[#101826]/90"
        style={{ width: 'calc(var(--rail-width, 48px) + var(--sidebar-width, 200px))' }}
      >
        <AppLogo className="h-7 w-auto" />
      </div>
      <PrimaryNav selectedModule={selectedModule} onSelectModule={setSelectedModule} />
      <SecondaryNav
        selectedModule={selectedModule}
        selectedItems={selectedItems}
        onSelectItem={handleSelectItem}
      />
      <main className="xp-main min-w-0 flex-1 overflow-auto p-4">
        <div className="flex min-h-full flex-col overflow-hidden rounded-[16px] bg-white shadow-page dark:bg-[#141d2c]">
          <div className="min-h-0 flex-1 overflow-auto px-8 py-8">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
