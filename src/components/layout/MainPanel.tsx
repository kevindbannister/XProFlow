import type { PropsWithChildren } from 'react';

const MainPanel = ({ children }: PropsWithChildren) => {
  return (
    <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden py-4 pl-4">
      <div className="flex min-h-0 flex-1 flex-col overflow-auto rounded-l-[16px] bg-white px-8 pt-8 shadow-page dark:bg-[#141d2c]">
        <div className="flex min-h-full flex-col pb-8">{children}</div>
      </div>
    </main>
  );
};

export default MainPanel;
