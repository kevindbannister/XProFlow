import type { ReactNode } from 'react';
import { classNames } from '../../lib/utils';

type PageContainerProps = {
  children: ReactNode;
  className?: string;
};

const PageContainer = ({ children, className }: PageContainerProps) => (
  <div className={classNames('mx-auto flex w-full max-w-6xl flex-col gap-8', className)}>
    {children}
  </div>
);

export default PageContainer;
