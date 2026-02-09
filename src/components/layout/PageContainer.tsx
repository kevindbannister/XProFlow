import type { ReactNode } from 'react';
import { classNames } from '../../lib/utils';

type PageContainerProps = {
  children: ReactNode;
  className?: string;
};

const PageContainer = ({ children, className }: PageContainerProps) => {
  return (
    <main className={classNames('flex-1 px-6 pb-8 lg:px-10 lg:pb-10', className)}>
      {children}
    </main>
  );
};

export default PageContainer;
