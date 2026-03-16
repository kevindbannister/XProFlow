import type { PropsWithChildren } from 'react';
import { classNames } from '../../lib/utils';

type MainPanelProps = PropsWithChildren<{
  sidebarCollapsed: boolean;
}>;

const MainPanel = ({ children, sidebarCollapsed }: MainPanelProps) => {
  return (
    <main
      className={classNames(
        'flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden py-4 pr-4 transition-[padding] duration-200',
        sidebarCollapsed ? 'pl-2' : 'pl-4'
      )}
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-auto rounded-[16px] bg-white px-8 pt-8 shadow-page dark:bg-[#141d2c]">
        <div className="flex min-h-full flex-col pb-8">{children}</div>
      </div>
    </main>
  );
};

export default MainPanel;
