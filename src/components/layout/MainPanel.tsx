import type { PropsWithChildren } from 'react';

const MainPanel = ({ children }: PropsWithChildren) => {
  return (
    <main className="flex min-w-0 flex-1 flex-col py-3">
      <div className="flex min-h-0 flex-1 flex-col overflow-auto rounded-l-[16px] bg-white px-6 pt-6 shadow-page">
        <div className="flex min-h-full flex-col pb-6">{children}</div>
      </div>
    </main>
  );
};

export default MainPanel;
